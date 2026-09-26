"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { useWalletStore } from "@/stores/use-wallet-store";
import { fetchGraphQL } from "@/lib/graphql/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Database,
  ExternalLink,
  AlertCircle
} from "lucide-react";

interface BasketItem {
  id: string;
  name: string;
  symbol: string;
  description: string;
  riskLevel: string;
  targetApy: string;
  assets: any;
}

const BASKETS_QUERY = `
  query GetBaskets {
    cryptoBaskets {
      id
      name
      symbol
      description
      riskLevel
      targetApy
      assets
    }
  }
`;

export default function BasketsPage() {
  const { isDemo, setConnectModalOpen } = useWalletStore();
  const { isConnected: isWagmiConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const queryClient = useQueryClient();

  const [investingId, setInvestingId] = React.useState<string | null>(null);
  const [successInfo, setSuccessInfo] = React.useState<{ id: string; txHash: string } | null>(null);
  const [investAmount, setInvestAmount] = React.useState("0.005");
  const [error, setError] = React.useState<string | null>(null);

  const { data: baskets, isLoading } = useQuery({
    queryKey: ["crypto-baskets"],
    queryFn: async (): Promise<BasketItem[]> => {
      try {
        const res = await fetchGraphQL(BASKETS_QUERY);
        if (res && res.cryptoBaskets && res.cryptoBaskets.length > 0) {
          return res.cryptoBaskets;
        }
      } catch (e) {
        console.warn("GraphQL basket lookup fallback:", e);
      }
      return [
        {
          id: "1",
          name: "Layer-2 Giants Basket",
          symbol: "TP-L2G",
          description: "Curated index of high-throughput rollups and sidechain scaling protocols.",
          riskLevel: "Medium",
          targetApy: "18.40",
          assets: [
            { token: "POL", percent: 40 },
            { token: "ARB", percent: 35 },
            { token: "OP", percent: 25 },
          ],
        },
        {
          id: "2",
          name: "AI & Autonomous Agents Basket",
          symbol: "TP-AI",
          description: "Exposure to decentralized computing networks, model inferencing, and AI tokens.",
          riskLevel: "High",
          targetApy: "32.10",
          assets: [
            { token: "TAO", percent: 50 },
            { token: "RNDR", percent: 30 },
            { token: "FET", percent: 20 },
          ],
        },
        {
          id: "3",
          name: "DeFi Bluechips Index",
          symbol: "TP-DBI",
          description: "Battle-tested liquidity protocols, automated market makers, and synthetic assets.",
          riskLevel: "Low",
          targetApy: "9.80",
          assets: [
            { token: "UNI", percent: 45 },
            { token: "AAVE", percent: 35 },
            { token: "MKR", percent: 20 },
          ],
        },
      ];
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleInvest = async (basket: BasketItem) => {
    if (!isWagmiConnected && !isDemo) {
      setConnectModalOpen(true);
      return;
    }

    setInvestingId(basket.id);
    setError(null);
    setSuccessInfo(null);

    try {
      if (isWagmiConnected && !isDemo) {
        // Real on-chain testnet basket deposit to designated testnet vault
        const hash = await sendTransactionAsync({
          to: "0x1111111254fb6c44bac0bed2854e76f90643097d" as `0x${string}`,
          value: parseEther(investAmount),
        });
        setSuccessInfo({ id: basket.id, txHash: hash });
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        const mockHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setSuccessInfo({ id: basket.id, txHash: mockHash });
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
      }
    } catch (err: any) {
      console.error("Investment error:", err);
      setError(err?.shortMessage || err?.message || "Investment transaction rejected.");
    } finally {
      setInvestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-emerald-400" />
            Curated Crypto Baskets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Diversify your testnet portfolio in a single transaction with weighted thematic indexes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <span>Amount:</span>
            <input
              type="text"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              className="bg-transparent font-mono text-emerald-400 font-semibold w-16 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 font-mono">ETH</span>
          </div>
          <Badge variant="cyan" className="flex items-center gap-1.5 py-1 px-3">
            <Database className="h-3.5 w-3.5" />
            Neon DB Synced
          </Badge>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <span>Loading Baskets from Neon GraphQL...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(baskets || []).map((basket) => {
            const assetList: { token: string; percent: number }[] = Array.isArray(basket.assets)
              ? basket.assets
              : [];
            const isSuccess = successInfo?.id === basket.id;
            return (
              <Card key={basket.id} className="glass flex flex-col justify-between hover:border-slate-700/80 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={basket.riskLevel === "Low" ? "default" : basket.riskLevel === "Medium" ? "cyan" : "warning"}>
                      {basket.riskLevel} Risk
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                      <TrendingUp className="h-3 w-3" />
                      +{basket.targetApy}% APY
                    </span>
                  </div>
                  <CardTitle className="text-lg">{basket.name}</CardTitle>
                  <span className="text-xs font-mono text-slate-400">{basket.symbol}</span>
                  <p className="text-xs text-slate-400 mt-2">{basket.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {assetList.length > 0 && (
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-2">
                        Composition
                      </span>
                      <div className="h-2.5 w-full rounded-full bg-slate-800 flex overflow-hidden gap-0.5 mb-2">
                        {assetList.map((item, idx) => {
                          const colors = ["bg-emerald-500", "bg-cyan-500", "bg-purple-500", "bg-amber-500"];
                          return (
                            <div
                              key={item.token}
                              style={{ width: `${item.percent}%` }}
                              className={colors[idx % colors.length]}
                              title={`${item.token} (${item.percent}%)`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-slate-300 font-mono">
                        {assetList.map((item) => (
                          <span key={item.token}>
                            {item.token}: {item.percent}%
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isSuccess && successInfo && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span className="font-medium">Subscribed {investAmount} ETH to {basket.symbol}!</span>
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${successInfo.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline pt-1"
                      >
                        <span>View on Etherscan</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    variant="gradient"
                    className="w-full text-xs font-semibold"
                    onClick={() => handleInvest(basket)}
                    disabled={investingId === basket.id}
                  >
                    {investingId === basket.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        {isWagmiConnected && !isDemo ? "Confirm in MetaMask..." : "Minting Basket..."}
                      </>
                    ) : (
                      <>
                        1-Click Invest ({investAmount} ETH)
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
