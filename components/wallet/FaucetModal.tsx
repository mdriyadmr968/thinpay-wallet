"use client";

import * as React from "react";
import { useUiStore } from "@/stores/use-ui-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Droplets, CheckCircle2, Loader2, Sparkles, ExternalLink, Clock, AlertCircle } from "lucide-react";
import { getApiUrl } from "@/lib/config";
import { toast } from "sonner";

const FAUCET_OPTIONS = [
  { id: "sepolia", name: "Sepolia", symbol: "ETH", drip: "0.05", iconColor: "text-sky-600", bg: "bg-sky-50" },
  { id: "amoy", name: "Polygon Amoy", symbol: "POL", drip: "10.0", iconColor: "text-purple-600", bg: "bg-purple-50" },
  { id: "bsc_testnet", name: "BSC Testnet", symbol: "BNB", drip: "0.05", iconColor: "text-amber-600", bg: "bg-amber-50" },
  { id: "base_sepolia", name: "Base Sepolia", symbol: "ETH", drip: "0.05", iconColor: "text-blue-600", bg: "bg-blue-50" },
  { id: "solana_devnet", name: "Solana Devnet", symbol: "SOL", drip: "1.0", iconColor: "text-teal-600", bg: "bg-teal-50" },
];

export function FaucetModal() {
  const { isFaucetOpen, setFaucetOpen, selectedNetwork, setSelectedNetwork } = useUiStore();
  const { address: storeAddress } = useWalletStore();
  const { address: wagmiAddress } = useAccount();
  const queryClient = useQueryClient();

  const activeAddress = wagmiAddress || storeAddress || "0xAf187317F446d3D525a415C2c6b44781498b581b";

  const [targetNet, setTargetNet] = React.useState(selectedNetwork || "sepolia");
  const [recipient, setRecipient] = React.useState(activeAddress);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeAddress) {
      setRecipient(activeAddress);
    }
  }, [activeAddress]);

  React.useEffect(() => {
    if (selectedNetwork) {
      setTargetNet(selectedNetwork);
    }
  }, [selectedNetwork]);

  const currentOption = FAUCET_OPTIONS.find((o) => o.id === targetNet) || FAUCET_OPTIONS[0];

  const handleRequestDrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      setError("Please specify a recipient wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(getApiUrl("/faucet/drip"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network: targetNet, address: recipient.trim() }),
      });

      const json = await res.json();
      if (res.ok && json.status === "success") {
        setResult(json.data);
        toast.success(`Dripped ${json.data.amount} ${json.data.symbol} to your wallet!`, {
          description: `Network: ${json.data.networkName}`,
        });
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
      } else {
        const msg = json.message || "Faucet claim failed or cooldown active.";
        setError(msg);
        toast.error("Faucet claim error", { description: msg });
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to contact testnet faucet service.";
      setError(msg);
      toast.error("Faucet service error", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <Dialog open={isFaucetOpen} onOpenChange={(open) => { setFaucetOpen(open); if (!open) handleReset(); }}>
      <DialogContent className="sm:max-w-md bg-white border-slate-200">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-200">
              <Droplets className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                1-Click Multi-Chain Faucet
                <Badge variant="cyan" className="text-[10px] py-0 px-1.5 font-mono">Instant Dripper</Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Receive free testnet tokens directly to your address with zero mainnet balance hurdles.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {result ? (
          <div className="space-y-4 py-3 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-base">
                +{result.amount} {result.symbol} Dispatched!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Successfully broadcast to {result.networkName}.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 break-all text-xs font-mono text-emerald-800">
              {result.txHash}
            </div>
            {result.explorerUrl && (
              <div>
                <a
                  href={result.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium hover:underline"
                >
                  <span>View On-Chain Receipt</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            <Button variant="secondary" className="w-full text-xs" onClick={handleReset}>
              Drip Another Network
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRequestDrip} className="space-y-4 py-2">
            {/* Network Selector Cards */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Select Testnet Network
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FAUCET_OPTIONS.map((net) => {
                  const isSelected = targetNet === net.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setTargetNet(net.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-500"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{net.name}</span>
                        <Badge variant={isSelected ? "default" : "outline"} className="text-[9px] py-0 px-1">
                          +{net.drip} {net.symbol}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono uppercase">
                        {net.id.replace("_", " ")}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Recipient Address</label>
                <button
                  type="button"
                  onClick={() => setRecipient(activeAddress)}
                  className="text-[11px] font-medium text-sky-600 hover:underline cursor-pointer"
                >
                  My Wallet
                </button>
              </div>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... or Solana pubkey"
                className="text-xs font-mono bg-slate-50 border-slate-200"
              />
            </div>

            {/* Allocation Notice */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Drip Amount:</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {currentOption.drip} {currentOption.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" /> Cooldown:
                </span>
                <span className="text-slate-500">1 hour per wallet</span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              disabled={loading}
              className="w-full h-11 text-xs font-semibold shadow-md shadow-emerald-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Dripping {currentOption.drip} {currentOption.symbol}...
                </>
              ) : (
                <>
                  <Droplets className="h-4 w-4 mr-2" />
                  Drip {currentOption.drip} {currentOption.symbol}
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
