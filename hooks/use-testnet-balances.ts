"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useWalletStore } from "@/stores/use-wallet-store";
import { createPublicClient, http, formatEther } from "viem";
import { sepolia, polygonAmoy, bscTestnet, baseSepolia } from "viem/chains";

export interface ChainBalance {
  chainId: string;
  chainName: string;
  symbol: string;
  balance: string;
  usdPrice: number;
  usdValue: number;
  change24h: string;
}

const DEFAULT_PRICES: Record<string, number> = {
  ETH: 2650,
  POL: 0.52,
  BNB: 585,
  SOL: 135,
};

const CHAINS = [
  {
    id: "sepolia",
    name: "Ethereum Sepolia",
    symbol: "ETH",
    viemChain: sepolia,
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  },
  {
    id: "amoy",
    name: "Polygon Amoy",
    symbol: "POL",
    viemChain: polygonAmoy,
    rpcUrl: "https://polygon-amoy-bor-rpc.publicnode.com",
  },
  {
    id: "bsc_testnet",
    name: "BNB Smart Chain",
    symbol: "BNB",
    viemChain: bscTestnet,
    rpcUrl: "https://bsc-testnet-rpc.publicnode.com",
  },
  {
    id: "base_sepolia",
    name: "Base Sepolia",
    symbol: "ETH",
    viemChain: baseSepolia,
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
  },
];

export function useTestnetBalances() {
  const { address: storeAddress } = useWalletStore();
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();

  // Prioritize active connected Web3 extension address, then store address
  const activeAddress = wagmiAddress || storeAddress || null;

  const query = useQuery({
    queryKey: ["testnet-balances", activeAddress],
    queryFn: async (): Promise<ChainBalance[]> => {
      if (!activeAddress) {
        return CHAINS.map((chain) => ({
          chainId: chain.id,
          chainName: chain.name,
          symbol: chain.symbol,
          balance: "0.0000",
          usdPrice: DEFAULT_PRICES[chain.symbol] || 1,
          usdValue: 0,
          change24h: "+2.4%",
        }));
      }

      const results = await Promise.all(
        CHAINS.map(async (chain) => {
          let balNum = 0;

          // 1. Try backend API first
          try {
            const res = await fetch(
              `http://127.0.0.1:5000/api/v1/wallet/${chain.id}/${activeAddress}/balance`
            );
            if (res.ok) {
              const data = await res.json();
              // Backend returns { status: 'success', data: { balance: '0.05' } }
              const balStr = data.data?.balance ?? data.balance;
              if (balStr !== undefined && balStr !== null) {
                balNum = parseFloat(balStr);
              }
            }
          } catch (backendErr) {
            // Backend offline or unreachable
          }

          // 2. Direct on-chain Viem fallback if backend returned 0 or failed
          if (balNum === 0) {
            try {
              const client = createPublicClient({
                chain: chain.viemChain,
                transport: http(chain.rpcUrl, { timeout: 6000 }),
              });
              const wei = await client.getBalance({
                address: activeAddress as `0x${string}`,
              });
              balNum = parseFloat(formatEther(wei));
            } catch (rpcErr) {
              // RPC failed or timed out
            }
          }

          const price = DEFAULT_PRICES[chain.symbol] || 1;
          return {
            chainId: chain.id,
            chainName: chain.name,
            symbol: chain.symbol,
            balance: balNum.toFixed(4),
            usdPrice: price,
            usdValue: balNum * price,
            change24h: "+2.4%",
          };
        })
      );

      return results;
    },
    enabled: true,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 15, // Auto-refresh every 15 seconds
  });

  const totalUsd = (query.data || []).reduce((acc, curr) => acc + curr.usdValue, 0);

  return {
    balances: query.data || [],
    totalUsd,
    isLoading: query.isLoading,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
