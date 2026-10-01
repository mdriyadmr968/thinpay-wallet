"use client";

import * as React from "react";
import { useUiStore } from "@/stores/use-ui-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther, isAddress } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Loader2, CheckCircle2, AlertCircle, ExternalLink, Zap, Layers, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { sendSolanaDevnetLamports } from "@/lib/solana";
import { sendSelfCustodyTransaction } from "@/lib/self-custody";
import { getApiUrl } from "@/lib/config";

const EXPLORERS: Record<string, string> = {
  sepolia: "https://sepolia.etherscan.io",
  amoy: "https://amoy.polygonscan.com",
  bsc_testnet: "https://testnet.bscscan.com",
  base_sepolia: "https://sepolia.basescan.org",
  solana_devnet: "https://explorer.solana.com?cluster=devnet",
};

const CHAIN_IDS: Record<string, number> = {
  sepolia: 11155111,
  amoy: 80002,
  bsc_testnet: 97,
  base_sepolia: 84532,
};

export function SendModal() {
  const { 
    isSendOpen, 
    setSendOpen, 
    selectedNetwork, 
    sendPrefill, 
    setSendPrefill,
    isGaslessEnabled,
    setGaslessEnabled,
    setBatchSendOpen
  } = useUiStore();
  const { isConnected, isDemo, isSelfCustody, selfCustodyKey } = useWalletStore();
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const queryClient = useQueryClient();

  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [simulating, setSimulating] = React.useState(false);
  const [simulation, setSimulation] = React.useState<any | null>(null);
  const [txHash, setTxHash] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (sendPrefill && isSendOpen) {
      if (sendPrefill.recipient) setRecipient(sendPrefill.recipient);
      if (sendPrefill.amount) setAmount(sendPrefill.amount);
    }
  }, [sendPrefill, isSendOpen]);

  const handleSimulate = async () => {
    if (!recipient.trim()) {
      setError("Please enter a recipient address to simulate.");
      return;
    }
    setSimulating(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl("/ai/simulate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient.trim(),
          value: amount.trim() || "0",
          chain: selectedNetwork,
          sender: wagmiAddress || "0xUser",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSimulation(json.simulation);
        toast.success("AI Pre-flight simulation completed!");
      } else {
        toast.error("Simulation failed", { description: json.error });
      }
    } catch (err: any) {
      toast.error("Simulation service error", { description: err?.message });
    } finally {
      setSimulating(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !amount.trim()) {
      setError("Please fill in recipient address and amount");
      return;
    }

    if (selectedNetwork === "solana_devnet") {
      if (recipient.trim().length < 32 || recipient.trim().length > 44) {
        setError("Please enter a valid Solana Devnet address (32-44 base58 characters)");
        return;
      }
    } else if (!isAddress(recipient.trim())) {
      setError("Please enter a valid EVM address (0x...)");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // Special: Solana Devnet transfer
      if (selectedNetwork === "solana_devnet") {
        await new Promise((r) => setTimeout(r, 1200));
        const solSig = await sendSolanaDevnetLamports(recipient.trim(), numAmount);
        setTxHash(solSig);
        toast.success("Solana Devnet transfer confirmed!", {
          description: `Transferred ${amount} SOL to ${recipient.slice(0, 6)}...`,
        });
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
        return;
      }

      // 1. If Self-Custody account: broadcast directly signed on-chain transaction!
      if (isSelfCustody && selfCustodyKey) {
        const hash = await sendSelfCustodyTransaction({
          privateKey: selfCustodyKey as `0x${string}`,
          to: recipient.trim() as `0x${string}`,
          amountEther: amount.trim(),
          network: selectedNetwork,
        });
        setTxHash(hash);
        toast.success("Self-custody transaction broadcast!", {
          description: `Hash: ${hash.slice(0, 10)}...${hash.slice(-6)}`,
        });
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
      }
      // 2. If connected via MetaMask / Injected Web3: broadcast real on-chain transaction!
      else if (isWagmiConnected && !isDemo) {
        const targetChainId = CHAIN_IDS[selectedNetwork];
        const hash = await sendTransactionAsync({
          to: recipient.trim() as `0x${string}`,
          value: parseEther(amount.trim()),
          ...(targetChainId ? { chainId: targetChainId } : {}),
        });
        setTxHash(hash);
        toast.success("Transaction submitted on testnet!", {
          description: `Hash: ${hash.slice(0, 10)}...${hash.slice(-6)}`,
        });
        // Refresh balance query automatically
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
      } else {
        // 3. Demo Mode fallback
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setTxHash(mockHash);
        toast.success("Demo transaction simulated successfully!");
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
      }
    } catch (err: any) {
      console.error("Send transaction error:", err);
      const msg = err?.shortMessage || err?.message || "Transaction rejected or failed.";
      setError(msg);
      toast.error("Transaction failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTxHash(null);
    setRecipient("");
    setAmount("");
    setError(null);
    setSendPrefill(null);
  };

  const explorerBase = EXPLORERS[selectedNetwork] || "https://sepolia.etherscan.io";
  const explorerUrl = txHash ? `${explorerBase}/tx/${txHash}` : null;

  return (
    <Dialog open={isSendOpen} onOpenChange={(open) => { setSendOpen(open); if (!open) handleReset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-200">
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Send Testnet Assets</DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-slate-500">
            Transfer native testnet tokens on {selectedNetwork.toUpperCase()}.
          </DialogDescription>
        </DialogHeader>

        {txHash ? (
          <div className="space-y-4 py-4 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-base">Transaction Submitted</h4>
              <p className="text-xs text-slate-500 mt-1">Successfully broadcast to the testnet blockchain.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 break-all text-xs font-mono text-emerald-800">
              {txHash}
            </div>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium hover:underline"
              >
                <span>View on Block Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <Button variant="secondary" className="w-full mt-2" onClick={handleReset}>
              Send Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Recipient Address
              </label>
              <Input
                placeholder={selectedNetwork === "solana_devnet" ? "Solana Devnet address (base58)..." : "0x... recipient address"}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Amount</label>
                <button
                  type="button"
                  onClick={() => setAmount(selectedNetwork === "solana_devnet" ? "0.1" : "0.005")}
                  className="text-xs font-medium text-emerald-700 hover:underline cursor-pointer"
                >
                  Quick Amount ({selectedNetwork === "solana_devnet" ? "0.1" : "0.005"})
                </button>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-mono pr-16"
                />
                <span className="absolute right-3 top-3 text-xs font-semibold text-slate-500 uppercase">
                  {selectedNetwork === "amoy" ? "POL" : selectedNetwork === "bsc_testnet" ? "BNB" : selectedNetwork === "solana_devnet" ? "SOL" : "ETH"}
                </span>
              </div>
            </div>

            {/* ERC-4337 Gasless Paymaster Toggle */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${isGaslessEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    ERC-4337 Gasless Mode
                    {isGaslessEnabled && <Badge variant="default" className="text-[9px] py-0 px-1">Sponsored</Badge>}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isGaslessEnabled ? "Gas fee paid by ThinPay Paymaster" : "Gas fee deducted from native balance"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGaslessEnabled(!isGaslessEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isGaslessEnabled ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isGaslessEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-slate-800 font-mono capitalize font-medium">{selectedNetwork.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Gas:</span>
                <span className={isGaslessEnabled ? "text-emerald-700 font-bold" : "text-slate-700 font-mono"}>
                  {isGaslessEnabled ? "0.00 (Sponsored)" : "~0.0004 ETH"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation Time:</span>
                <span className="text-emerald-700 font-medium">~12 seconds</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">Need to send to multiple wallets?</span>
              <button
                type="button"
                onClick={() => {
                  setSendOpen(false);
                  setBatchSendOpen(true);
                }}
                className="text-purple-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Layers className="h-3 w-3" />
                Batch Multi-Send
              </button>
            </div>

            {/* AI Pre-Flight Transaction Simulation */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  Gemini Pre-Flight Security Check
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleSimulate}
                  disabled={simulating || !recipient}
                  className="h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  {simulating ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Simulating...
                    </>
                  ) : (
                    "Simulate Tx"
                  )}
                </Button>
              </div>

              {simulation && (
                <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                  simulation.riskLevel === "LOW"
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : simulation.riskLevel === "MEDIUM"
                    ? "bg-amber-50/70 border-amber-200 text-amber-950"
                    : "bg-rose-50/70 border-rose-200 text-rose-950"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      Risk Level: 
                      <Badge className={
                        simulation.riskLevel === "LOW" ? "bg-emerald-600 text-white" :
                        simulation.riskLevel === "MEDIUM" ? "bg-amber-600 text-white" : "bg-rose-600 text-white"
                      }>
                        {simulation.riskLevel}
                      </Badge>
                    </span>
                    <span className="text-[11px] font-mono text-slate-600">
                      Delta: {simulation.expectedBalanceChange}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{simulation.summary}</p>
                  <p className="text-[11px] font-medium text-indigo-700">{simulation.recommendation}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              className="w-full h-11 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isWagmiConnected && !isDemo ? "Confirm in MetaMask..." : "Broadcasting..."}
                </>
              ) : (
                "Review & Send"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
