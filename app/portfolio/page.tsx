"use client";

import * as React from "react";
import { useUiStore } from "@/stores/use-ui-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  WalletCards, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight, 
  ExternalLink, 
  RefreshCw,
  PieChart,
  ShieldCheck,
  Clock
} from "lucide-react";

interface Asset {
  chain: string;
  name: string;
  symbol: string;
  balance: string;
  price: string;
  value: string;
  allocation: number;
}

const PORTFOLIO_ASSETS: Asset[] = [
  { chain: "Sepolia", name: "Sepolia Ethereum", symbol: "ETH", balance: "1.4285", price: "$2,600.00", value: "$3,714.10", allocation: 33.6 },
  { chain: "BSC Testnet", name: "Binance Coin", symbol: "BNB", balance: "4.5000", price: "$580.00", value: "$2,610.00", allocation: 23.6 },
  { chain: "Solana Devnet", name: "Solana", symbol: "SOL", balance: "18.2000", price: "$130.00", value: "$2,366.00", allocation: 21.4 },
  { chain: "Base Sepolia", name: "Base ETH", symbol: "ETH", balance: "0.8500", price: "$2,600.00", value: "$2,210.00", allocation: 20.0 },
  { chain: "Polygon Amoy", name: "Polygon Ecosystem", symbol: "POL", balance: "320.0000", price: "$0.50", value: "$160.00", allocation: 1.4 },
];

const RECENT_TRANSACTIONS = [
  { id: "1", type: "Received", asset: "1.00 ETH", chain: "Sepolia", from: "0x71c...99b", time: "10 mins ago", status: "Confirmed" },
  { id: "2", type: "Swapped", asset: "0.2 ETH → 120 POL", chain: "Polygon Amoy", from: "ThinPay Swap", time: "2 hours ago", status: "Confirmed" },
  { id: "3", type: "DeFi Basket", asset: "Invested 0.5 ETH", chain: "Base Sepolia", from: "Layer2 Giants Basket", time: "1 day ago", status: "Confirmed" },
];

export default function PortfolioPage() {
  const { setSendOpen, setReceiveOpen } = useUiStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

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
            Real-time aggregated view of your testnet assets across 5 chains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs text-slate-300 border-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
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
              Asset Allocation
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">$11,060.10 Total</span>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden gap-0.5">
            <div style={{ width: "33.6%" }} className="bg-emerald-500" title="Sepolia ETH (33.6%)" />
            <div style={{ width: "23.6%" }} className="bg-amber-500" title="BSC BNB (23.6%)" />
            <div style={{ width: "21.4%" }} className="bg-purple-500" title="Solana SOL (21.4%)" />
            <div style={{ width: "20.0%" }} className="bg-cyan-500" title="Base ETH (20%)" />
            <div style={{ width: "1.4%" }} className="bg-indigo-500" title="Polygon POL (1.4%)" />
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> ETH (53.6%)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> BNB (23.6%)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-500" /> SOL (21.4%)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500" /> POL (1.4%)</span>
          </div>
        </CardContent>
      </Card>

      {/* Asset Table */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Testnet Holdings</CardTitle>
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
                {PORTFOLIO_ASSETS.map((asset) => (
                  <tr key={asset.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-white flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[11px] border border-slate-700">
                        {asset.symbol}
                      </div>
                      <div>
                        <div>{asset.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{asset.symbol}</div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <Badge variant="outline" className="text-[10px] py-0 px-2">
                        {asset.chain}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono">{asset.price}</td>
                    <td className="py-3.5 text-right font-mono font-medium text-white">
                      {asset.balance} {asset.symbol}
                    </td>
                    <td className="py-3.5 text-right font-mono font-semibold text-emerald-400 pr-2">
                      {asset.value}
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
