"use client";

import { useUiStore } from "@/stores/use-ui-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Wallet, ShieldAlert, Cpu } from "lucide-react";

const NETWORKS = [
  { id: "sepolia", name: "Sepolia", chain: "ETH" },
  { id: "amoy", name: "Amoy", chain: "POL" },
  { id: "bsc_testnet", name: "BSC Testnet", chain: "BNB" },
  { id: "base_sepolia", name: "Base Sepolia", chain: "BASE" },
  { id: "solana_devnet", name: "Solana Devnet", chain: "SOL" },
];

export function TopHeader() {
  const { selectedNetwork, setSelectedNetwork, setCopilotOpen } = useUiStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-4 md:px-8 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {/* Mobile Logo Mark */}
        <div className="md:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Sparkles className="h-4 w-4 text-slate-950" />
          </div>
          <span className="font-bold text-base text-white">ThinPay</span>
        </div>

        {/* Network selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            {NETWORKS.map((net) => (
              <option key={net.id} value={net.id} className="bg-slate-900 text-slate-200">
                {net.name}
              </option>
            ))}
          </select>
          <Badge variant="default" className="text-[10px] py-0 px-1.5 hidden sm:inline-flex">
            Testnet
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Quick Gemini Copilot trigger for desktop */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCopilotOpen(true)}
          className="hidden sm:inline-flex border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200"
        >
          <Cpu className="h-3.5 w-3.5 text-cyan-400 mr-1.5" />
          AI Copilot
        </Button>

        {/* Connect Wallet Trigger */}
        <Button
          variant="gradient"
          size="sm"
          className="font-medium text-xs sm:text-sm"
          id="connect-wallet-btn"
        >
          <Wallet className="h-4 w-4 mr-1.5" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
