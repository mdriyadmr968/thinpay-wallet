import { createPublicClient, http, formatUnits, formatEther } from 'viem';
import { SUPPORTED_EVM_CHAINS, ERC20_ABI, ChainConfig } from '../utils/web3Constants';
import { rpcCache, getOrSetCache } from '../utils/cache';

const clientsMap = new Map<string, any>();

export function getPublicClient(chainSlug: string): { client: any; config: ChainConfig } {
  const normalized = chainSlug.toLowerCase();
  const config = SUPPORTED_EVM_CHAINS[normalized];
  if (!config) {
    throw new Error(`Unsupported chain '${chainSlug}'. Supported: ${Object.keys(SUPPORTED_EVM_CHAINS).join(', ')}`);
  }

  if (!clientsMap.has(normalized)) {
    const client = createPublicClient({
      chain: config.viemChain,
      transport: http(config.rpcUrl, {
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10_000,
      }),
    });
    clientsMap.set(normalized, client);
  }

  return { client: clientsMap.get(normalized)!, config };
}

export async function getNativeBalance(chainSlug: string, address: `0x${string}`) {
  const cacheKey = `native_bal_${chainSlug}_${address.toLowerCase()}`;
  return getOrSetCache(rpcCache, cacheKey, async () => {
    const { client, config } = getPublicClient(chainSlug);
    const balanceWei = await client.getBalance({ address });
    const formatted = formatEther(balanceWei);
    return {
      chain: config.name,
      symbol: config.nativeCurrency.symbol,
      decimals: config.nativeCurrency.decimals,
      raw: balanceWei.toString(),
      balance: formatted,
    };
  });
}

export async function getErc20Balance(chainSlug: string, tokenAddress: `0x${string}`, walletAddress: `0x${string}`) {
  const cacheKey = `erc20_bal_${chainSlug}_${tokenAddress.toLowerCase()}_${walletAddress.toLowerCase()}`;
  return getOrSetCache(rpcCache, cacheKey, async () => {
    const { client } = getPublicClient(chainSlug);

    const [rawBalance, decimals, symbol, name] = await Promise.all([
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [walletAddress],
      }),
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }),
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }),
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'name',
      }),
    ]);

    const formatted = formatUnits(rawBalance, decimals);
    return {
      tokenAddress,
      name,
      symbol,
      decimals,
      raw: rawBalance.toString(),
      balance: formatted,
    };
  });
}

export async function broadcastRawTransaction(chainSlug: string, rawTransactionHex: `0x${string}`) {
  const { client } = getPublicClient(chainSlug);
  const hash = await client.sendRawTransaction({ serializedTransaction: rawTransactionHex });
  return hash;
}

export async function getTransactionStatus(chainSlug: string, hash: `0x${string}`) {
  const { client, config } = getPublicClient(chainSlug);
  try {
    const receipt = await client.getTransactionReceipt({ hash });
    return {
      hash,
      status: receipt.status === 'success' ? 'CONFIRMED' : 'FAILED',
      blockNumber: receipt.blockNumber.toString(),
      gasUsed: receipt.gasUsed.toString(),
      explorerUrl: `${config.blockExplorer}/tx/${hash}`,
    };
  } catch (error: any) {
    return {
      hash,
      status: 'PENDING',
      message: 'Transaction is either pending or not yet mined.',
      explorerUrl: `${config.blockExplorer}/tx/${hash}`,
    };
  }
}
