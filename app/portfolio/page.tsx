"use client";

import * as React from "react";
import { useUiStore } from "@/stores/use-ui-store";
import { useTestnetBalances } from "@/hooks/use-testnet-balances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  WalletCards, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw,
  PieChart,
  Clock,
  Loader2
} from "lucide-react";
import { formatUsd } from "@/lib/utils";

const RECENT_TRANSACTIONS = [
  { id: "1", type: "Received", asset: "0.25 ETH", chain: "Sepolia", from: "0x71c...99b", time: "10 mins ago", status: "Confirmed" },
  { id: "2", type: "Swapped", asset: "0.05 ETH → 25 POL", chain: "Polygon Amoy", from: "ThinPay 0x Router", time: "2 hours ago", status: "Confirmed" },
  { id: "3", type: "DeFi Basket", asset: "Subscribed 0.1 ETH", chain: "Base Sepolia", from: "Layer2 Giants Basket", time: "1 day ago", status: "Confirmed" },
];

export default function PortfolioPage() {
  const { setSendOpen, setReceiveOpen } = useUiStore();
  const { balances, totalUsd, isLoading, refetch, isRefetching } = useTestnetBalances();

  return (
    <div className="space-y-6">
      {/* Header with quick summary & refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <WalletCards className="h-6 w-6 text-emerald-400" />
            Multi-Chain Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time aggregated view of your on-chain testnet assets across 4 EVM networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-xs text-slate-300 border-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh Balances
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setSendOpen(true)}
            className="text-xs"
          >
            <ArrowUpRight className="h-4 w-4 mr-1" /> Send
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setReceiveOpen(true)}
            className="text-xs"
          >
            <ArrowDownLeft className="h-4 w-4 mr-1 text-cyan-400" /> Receive
          </Button>
        </div>
      </div>

      {/* Allocation breakdown bar */}
      <Card className="glass">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PieChart className="h-4 w-4 text-emerald-400" />
              Dynamic Asset Allocation
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {formatUsd(totalUsd)} Total
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden gap-0.5">
            {balances.map((b, idx) => {
              const pct = totalUsd > 0 ? (b.usdValue / totalUsd) * 100 : 25;
              const colors = ["bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-cyan-500"];
              return (
                <div
                  key={b.chainId}
                  style={{ width: `${Math.max(pct, 5)}%` }}
                  className={colors[idx % colors.length]}
                  title={`${b.symbol} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-slate-400">
            {balances.map((b, idx) => {
              const pct = totalUsd > 0 ? ((b.usdValue / totalUsd) * 100).toFixed(1) : "0";
              const colors = ["bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-cyan-500"];
              return (
                <span key={b.chainId} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${colors[idx % colors.length]}`} />
                  {b.symbol} ({pct}%)
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Asset Table */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Testnet Holdings</span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-medium uppercase tracking-wider">
                <tr>
                  <th className="pb-3 pl-2">Asset</th>
                  <th className="pb-3">Chain</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3 text-right">Balance</th>
                  <th className="pb-3 text-right pr-2">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {balances.map((asset) => (
                  <tr key={asset.chainId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-white flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[11px] border border-slate-700">
                        {asset.symbol}
                      </div>
                      <div>
                        <div>{asset.chainName}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{asset.symbol}</div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <Badge variant="outline" className="text-[10px] py-0 px-2 uppercase">
                        {asset.chainId.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono">${asset.usdPrice}</td>
                    <td className="py-3.5 text-right font-mono font-medium text-white">
                      {asset.balance} {asset.symbol}
                    </td>
                    <td className="py-3.5 text-right font-mono font-semibold text-emerald-400 pr-2">
                      {formatUsd(asset.usdValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Recent Testnet Activity
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">Neon DB Synced</Badge>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-800/60">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{tx.type} • {tx.asset}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{tx.chain} • {tx.from}</div>
                </div>
                <div className="text-right">
                  <Badge variant="default" className="text-[10px]">{tx.status}</Badge>
                  <div className="text-[10px] text-slate-500 mt-1">{tx.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
