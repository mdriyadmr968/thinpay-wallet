"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Sparkles, CheckCircle2, Clock, ExternalLink, Loader2, Coins } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  protocol: string;
  chain: string;
  reward: string;
  status: "Active" | "Claimed" | "Upcoming";
  description: string;
  requirements: string[];
}

const CAMPAIGNS: Campaign[] = [
  {
    id: "sepolia-stake",
    name: "Sepolia Stakers Retroactive",
    protocol: "ThinPay Protocol",
    chain: "Ethereum Sepolia",
    reward: "500 $TPAY",
    status: "Active",
    description: "Distributed to early testnet wallets maintaining an active staking balance.",
    requirements: ["Hold > 0.05 Sepolia ETH", "Performed at least 1 swap"],
  },
  {
    id: "amoy-early",
    name: "Polygon Amoy Early Adopter Drop",
    protocol: "Amoy Scaling Hub",
    chain: "Polygon Amoy",
    reward: "1,200 $AMOY",
    status: "Active",
    description: "Incentivizing smart contract testers on Polygon's next-generation PoS testnet.",
    requirements: ["Connected to Polygon Amoy RPC", "Verified account on Neon DB"],
  },
  {
    id: "solana-devnet-bonus",
    name: "Solana Devnet Liquidity Sprint",
    protocol: "Solana Foundation Testnet",
    chain: "Solana Devnet",
    reward: "25 $sSOL",
    status: "Active",
    description: "Rewards for testing SPL cross-chain bridge and lamport transfers.",
    requirements: ["Active Solana Devnet address", "Airdrop requested from devnet faucet"],
  },
];

export default function AirdropsPage() {
  const [claimingId, setClaimingId] = React.useState<string | null>(null);
  const [claimedList, setClaimedList] = React.useState<string[]>([]);

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setClaimedList((prev) => [...prev, id]);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Gift className="h-6 w-6 text-emerald-400" />
          Testnet Airdrop Hunter
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore and claim eligible multi-chain testnet tokens and retroactive reward allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CAMPAIGNS.map((camp) => {
          const isClaimed = claimedList.includes(camp.id);
          return (
            <Card key={camp.id} className="glass flex flex-col justify-between hover:border-slate-700/80 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={isClaimed ? "secondary" : "default"}>
                    {isClaimed ? "Claimed" : camp.status}
                  </Badge>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">
                    {camp.reward}
                  </span>
                </div>
                <CardTitle className="text-base">{camp.name}</CardTitle>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{camp.chain}</div>
                <p className="text-xs text-slate-400 mt-2">{camp.description}</p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1.5">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Criteria
                  </span>
                  {camp.requirements.map((req, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  variant={isClaimed ? "secondary" : "gradient"}
                  className="w-full text-xs font-semibold"
                  onClick={() => handleClaim(camp.id)}
                  disabled={isClaimed || claimingId === camp.id}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                      Claimed
                    </>
                  ) : claimingId === camp.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      Claiming Drop...
                    </>
                  ) : (
                    `Claim ${camp.reward}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
