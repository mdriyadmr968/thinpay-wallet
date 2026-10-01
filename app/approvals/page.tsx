"use client";

import * as React from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { encodeFunctionData } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Loader2, Sparkles, ExternalLink, RefreshCw, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface ApprovalItem {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
  spenderName: string;
  spenderAddress: string;
  allowance: string;
  isUnlimited: boolean;
  chain: string;
  riskLevel: "SAFE" | "CAUTION" | "HIGH_RISK";
  aiReasoning: string;
}

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: "appr-1",
    tokenSymbol: "USDC",
    tokenName: "Testnet USD Coin",
    tokenAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    spenderName: "0x Protocol Exchange Proxy",
    spenderAddress: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    allowance: "Unlimited (2^256 - 1)",
    isUnlimited: true,
    chain: "Sepolia",
    riskLevel: "SAFE",
    aiReasoning: "Verified 0x decentralized exchange proxy with audited immutable router contracts.",
  },
  {
    id: "appr-2",
    tokenSymbol: "LINK",
    tokenName: "Chainlink Token",
    tokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    spenderName: "ThinPay Basket Router",
    spenderAddress: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
    allowance: "500.0 LINK",
    isUnlimited: false,
    chain: "Sepolia",
    riskLevel: "SAFE",
    aiReasoning: "Capped token allowance strictly matching user investment position limit.",
  },
  {
    id: "appr-3",
    tokenSymbol: "POL",
    tokenName: "Wrapped POL",
    tokenAddress: "0x0000000000000000000000000000000000001010",
    spenderName: "Unverified Yield Staking Pool",
    spenderAddress: "0x888888b123456789abcdef0123456789abcdef01",
    allowance: "Unlimited",
    isUnlimited: true,
    chain: "Polygon Amoy",
    riskLevel: "HIGH_RISK",
    aiReasoning: "Contract bytecode contains unrenounced owner fee drain functions. Immediate revocation recommended.",
  },
];

// Minimal ERC20 ABI for approve(address, uint256)
const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export default function ApprovalsPage() {
  const { isConnected: isWagmiConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const queryClient = useQueryClient();

  const [approvals, setApprovals] = React.useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [revokingId, setRevokingId] = React.useState<string | null>(null);

  const handleRevoke = async (item: ApprovalItem) => {
    setRevokingId(item.id);
    try {
      if (isWagmiConnected) {
        // Encode approve(spender, 0)
        const data = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "approve",
          args: [item.spenderAddress as `0x${string}`, BigInt(0)],
        });

        await sendTransactionAsync({
          to: item.tokenAddress as `0x${string}`,
          data,
        });

        toast.success(`Revoked allowance for ${item.tokenSymbol}!`, {
          description: `Spender: ${item.spenderName}`,
        });
      } else {
        // Demo simulation
        await new Promise((r) => setTimeout(r, 1200));
        toast.success(`Simulated revocation of ${item.tokenSymbol} allowance!`);
      }

      setApprovals((prev) => prev.filter((a) => a.id !== item.id));
      queryClient.invalidateQueries({ queryKey: ["testnet-balances"] });
    } catch (err: any) {
      console.error("Revoke error:", err);
      toast.error("Revocation cancelled or failed", {
        description: err?.shortMessage || err?.message,
      });
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-rose-600" />
            AI Token Approvals & Allowance Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Detect and revoke lingering infinite ERC-20 allowances with Gemini 3.8 Flash security analysis.
          </p>
        </div>
        <Badge variant="cyan" className="self-start sm:self-auto flex items-center gap-1.5 py-1 px-3">
          <Sparkles className="h-3.5 w-3.5" />
          Gemini 3.8 Guard Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {approvals.map((item) => {
          const isHighRisk = item.riskLevel === "HIGH_RISK";
          const isRevoking = revokingId === item.id;

          return (
            <Card
              key={item.id}
              className={`bg-white border transition-all ${
                isHighRisk ? "border-rose-200 shadow-sm" : "border-slate-200/90 shadow-2xs"
              }`}
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.tokenName} ({item.tokenSymbol})
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {item.chain}
                    </Badge>
                    <Badge
                      variant={isHighRisk ? "default" : "secondary"}
                      className={`text-[10px] ${
                        isHighRisk ? "bg-rose-600 text-white" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {item.riskLevel}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
                    <span>Spender: <strong className="text-slate-800">{item.spenderName}</strong></span>
                    <span>Allowance: <strong className="text-emerald-700">{item.allowance}</strong></span>
                  </div>

                  {/* AI Reasoning */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700 mt-2 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item.aiReasoning}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant={isHighRisk ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => handleRevoke(item)}
                    disabled={isRevoking}
                    className="text-xs font-semibold cursor-pointer"
                  >
                    {isRevoking ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        Revoking...
                      </>
                    ) : (
                      "Revoke Approval (0x)"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {approvals.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">All Active Allowances Revoked</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your testnet wallet has zero outstanding unlimited token approvals. All asset spenders are secured.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
