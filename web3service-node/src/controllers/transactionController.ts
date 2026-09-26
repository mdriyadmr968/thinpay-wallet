import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { broadcastRawTransaction, getTransactionStatus } from '../services/evmService';
import { getSolanaTransactionStatus } from '../services/solanaService';
import { SUPPORTED_EVM_CHAINS } from '../utils/web3Constants';
import { db } from '../db';
import { transactions } from '../db/schema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const submitTxSchema = z.object({
  chain: z.string().default('sepolia'),
  rawTransactionHex: z.string().startsWith('0x'),
  fromAddress: z.string().startsWith('0x'),
  toAddress: z.string().startsWith('0x'),
  amount: z.string(),
  tokenSymbol: z.string(),
});

export async function submitTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { chain, rawTransactionHex, fromAddress, toAddress, amount, tokenSymbol } = submitTxSchema.parse(req.body);
    const chainConfig = SUPPORTED_EVM_CHAINS[chain.toLowerCase()];

    if (!chainConfig) {
      return res.status(400).json({ status: 'error', message: `Unsupported chain ${chain}` });
    }

    // Broadcast raw transaction to testnet
    const hash = await broadcastRawTransaction(chain, rawTransactionHex as `0x${string}`);

    // Persist transaction record to database
    const [recordedTx] = await db
      .insert(transactions)
      .values({
        userId: req.user?.userId || null,
        hash,
        chainId: chainConfig.id,
        fromAddress: fromAddress.toLowerCase(),
        toAddress: toAddress.toLowerCase(),
        amount,
        tokenSymbol: tokenSymbol.toUpperCase(),
        status: 'PENDING',
      })
      .returning();

    return res.json({
      status: 'success',
      hash,
      transaction: recordedTx,
      explorerUrl: `${chainConfig.blockExplorer}/tx/${hash}`,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { chain, hash } = req.params;
    if (!chain || !hash) {
      return res.status(400).json({ status: 'error', message: 'chain and hash parameters are required.' });
    }

    if (chain.toLowerCase() === 'solana_devnet' || chain.toLowerCase() === 'solana') {
      const status = await getSolanaTransactionStatus(hash);
      return res.json({ status: 'success', data: status });
    }

    const txStatus = await getTransactionStatus(chain, hash as `0x${string}`);

    // Update status in PostgreSQL if confirmed or failed
    if (txStatus.status !== 'PENDING') {
      await db
        .update(transactions)
        .set({ status: txStatus.status })
        .where(eq(transactions.hash, hash));
    }

    return res.json({ status: 'success', data: txStatus });
  } catch (error) {
    next(error);
  }
}
