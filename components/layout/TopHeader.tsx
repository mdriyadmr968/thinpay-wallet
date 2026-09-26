"use client";

import { useUiStore } from "@/stores/use-ui-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Wallet, Cpu } from "lucide-react";
import { formatAddress } from "@/lib/utils";

const NETWORKS = [
  { id: "sepolia", name: "Sepolia", chain: "ETH" },
  { id: "amoy", name: "Amoy", chain: "POL" },
  { id: "bsc_testnet", name: "BSC Testnet", chain: "BNB" },
  { id: "base_sepolia", name: "Base Sepolia", chain: "BASE" },
  { id: "solana_devnet", name: "Solana Devnet", chain: "SOL" },
];

export function TopHeader() {
  const { selectedNetwork, setSelectedNetwork, setCopilotOpen } = useUiStore();
  const { isConnected, address, isDemo, setConnectModalOpen } = useWalletStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 md:px-8 backdrop-blur-xl shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile Logo Mark */}
        <div className="md:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-xs">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base text-slate-900">ThinPay</span>
        </div>

        {/* Network selector */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
          <Globe className="h-3.5 w-3.5 text-emerald-600" />
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            {NETWORKS.map((net) => (
              <option key={net.id} value={net.id} className="bg-white text-slate-800">
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
        {/* Quick Gemini Copilot trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCopilotOpen(true)}
          className="hidden sm:inline-flex border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100/80 shadow-2xs"
        >
          <Cpu className="h-3.5 w-3.5 text-sky-600 mr-1.5" />
          AI Copilot
        </Button>

        {/* Connect Wallet Trigger */}
        {isConnected && address ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setConnectModalOpen(true)}
            className="border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-800 flex items-center gap-2 shadow-2xs hover:bg-slate-50"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{formatAddress(address)}</span>
            {isDemo && (
              <Badge variant="cyan" className="text-[9px] py-0 px-1.5 inline-flex">
                Demo
              </Badge>
            )}
          </Button>
        ) : (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setConnectModalOpen(true)}
            className="font-medium text-xs sm:text-sm"
          >
            <Wallet className="h-4 w-4 mr-1.5" />
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
