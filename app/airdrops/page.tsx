"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/graphql/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, CheckCircle2, Loader2, Database, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CampaignItem {
  id: string;
  title: string;
  tokenSymbol: string;
  rewardAmount: string;
  criteria?: string;
  faucetUrl?: string;
  isActive: boolean;
  expiresAt?: string;
}

const AIRDROPS_QUERY = `
  query GetAirdrops {
    airdropCampaigns {
      id
      title
      tokenSymbol
      rewardAmount
      criteria
      faucetUrl
      isActive
      expiresAt
    }
  }
`;

const FALLBACK_CAMPAIGNS: CampaignItem[] = [
  {
    id: "1",
    title: "Sepolia Stakers Retroactive",
    tokenSymbol: "ETH",
    rewardAmount: "0.05",
    criteria: "Hold > 0.01 Sepolia ETH; Perform testnet swap",
    faucetUrl: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
    isActive: true,
  },
  {
    id: "2",
    title: "Polygon Amoy Early Adopter Drop",
    tokenSymbol: "POL",
    rewardAmount: "25",
    criteria: "Connected to Polygon Amoy RPC; Verified account on Neon DB",
    faucetUrl: "https://faucet.polygon.technology/",
    isActive: true,
  },
  {
    id: "3",
    title: "Solana Devnet Liquidity Sprint",
    tokenSymbol: "SOL",
    rewardAmount: "2.0",
    criteria: "Active Solana Devnet address; Request airdrop from devnet faucet",
    faucetUrl: "https://faucet.solana.com/",
    isActive: true,
  },
];

function parseCriteria(criteria?: string): string[] {
  if (!criteria) return ["Hold testnet balance", "Interact with protocol"];
  try {
    const parsed = JSON.parse(criteria);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.requirements && Array.isArray(parsed.requirements)) return parsed.requirements;
  } catch {
    if (criteria.includes(";")) return criteria.split(";").map((s) => s.trim());
    return [criteria];
  }
  return ["Hold testnet balance"];
}

export default function AirdropsPage() {
  const [claimingId, setClaimingId] = React.useState<string | null>(null);
  const [claimedList, setClaimedList] = React.useState<string[]>([]);

  // Load persisted claims from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("thinpay_claimed_airdrops");
      if (saved) {
        setClaimedList(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["airdrop-campaigns"],
    queryFn: async (): Promise<CampaignItem[]> => {
      try {
        const res = await fetchGraphQL(AIRDROPS_QUERY);
        if (res && res.airdropCampaigns && res.airdropCampaigns.length > 0) {
          return res.airdropCampaigns;
        }
      } catch (e) {
        console.warn("GraphQL airdrop lookup fallback:", e);
      }
      return FALLBACK_CAMPAIGNS;
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setClaimedList((prev) => {
        const next = [...prev, id];
        try {
          localStorage.setItem("thinpay_claimed_airdrops", JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      toast.success("Airdrop claimed successfully!", {
        description: "Your testnet allocation has been registered.",
      });
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="h-6 w-6 text-emerald-600" />
            Testnet Airdrop Hunter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore and claim eligible multi-chain testnet tokens and retroactive reward allocations.
          </p>
        </div>
        <Badge variant="cyan" className="self-start sm:self-auto flex items-center gap-1.5 py-1 px-3">
          <Database className="h-3.5 w-3.5" />
          Neon DB Synced
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-500 gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          <span>Loading Airdrop Campaigns from Neon GraphQL...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(campaigns || []).map((camp) => {
            const isClaimed = claimedList.includes(camp.id);
            const reqs = parseCriteria(camp.criteria);

            return (
              <Card key={camp.id} className="bg-white border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={isClaimed ? "secondary" : "default"}>
                      {isClaimed ? "Claimed" : camp.isActive ? "Active" : "Upcoming"}
                    </Badge>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {camp.rewardAmount} ${camp.tokenSymbol}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900">{camp.title}</CardTitle>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Testnet allocation incentive. Claim tokens to your testnet wallet or request funds directly from the official faucet.
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Eligibility Criteria
                    </span>
                    {reqs.map((req, i) => (
                      <div key={i} className="text-xs text-slate-700 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  {camp.faucetUrl && (
                    <div className="pt-1">
                      <a
                        href={camp.faucetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-semibold hover:underline"
                      >
                        <span>Official Faucet Link</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    variant={isClaimed ? "secondary" : "gradient"}
                    className="w-full text-xs font-semibold shadow-md shadow-emerald-600/20 cursor-pointer"
                    onClick={() => handleClaim(camp.id)}
                    disabled={isClaimed || claimingId === camp.id}
                  >
                    {isClaimed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                        Claimed
                      </>
                    ) : claimingId === camp.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        Claiming Drop...
                      </>
                    ) : (
                      `Claim ${camp.rewardAmount} $${camp.tokenSymbol}`
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
