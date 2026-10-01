"use client";

import * as React from "react";
import { useConnect, useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useWalletStore } from "@/stores/use-wallet-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Sparkles, Check, Copy, ExternalLink, Loader2, KeyRound, Fingerprint } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { getApiUrl } from "@/lib/config";
import { createPasskeyCredential } from "@/lib/webauthn";
import { toast } from "sonner";

export function ConnectWalletModal() {
  const { 
    connectModalOpen, 
    setConnectModalOpen, 
    setWallet, 
    isConnected, 
    isDemo, 
    isPasskey,
    address, 
    setPasskeyWallet,
    disconnect: disconnectStore 
  } = useWalletStore();
  
  const { connectors, connect, isPending } = useConnect();
  const { address: wagmiAddress, isConnected: isWagmiConnected, chainId } = useAccount();
  const { disconnect: disconnectWagmi } = useDisconnect();
  const [demoLoading, setDemoLoading] = React.useState(false);
  const [passkeyLoading, setPasskeyLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handlePasskeyConnect = async () => {
    setPasskeyLoading(true);
    if (isWagmiConnected) {
      disconnectWagmi();
    }
    try {
      const res = await createPasskeyCredential("ThinPay User");
      setPasskeyWallet(res.smartAccountAddress, 11155111);
      toast.success("Passkey Authenticated!", {
        description: `ERC-4337 Smart Account: ${res.smartAccountAddress.slice(0, 10)}...`,
      });
    } catch (err: any) {
      toast.error("Passkey authentication failed", { description: err?.message });
    } finally {
      setPasskeyLoading(false);
    }
  };

  // Deduplicate connectors by name (prevents duplicate entries from EIP-6963 + injected)
  const uniqueConnectors = React.useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((c) => {
      const key = c.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [connectors]);

  // Sync Wagmi account state with wallet store (only when NOT in demo mode)
  React.useEffect(() => {
    if (isWagmiConnected && wagmiAddress && !isDemo) {
      setWallet(wagmiAddress, chainId || 11155111, false);
    }
  }, [isWagmiConnected, wagmiAddress, chainId, isDemo, setWallet]);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDemoConnect = async () => {
    setDemoLoading(true);
    if (isWagmiConnected) {
      disconnectWagmi();
    }
    try {
      // Call backend demo login
      const res = await fetch(getApiUrl("/auth/demo-login"), {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        const demoAddr = data.user?.walletAddress || data.user?.address || "0x71c8360f3a8b4119d691e84c0f0811ef78b40b64";
        setWallet(demoAddr, 11155111, true, data.token);
      } else {
        setWallet("0x71c8360f3a8b4119d691e84c0f0811ef78b40b64", 11155111, true);
      }
    } catch {
      setWallet("0x71c8360f3a8b4119d691e84c0f0811ef78b40b64", 11155111, true);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (isWagmiConnected) {
      disconnectWagmi();
    }
    disconnectStore();
  };

  return (
    <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-200">
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {isConnected ? "Wallet Connected" : "Connect Testnet Wallet"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 text-xs sm:text-sm">
            {isConnected
              ? "Your active session is connected to ThinPay multi-chain testnets."
              : "Select your preferred Web3 wallet or try instant 1-Click Demo Mode."}
          </DialogDescription>
        </DialogHeader>

        {isConnected && address ? (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Account Type</span>
                {isPasskey ? (
                  <Badge variant="cyan" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                    <Fingerprint className="h-3 w-3 mr-1" /> Passkey Smart Account (ERC-4337)
                  </Badge>
                ) : isDemo ? (
                  <Badge variant="cyan" className="text-[10px]">
                    <Sparkles className="h-3 w-3 mr-1" /> 1-Click Demo Smart Wallet
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-[10px]">
                    Injected Web3 EOA
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-200 shadow-2xs">
                <span className="font-mono text-sm text-slate-800 font-medium">
                  {formatAddress(address, 6)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2 text-xs text-slate-500 hover:text-slate-800"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="w-full h-11 rounded-xl font-medium"
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            {/* Instant Demo Option */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-emerald-800 text-sm">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Instant 1-Click Testnet Demo
                </div>
                <Badge variant="default" className="text-[10px]">Recommended</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No browser extension needed. Instantly explore multi-chain testnets and AI auditing.
              </p>
              <Button
                variant="gradient"
                className="w-full mt-2"
                onClick={handleDemoConnect}
                disabled={demoLoading}
              >
                {demoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <KeyRound className="h-4 w-4 mr-2" />
                )}
                Launch Instant Demo
              </Button>
            </div>

            {/* ERC-4337 Passkey Option */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-purple-900 text-sm">
                  <Fingerprint className="h-4 w-4 text-purple-600" />
                  Passkey Smart Account (ERC-4337)
                </div>
                <Badge variant="cyan" className="text-[10px] bg-purple-100 text-purple-800 border-purple-200">
                  Biometric
                </Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log in via Touch ID, Face ID, or Windows Hello. Gas-sponsored smart account.
              </p>
              <Button
                variant="secondary"
                className="w-full mt-2 bg-white hover:bg-purple-50 border-purple-200 text-purple-900 font-semibold"
                onClick={handlePasskeyConnect}
                disabled={passkeyLoading}
              >
                {passkeyLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Fingerprint className="h-4 w-4 mr-2 text-purple-600" />
                )}
                Sign In with Passkey / Biometrics
              </Button>
            </div>

            {/* Injected Connectors (MetaMask / Browser) */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                Web3 Providers
              </span>
              {uniqueConnectors.map((connector) => (
                <Button
                  key={connector.id || connector.name}
                  variant="secondary"
                  className="w-full justify-between h-12 rounded-xl text-sm border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-medium"
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                >
                  <span className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    {connector.name}
                  </span>
                  <Badge variant="outline" className="text-[10px]">EVM</Badge>
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
