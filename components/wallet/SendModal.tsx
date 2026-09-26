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
import { ArrowUpRight, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

const EXPLORERS: Record<string, string> = {
  sepolia: "https://sepolia.etherscan.io",
  amoy: "https://amoy.polygonscan.com",
  bsc_testnet: "https://testnet.bscscan.com",
  base_sepolia: "https://sepolia.basescan.org",
  solana_devnet: "https://explorer.solana.com?cluster=devnet",
};

export function SendModal() {
  const { isSendOpen, setSendOpen, selectedNetwork } = useUiStore();
  const { isConnected, isDemo } = useWalletStore();
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const queryClient = useQueryClient();

  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [txHash, setTxHash] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !amount.trim()) {
      setError("Please fill in recipient address and amount");
      return;
    }

    if (!isAddress(recipient.trim())) {
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
      // 1. If connected via MetaMask / Injected Web3: broadcast real on-chain transaction!
      if (isWagmiConnected && !isDemo) {
        const hash = await sendTransactionAsync({
          to: recipient.trim() as `0x${string}`,
          value: parseEther(amount.trim()),
        });
        setTxHash(hash);
        // Refresh balance query automatically
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
      } else {
        // 2. Demo Mode fallback
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setTxHash(mockHash);
        queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
      }
    } catch (err: any) {
      console.error("Send transaction error:", err);
      setError(err?.shortMessage || err?.message || "Transaction rejected or failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTxHash(null);
    setRecipient("");
    setAmount("");
    setError(null);
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
                placeholder="0x... recipient address"
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
                  onClick={() => setAmount("0.005")}
                  className="text-xs font-medium text-emerald-700 hover:underline cursor-pointer"
                >
                  Quick Amount (0.005)
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
                  {selectedNetwork === "amoy" ? "POL" : selectedNetwork === "bsc_testnet" ? "BNB" : "ETH"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-slate-800 font-mono capitalize font-medium">{selectedNetwork.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation Time:</span>
                <span className="text-emerald-700 font-medium">~12 seconds</span>
              </div>
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
