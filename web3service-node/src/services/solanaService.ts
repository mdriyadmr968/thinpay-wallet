import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { SOLANA_DEVNET_CONFIG } from '../utils/web3Constants';
import { rpcCache, getOrSetCache } from '../utils/cache';

let connection: Connection | null = null;

export function getSolanaConnection(): Connection {
  if (!connection) {
    connection = new Connection(SOLANA_DEVNET_CONFIG.rpcUrl, 'confirmed');
  }
  return connection;
}

export function generateSolanaKeypair(mnemonicInput?: string) {
  const mnemonic = mnemonicInput || bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const keypair = Keypair.fromSeed(seed.slice(0, 32));

  return {
    mnemonic,
    publicKey: keypair.publicKey.toBase58(),
    secretKeyHex: Buffer.from(keypair.secretKey).toString('hex'),
  };
}

export async function getSolanaBalance(address: string) {
  const cacheKey = `solana_bal_${address}`;
  return getOrSetCache(rpcCache, cacheKey, async () => {
    const conn = getSolanaConnection();
    const pubKey = new PublicKey(address);
    const lamports = await conn.getBalance(pubKey);
    const sol = (lamports / LAMPORTS_PER_SOL).toFixed(4);

    return {
      chain: SOLANA_DEVNET_CONFIG.name,
      symbol: SOLANA_DEVNET_CONFIG.nativeCurrency.symbol,
      decimals: SOLANA_DEVNET_CONFIG.nativeCurrency.decimals,
      raw: lamports.toString(),
      balance: sol,
    };
  });
}

export async function getSolanaTransactionStatus(signature: string) {
  const conn = getSolanaConnection();
  try {
    const status = await conn.getSignatureStatus(signature, { searchTransactionHistory: true });
    const confirmation = status?.value?.confirmationStatus;
    const isError = !!status?.value?.err;

    return {
      signature,
      status: isError ? 'FAILED' : confirmation === 'finalized' || confirmation === 'confirmed' ? 'CONFIRMED' : 'PENDING',
      err: status?.value?.err || null,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    };
  } catch (error: any) {
    return {
      signature,
      status: 'PENDING',
      message: 'Transaction not found or still processing.',
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    };
  }
}
