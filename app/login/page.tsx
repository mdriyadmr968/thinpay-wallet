"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { useWalletStore } from "@/stores/use-wallet-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Wallet, 
  KeyRound, 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setWallet, isConnected, isDemo } = useWalletStore();
  const { isConnected: isWagmiConnected, address: wagmiAddress, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();

  const [demoLoading, setDemoLoading] = React.useState(false);

  // If already connected, redirect straight to dashboard
  React.useEffect(() => {
    if (isConnected || isWagmiConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, isWagmiConnected, router]);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/v1/auth/demo-login", {
        method: "POST",
      });
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
    } finally {
      setDemoLoading(false);
    }
  };

  const handleConnectWagmi = (connector: any) => {
    connect(
      { connector },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  };

  // Filter duplicate connectors by name
  const uniqueConnectors = React.useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((c) => {
      const key = c.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [connectors]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back link */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <Card className="w-full max-w-md glass-card border-slate-800/80 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-3">
            <Sparkles className="h-6 w-6 text-slate-950" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Connect to ThinPay
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Sign in with your Web3 wallet or launch an instant 1-Click testnet demo session.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Option A: 1-Click Instant Demo */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Instant 1-Click Demo
              </span>
              <Badge variant="default" className="text-[10px]">No Extension Needed</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Provision an active testnet account on Neon DB to explore DeFi Backets, Swaps, and AI Audits immediately.
            </p>
            <Button
              variant="gradient"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full h-11 text-xs font-semibold"
            >
              {demoLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating Demo Session...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 mr-2" />
                  Launch Instant Demo & Enter Dashboard
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Or Connect With Extension
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Option B: Injected Web3 Connectors */}
          <div className="space-y-2">
            {uniqueConnectors.map((connector) => (
              <Button
                key={connector.id || connector.name}
                variant="secondary"
                onClick={() => handleConnectWagmi(connector)}
                disabled={isPending}
                className="w-full justify-between h-12 rounded-xl text-xs sm:text-sm font-medium"
              >
                <span className="flex items-center gap-2.5">
                  <Wallet className="h-4 w-4 text-emerald-400" />
                  {connector.name}
                </span>
                <Badge variant="outline" className="text-[10px]">EVM Testnets</Badge>
              </Button>
            ))}
          </div>

          {/* Safety Disclaimer */}
          <div className="pt-2 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Strictly Testnet Environment • Zero Real Funds at Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
