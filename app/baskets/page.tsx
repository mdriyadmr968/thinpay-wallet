"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, TrendingUp, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface Basket {
  id: string;
  name: string;
  symbol: string;
  description: string;
  apy: string;
  risk: "Low" | "Medium" | "High";
  allocation: { token: string; percent: number; color: string }[];
}

const BASKETS: Basket[] = [
  {
    id: "l2-giants",
    name: "Layer-2 Giants Basket",
    symbol: "TP-L2G",
    description: "Curated index of high-throughput rollups and sidechain scaling protocols.",
    apy: "+18.4% APY",
    risk: "Medium",
    allocation: [
      { token: "POL", percent: 40, color: "bg-purple-500" },
      { token: "ARB", percent: 35, color: "bg-cyan-500" },
      { token: "OP", percent: 25, color: "bg-red-500" },
    ],
  },
  {
    id: "ai-depin",
    name: "AI & Autonomous Agents Basket",
    symbol: "TP-AI",
    description: "Exposure to decentralized computing networks, model inferencing, and AI tokens.",
    apy: "+32.1% APY",
    risk: "High",
    allocation: [
      { token: "TAO", percent: 50, color: "bg-emerald-500" },
      { token: "RNDR", percent: 30, color: "bg-amber-500" },
      { token: "FET", percent: 20, color: "bg-blue-500" },
    ],
  },
  {
    id: "defi-bluechips",
    name: "DeFi Bluechips Index",
    symbol: "TP-DBI",
    description: "Battle-tested liquidity protocols, automated market makers, and synthetic assets.",
    apy: "+9.8% APY",
    risk: "Low",
    allocation: [
      { token: "UNI", percent: 45, color: "bg-pink-500" },
      { token: "AAVE", percent: 35, color: "bg-cyan-400" },
      { token: "MKR", percent: 20, color: "bg-emerald-400" },
    ],
  },
];

export default function BasketsPage() {
  const [investingId, setInvestingId] = React.useState<string | null>(null);
  const [successId, setSuccessId] = React.useState<string | null>(null);

  const handleInvest = async (id: string) => {
    setInvestingId(id);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 3500);
    } finally {
      setInvestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="h-6 w-6 text-emerald-400" />
          Curated Crypto Baskets
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Diversify your testnet portfolio in a single transaction with weighted thematic indexes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BASKETS.map((basket) => (
          <Card key={basket.id} className="glass flex flex-col justify-between hover:border-slate-700/80 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={basket.risk === "Low" ? "default" : basket.risk === "Medium" ? "cyan" : "warning"}>
                  {basket.risk} Risk
                </Badge>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                  <TrendingUp className="h-3 w-3" />
                  {basket.apy}
                </span>
              </div>
              <CardTitle className="text-lg">{basket.name}</CardTitle>
              <span className="text-xs font-mono text-slate-400">{basket.symbol}</span>
              <p className="text-xs text-slate-400 mt-2">{basket.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-2">
                  Composition
                </span>
                {/* Visual Bar */}
                <div className="h-2.5 w-full rounded-full bg-slate-800 flex overflow-hidden gap-0.5 mb-2">
                  {basket.allocation.map((item) => (
                    <div
                      key={item.token}
                      style={{ width: `${item.percent}%` }}
                      className={item.color}
                      title={`${item.token} (${item.percent}%)`}
                    />
                  ))}
                </div>
                {/* Legend */}
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  {basket.allocation.map((item) => (
                    <span key={item.token}>
                      {item.token}: {item.percent}%
                    </span>
                  ))}
                </div>
              </div>

              {successId === basket.id && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Subscribed 0.1 ETH to {basket.symbol}!</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                variant="gradient"
                className="w-full text-xs font-semibold"
                onClick={() => handleInvest(basket.id)}
                disabled={investingId === basket.id}
              >
                {investingId === basket.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Minting Basket...
                  </>
                ) : (
                  <>
                    1-Click Invest (0.1 ETH)
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
