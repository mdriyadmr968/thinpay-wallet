"use client";

import { useUiStore } from "@/stores/use-ui-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { useTestnetBalances } from "@/hooks/use-testnet-balances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Coins, 
  Layers,
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { formatUsd } from "@/lib/utils";

export default function DashboardPage() {
  const { setCopilotOpen, setSendOpen, setReceiveOpen } = useUiStore();
  const { isConnected, address } = useWalletStore();
  const { balances, totalUsd, isLoading } = useTestnetBalances();

  return (
    <div className="space-y-6">
      {/* Testnet Warning / Info Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              ThinPay Testnet Suite Active
              <Badge variant="default" className="text-[10px]">Multi-Chain</Badge>
            </h4>
            <p className="text-xs text-slate-400">
              Risk-free DeFi exploration across Sepolia, Amoy, BSC, Base & Solana Devnet.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCopilotOpen(true)}
            className="text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
          >
            Ask AI Copilot
          </Button>
        </div>
      </div>

      {/* Main Net Worth Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Live Testnet Net Worth
              </span>
              <Badge variant="cyan" className="flex items-center gap-1 text-[11px]">
                <TrendingUp className="h-3 w-3" />
                {isLoading ? "Syncing..." : "On-Chain Live"}
              </Badge>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white font-mono">
                {isLoading ? (
                  <span className="flex items-center gap-2 text-2xl text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                    Fetching RPCs...
                  </span>
                ) : (
                  formatUsd(totalUsd)
                )}
              </h2>
              <span className="text-sm font-medium text-emerald-400 flex items-center">
                +2.8% (24h)
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setSendOpen(true)}
                className="flex-col h-auto py-3 px-2 gap-1 rounded-xl"
              >
                <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                <span className="text-xs">Send</span>
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setReceiveOpen(true)}
                className="flex-col h-auto py-3 px-2 gap-1 rounded-xl"
              >
                <ArrowDownLeft className="h-5 w-5 text-cyan-400" />
                <span className="text-xs">Receive</span>
              </Button>
              <Link href="/swap" className="w-full">
                <Button variant="secondary" className="w-full flex-col h-auto py-3 px-2 gap-1 rounded-xl">
                  <ArrowLeftRight className="h-5 w-5 text-amber-400" />
                  <span className="text-xs">Swap</span>
                </Button>
              </Link>
              <Link href="/baskets" className="w-full">
                <Button variant="secondary" className="w-full flex-col h-auto py-3 px-2 gap-1 rounded-xl">
                  <Layers className="h-5 w-5 text-purple-400" />
                  <span className="text-xs">Baskets</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* AI Smart Contract Scanner Quick Widget */}
        <Card className="glass flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
              </div>
              <CardTitle className="text-base">AI Safety Auditor</CardTitle>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Instant zero-cost smart contract analysis powered by Google Gemini 3.8 Flash.
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Scanned Contracts</span>
                <span className="font-semibold text-emerald-400">2,410</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Honeypots Detected</span>
                <span className="font-semibold text-red-400">148</span>
              </div>
            </div>
            <Link href="/auditor" className="w-full mt-4 block">
              <Button variant="outline" className="w-full text-xs border-cyan-500/30 text-cyan-300">
                Open Safety Auditor
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Asset Breakdown Section (Live RPC) */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-base">Live Testnet Assets</CardTitle>
          </div>
          <Link href="/portfolio" className="text-xs text-emerald-400 hover:underline flex items-center">
            View All <ChevronRight className="h-3 w-3 ml-0.5" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-800/80">
            {balances.map((asset) => (
              <div key={asset.chainId} className="py-3 flex items-center justify-between hover:bg-slate-800/20 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200 border border-slate-700">
                    {asset.symbol}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{asset.chainName}</div>
                    <div className="text-xs text-slate-400">{asset.symbol} • ${asset.usdPrice}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white font-mono">{asset.balance} {asset.symbol}</div>
                  <div className="text-xs text-slate-400 flex items-center justify-end gap-1.5">
                    <span>{formatUsd(asset.usdValue)}</span>
                    <span className="text-emerald-400">{asset.change24h}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
