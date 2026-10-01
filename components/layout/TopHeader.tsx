"use client";

import * as React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useUiStore } from "@/stores/use-ui-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Wallet, Cpu, Droplets } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { toast } from "sonner";

export const NETWORKS = [
  { id: "sepolia", name: "Sepolia", chain: "ETH", chainId: 11155111 },
  { id: "amoy", name: "Amoy", chain: "POL", chainId: 80002 },
  { id: "bsc_testnet", name: "BSC Testnet", chain: "BNB", chainId: 97 },
  { id: "base_sepolia", name: "Base Sepolia", chain: "BASE", chainId: 84532 },
  { id: "solana_devnet", name: "Solana Devnet", chain: "SOL", isNonEvm: true },
];

export function TopHeader() {
  const { selectedNetwork, setSelectedNetwork, setCopilotOpen, setFaucetOpen } = useUiStore();
  const { isConnected: isStoreConnected, address: storeAddress, isDemo, setConnectModalOpen } = useWalletStore();
  const { address: wagmiAddress, chainId: activeChainId, isConnected: isWagmiConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const isConnected = isStoreConnected || isWagmiConnected;
  const address = wagmiAddress || storeAddress;

  // 2-Way Sync: If user changes chain in MetaMask, update selectedNetwork in UI
  React.useEffect(() => {
    if (activeChainId && isWagmiConnected && !isDemo) {
      const match = NETWORKS.find((n) => n.chainId === activeChainId);
      if (match && match.id !== selectedNetwork) {
        setSelectedNetwork(match.id);
      }
    }
  }, [activeChainId, isWagmiConnected, isDemo, selectedNetwork, setSelectedNetwork]);

  const handleNetworkChange = async (networkId: string) => {
    setSelectedNetwork(networkId);
    const target = NETWORKS.find((n) => n.id === networkId);
    if (target?.isNonEvm) {
      toast.info("Switched to Solana Devnet", {
        description: "Devnet explorer queries and balance inspection active.",
      });
      return;
    }
    if (target && target.chainId && isWagmiConnected && !isDemo) {
      try {
        await switchChainAsync({ chainId: target.chainId });
        toast.success(`Network switched to ${target.name}`);
      } catch (err) {
        console.warn("Wallet rejected or cancelled chain switch:", err);
      }
    } else if (target) {
      toast.success(`Network set to ${target.name}`);
    }
  };

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
            onChange={(e) => handleNetworkChange(e.target.value)}
            className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            {NETWORKS.map((net) => (
              <option key={net.id} value={net.id} className="bg-white text-slate-800">
                {net.name} {net.isNonEvm ? "(Devnet)" : ""}
              </option>
            ))}
          </select>
          <Badge variant="default" className="text-[10px] py-0 px-1.5 hidden sm:inline-flex">
            Testnet
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* 1-Click Faucet Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFaucetOpen(true)}
          className="hidden sm:inline-flex border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 shadow-2xs font-semibold cursor-pointer"
        >
          <Droplets className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
          Faucet
        </Button>

        {/* Quick Gemini Copilot trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCopilotOpen(true)}
          className="hidden sm:inline-flex border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100/80 shadow-2xs font-semibold cursor-pointer"
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
            className="border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-800 flex items-center gap-2 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{formatAddress(address)}</span>
            {isDemo && (
              <Badge variant="cyan" className="text-[9px] py-0 px-1.5 inline-flex font-semibold">
                Demo
              </Badge>
            )}
          </Button>
        ) : (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setConnectModalOpen(true)}
            className="font-semibold text-xs sm:text-sm cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Wallet className="h-4 w-4 mr-1.5" />
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
