"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useWalletStore } from "@/stores/use-wallet-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Bot, 
  ArrowLeftRight, 
  Layers, 
  Gift, 
  CheckCircle2, 
  Globe, 
  Zap, 
  Lock, 
  KeyRound,
  TrendingUp,
  Cpu
} from "lucide-react";
import { formatAddress } from "@/lib/utils";

const TESTNETS = [
  { name: "Ethereum Sepolia", symbol: "ETH", chainId: "11155111", color: "from-blue-500 to-indigo-500" },
  { name: "Polygon Amoy", symbol: "POL", chainId: "80002", color: "from-purple-500 to-pink-500" },
  { name: "BNB Smart Chain", symbol: "BNB", chainId: "97", color: "from-amber-500 to-yellow-500" },
  { name: "Base Sepolia", symbol: "ETH", chainId: "84532", color: "from-cyan-500 to-blue-500" },
  { name: "Solana Devnet", symbol: "SOL", chainId: "Devnet", color: "from-emerald-500 to-teal-500" },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "AI Smart Contract Auditor",
    description: "Scan any EVM or Solana contract for honeypots, owner traps, and fee manipulation in seconds using Google Gemini 3.8 Flash.",
    tag: "Gemini 3.8 AI",
    color: "text-cyan-400",
  },
  {
    icon: Bot,
    title: "Natural Language Copilot",
    description: "Converse with an AI assistant that reads your live wallet context, answers allocation questions, and drafts one-click transactions.",
    tag: "Context Aware",
    color: "text-emerald-400",
  },
  {
    icon: ArrowLeftRight,
    title: "0x Testnet Liquidity Aggregator",
    description: "Swap native and ERC-20 testnet tokens with low slippage, dynamic price quotes, and real on-chain transaction execution.",
    tag: "0x Protocol",
    color: "text-amber-400",
  },
  {
    icon: Layers,
    title: "Curated Thematic Baskets",
    description: "Diversify your testnet portfolio in a single transaction with weighted indexes like Layer-2 Giants, AI Agents, and DeFi Bluechips.",
    tag: "Neon DB Synced",
    color: "text-purple-400",
  },
  {
    icon: Gift,
    title: "Testnet Airdrop Hunter",
    description: "Discover and claim eligible multi-chain testnet tokens and retroactive reward allocations from leading testnet campaigns.",
    tag: "Airdrops",
    color: "text-pink-400",
  },
  {
    icon: KeyRound,
    title: "1-Click Instant Demo Wallet",
    description: "No MetaMask or browser extension required. Provision an instant, verified testnet session on Neon DB and start testing right away.",
    tag: "Zero Friction",
    color: "text-teal-400",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isConnected: isStoreConnected, address: storeAddress, setWallet } = useWalletStore();
  const { isConnected: isWagmiConnected, address: wagmiAddress } = useAccount();

  const isConnected = isStoreConnected || isWagmiConnected;
  const activeAddress = wagmiAddress || storeAddress;

  const handleQuickDemo = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/v1/auth/demo-login", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        const demoAddr = data.user?.walletAddress || data.user?.address || "0x71c8360f3a8b4119d691e84c0f0811ef78b40b64";
        setWallet(demoAddr, 11155111, true, data.token);
      } else {
        setWallet("0x71c8360f3a8b4119d691e84c0f0811ef78b40b64", 11155111, true);
      }
      router.push("/dashboard");
    } catch {
      setWallet("0x71c8360f3a8b4119d691e84c0f0811ef78b40b64", 11155111, true);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 overflow-x-hidden">
      {/* Sticky Marketing Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 md:px-12 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-slate-950" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            ThinPay <span className="text-emerald-400 font-semibold text-xs uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Wallet</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#testnets" className="hover:text-white transition-colors">Testnets</a>
          <Link href="/auditor" className="hover:text-white transition-colors">AI Auditor</Link>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </nav>

        <div className="flex items-center gap-3">
          {isConnected && activeAddress ? (
            <Link href="/dashboard">
              <Button variant="gradient" size="sm" className="text-xs font-semibold">
                <span>Enter Dashboard ({formatAddress(activeAddress)})</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="gradient" size="sm" className="text-xs font-semibold">
                  Launch App
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6 animate-in fade-in duration-500">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Multi-Chain Web3 Testnet DeFi Suite</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          The Intelligent Web3 Wallet for{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            DeFi & AI Audits
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Explore multi-chain DeFi across Sepolia, Amoy, BSC, Base & Solana with zero real financial risk. 
          Analyze smart contracts with Google Gemini AI and swap with 0x liquidity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-14">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="gradient" size="lg" className="w-full sm:w-auto h-12 px-7 text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/20">
              Open Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleQuickDemo}
            className="w-full sm:w-auto h-12 px-6 text-sm font-medium rounded-xl border border-slate-700/80 hover:bg-slate-800"
          >
            <KeyRound className="h-4 w-4 mr-2 text-cyan-400" />
            1-Click Instant Demo
          </Button>
          <Link href="/auditor" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 text-sm font-medium rounded-xl border-slate-800 text-slate-300 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4 mr-2 text-emerald-400" />
              Scan a Contract
            </Button>
          </Link>
        </div>

        {/* Interactive App Preview Mockup */}
        <div className="w-full max-w-4xl rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">thinpay.wallet / live testnet</span>
            </div>
            <Badge variant="cyan" className="text-[10px]">
              <Cpu className="h-3 w-3 mr-1" /> Gemini 3.8 Flash Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Testnet Balance</span>
              <div className="text-2xl font-bold font-mono text-white">$132.50</div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3" /> +2.8% on-chain
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Smart Contract Safety</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">92 / 100</div>
              <span className="text-[11px] text-slate-400">Verified Honeypot Free</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Active Testnets</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">5 Networks</div>
              <span className="text-[11px] text-slate-400">Sepolia, Amoy, BSC, Base, SOL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Testnets Section */}
      <section id="testnets" className="py-12 border-y border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Supported Zero-Risk Multi-Chain Environments
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {TESTNETS.map((net) => (
              <div
                key={net.name}
                className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 flex flex-col items-center justify-center text-center hover:border-slate-700 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white mb-2">
                  {net.symbol}
                </div>
                <span className="text-xs font-semibold text-white">{net.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">Chain ID: {net.chainId}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            Engineered for Modern Web3 Exploration
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Everything you need to test DeFi strategies, audit contracts, and manage multi-chain testnet assets with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} className="glass hover:border-slate-700/80 transition-all flex flex-col justify-between">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/60">
                      <Icon className={`h-5 w-5 ${feat.color}`} />
                    </div>
                    <Badge variant="cyan" className="text-[10px]">{feat.tag}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Security Callout */}
      <section id="security" className="py-16 max-w-5xl mx-auto px-6 w-full">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-cyan-500/10 p-8 md:p-12 text-center relative overflow-hidden backdrop-blur-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              100% Risk-Free Testnet Architecture
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              ThinPay strictly operates on testnets. No mainnet private keys or real funds are ever requested or accepted. 
              Enjoy free experimentation backed by reliable publicnode RPCs and serverless Neon PostgreSQL.
            </p>
            <div className="pt-2 flex justify-center">
              <Link href="/dashboard">
                <Button variant="gradient" size="lg" className="rounded-xl px-8 h-12 text-sm font-semibold">
                  Launch ThinPay Wallet Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">ThinPay Wallet</span>
            <span>— Next-Gen Multi-Chain Testnet DeFi & AI Suite</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/login" className="hover:text-slate-300">Sign In</Link>
            <Link href="/auditor" className="hover:text-slate-300">AI Auditor</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
