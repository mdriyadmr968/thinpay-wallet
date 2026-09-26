"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeftRight, 
  ArrowDown, 
  Settings2, 
  Sparkles, 
  Info, 
  Loader2, 
  CheckCircle2 
} from "lucide-react";

const TOKENS = [
  { symbol: "ETH", name: "Ethereum", chain: "Sepolia", rate: 2600 },
  { symbol: "USDC", name: "USD Coin", chain: "Sepolia", rate: 1 },
  { symbol: "POL", name: "Polygon", chain: "Amoy", rate: 0.5 },
  { symbol: "BNB", name: "Binance Coin", chain: "BSC Testnet", rate: 580 },
  { symbol: "SOL", name: "Solana", chain: "Devnet", rate: 130 },
];

export default function SwapPage() {
  const [fromToken, setFromToken] = React.useState(TOKENS[0]);
  const [toToken, setToToken] = React.useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = React.useState("0.1");
  const [slippage, setSlippage] = React.useState("0.5");
  const [loading, setLoading] = React.useState(false);
  const [swapSuccess, setSwapSuccess] = React.useState(false);

  // Calculate swap output
  const toAmount = React.useMemo(() => {
    const val = parseFloat(fromAmount);
    if (isNaN(val) || val <= 0) return "0.00";
    const usdValue = val * fromToken.rate;
    const output = usdValue / toToken.rate;
    return output.toFixed(4);
  }, [fromAmount, fromToken, toToken]);

  const handleInvert = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleSwap = async () => {
    setLoading(true);
    setSwapSuccess(false);
    try {
      // Simulate swap execution with backend 0x API quote
      await new Promise((r) => setTimeout(r, 1200));
      setSwapSuccess(true);
      setTimeout(() => setSwapSuccess(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <ArrowLeftRight className="h-6 w-6 text-emerald-400" />
          Testnet Swap & Bridge
        </h1>
        <p className="text-xs text-slate-400">
          Instant multi-chain liquidity aggregation with 0x Protocol testnet routing.
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-slate-300">Swap</CardTitle>
          <div className="flex items-center gap-1.5">
            {["0.1", "0.5", "1.0"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlippage(s)}
                className={`px-2 py-0.5 text-[11px] rounded-lg border transition-all ${
                  slippage === s
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          {/* Pay Input */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>You Pay</span>
              <span>Balance: 1.4285 {fromToken.symbol}</span>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                step="any"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent border-0 text-2xl font-mono text-white p-0 focus-visible:ring-0"
              />
              <select
                value={fromToken.symbol}
                onChange={(e) => {
                  const found = TOKENS.find((t) => t.symbol === e.target.value);
                  if (found) setFromToken(found);
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
              >
                {TOKENS.map((t) => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol} ({t.chain})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Invert Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              type="button"
              onClick={handleInvert}
              className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center shadow-lg transition-transform active:rotate-180 duration-200"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>

          {/* Receive Output */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>You Receive</span>
              <span>Estimated Quote</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono text-white flex-1">{toAmount}</span>
              <select
                value={toToken.symbol}
                onChange={(e) => {
                  const found = TOKENS.find((t) => t.symbol === e.target.value);
                  if (found) setToToken(found);
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
              >
                {TOKENS.map((t) => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol} ({t.chain})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Exchange Details */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Exchange Rate:</span>
              <span className="font-mono text-slate-300">
                1 {fromToken.symbol} ≈ {(fromToken.rate / toToken.rate).toFixed(2)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Slippage Tolerance:</span>
              <span className="text-slate-300">{slippage}%</span>
            </div>
            <div className="flex justify-between">
              <span>Network Routing:</span>
              <span className="text-emerald-400">0x Testnet Liquidity Pool</span>
            </div>
          </div>

          {swapSuccess && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Swap executed successfully on testnet!</span>
            </div>
          )}

          <Button
            variant="gradient"
            className="w-full h-12 text-sm font-semibold rounded-xl"
            onClick={handleSwap}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Executing Swap...
              </>
            ) : (
              `Swap ${fromToken.symbol} for ${toToken.symbol}`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
