import { Request, Response, NextFunction } from 'express';
import * as bip39 from 'bip39';
import { english, mnemonicToAccount } from 'viem/accounts';
import { generateSolanaKeypair, getSolanaBalance } from '../services/solanaService';
import { getNativeBalance, getErc20Balance } from '../services/evmService';
import { z } from 'zod';

export async function createWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const mnemonic = bip39.generateMnemonic(128); // 12 words
    const evmAccount = mnemonicToAccount(mnemonic);
    const solanaAccount = generateSolanaKeypair(mnemonic);

    return res.json({
      status: 'success',
      mnemonic,
      accounts: {
        evm: {
          address: evmAccount.address,
          derivationPath: "m/44'/60'/0'/0/0",
        },
        solana: {
          address: solanaAccount.publicKey,
          derivationPath: "m/44'/501'/0'/0'",
        },
      },
      warning: 'Never share your mnemonic phrase. ThinPay Wallet does not store unencrypted keys.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getBalance(req: Request, res: Response, next: NextFunction) {
  try {
    const { chain, address } = req.params;
    const tokenAddress = req.query.tokenAddress as string | undefined;

    if (!chain || !address) {
      return res.status(400).json({ status: 'error', message: 'chain and address parameters are required.' });
    }

    if (chain.toLowerCase() === 'solana_devnet' || chain.toLowerCase() === 'solana') {
      const balance = await getSolanaBalance(address);
      return res.json({ status: 'success', data: balance });
    }

    const evmAddress = address.toLowerCase() as `0x${string}`;

    if (tokenAddress && tokenAddress.startsWith('0x')) {
      const balance = await getErc20Balance(chain, tokenAddress as `0x${string}`, evmAddress);
      return res.json({ status: 'success', data: balance });
    }

    const balance = await getNativeBalance(chain, evmAddress);
    return res.json({ status: 'success', data: balance });
  } catch (error) {
    next(error);
  }
}
