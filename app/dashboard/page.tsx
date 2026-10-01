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
  Loader2,
  Droplets
} from "lucide-react";
import Link from "next/link";
import { formatUsd } from "@/lib/utils";

export default function DashboardPage() {
  const { setCopilotOpen, setSendOpen, setReceiveOpen, setFaucetOpen } = useUiStore();
  const { isConnected, address } = useWalletStore();
  const { balances, totalUsd, isLoading } = useTestnetBalances();

  return (
    <div className="space-y-6">
      {/* Testnet Warning / Info Banner */}
      <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-sky-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
            <Sparkles className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              ThinPay Testnet Suite Active
              <Badge variant="default" className="text-[10px]">Multi-Chain</Badge>
            </h4>
            <p className="text-xs text-slate-600">
              Risk-free DeFi exploration across Sepolia, Amoy, BSC, Base & Solana Devnet.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFaucetOpen(true)}
            className="text-xs border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100 shadow-2xs font-semibold cursor-pointer"
          >
            <Droplets className="h-3.5 w-3.5 mr-1 text-sky-600" />
            1-Click Faucet
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCopilotOpen(true)}
            className="text-xs border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 shadow-2xs font-semibold cursor-pointer"
          >
            Ask AI Copilot
          </Button>
        </div>
      </div>

      {/* Main Net Worth Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-slate-200/90 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live Testnet Net Worth
              </span>
              <Badge variant="cyan" className="flex items-center gap-1 text-[11px]">
                <TrendingUp className="h-3 w-3 text-sky-600" />
                {isLoading ? "Syncing..." : "On-Chain Live"}
              </Badge>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-mono">
                {isLoading ? (
                  <span className="flex items-center gap-2 text-2xl text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    Fetching RPCs...
                  </span>
                ) : (
                  formatUsd(totalUsd)
                )}
              </h2>
              <span className="text-sm font-semibold text-emerald-700 flex items-center">
                +2.8% (24h)
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Action Buttons */}
            <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
              <Button 
                variant="secondary" 
                onClick={() => setSendOpen(true)}
                className="flex-col h-auto py-3 px-1.5 gap-1 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-800 shadow-2xs cursor-pointer"
              >
                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-semibold">Send</span>
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setReceiveOpen(true)}
                className="flex-col h-auto py-3 px-1.5 gap-1 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-800 shadow-2xs cursor-pointer"
              >
                <ArrowDownLeft className="h-5 w-5 text-sky-600" />
                <span className="text-xs font-semibold">Receive</span>
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setFaucetOpen(true)}
                className="flex-col h-auto py-3 px-1.5 gap-1 rounded-xl bg-sky-50/70 border border-sky-200/90 hover:bg-sky-100 text-sky-900 shadow-2xs cursor-pointer"
              >
                <Droplets className="h-5 w-5 text-sky-600" />
                <span className="text-xs font-semibold">Faucet</span>
              </Button>
              <Link href="/swap" className="w-full">
                <Button variant="secondary" className="w-full flex-col h-auto py-3 px-1.5 gap-1 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-800 shadow-2xs cursor-pointer">
                  <ArrowLeftRight className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-semibold">Swap</span>
                </Button>
              </Link>
              <Link href="/baskets" className="w-full">
                <Button variant="secondary" className="w-full flex-col h-auto py-3 px-1.5 gap-1 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-800 shadow-2xs cursor-pointer">
                  <Layers className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-semibold">Baskets</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* AI Smart Contract Scanner Quick Widget */}
        <Card className="bg-white border-slate-200/90 shadow-xs flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center border border-sky-200">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900">AI Safety Auditor</CardTitle>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Instant zero-cost smart contract analysis powered by Google Gemini 3.8 Flash.
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Scanned Contracts</span>
                <span className="font-bold text-emerald-700">2,410</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Honeypots Detected</span>
                <span className="font-bold text-red-600">148</span>
              </div>
            </div>
            <Link href="/auditor" className="w-full mt-4 block">
              <Button variant="outline" className="w-full text-xs border-sky-200 bg-white text-sky-800 hover:bg-sky-50 font-semibold shadow-2xs">
                Open Safety Auditor
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Asset Breakdown Section (Live RPC) */}
      <Card className="bg-white border-slate-200/90 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base font-bold text-slate-900">Live Testnet Assets</CardTitle>
          </div>
          <Link href="/portfolio" className="text-xs text-emerald-700 hover:underline flex items-center font-semibold">
            View All <ChevronRight className="h-3 w-3 ml-0.5" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {balances.map((asset) => (
              <div key={asset.chainId} className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200">
                    {asset.symbol}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{asset.chainName}</div>
                    <div className="text-xs text-slate-500">{asset.symbol} • ${asset.usdPrice}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 font-mono">{asset.balance} {asset.symbol}</div>
                  <div className="text-xs text-slate-500 flex items-center justify-end gap-1.5 font-medium">
                    <span>{formatUsd(asset.usdValue)}</span>
                    <span className="text-emerald-700">{asset.change24h}</span>
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
