"use client";

import * as React from "react";
import { useUiStore } from "@/stores/use-ui-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, QrCode, ArrowDownLeft } from "lucide-react";
import { formatAddress } from "@/lib/utils";

export function ReceiveModal() {
  const { isReceiveOpen, setReceiveOpen, selectedNetwork } = useUiStore();
  const { address, isConnected } = useWalletStore();
  const [copied, setCopied] = React.useState(false);

  const activeAddress = address || "0x1111111254fb6c44bac0bed2854e76f90643097d";

  const handleCopy = () => {
    navigator.clipboard.writeText(activeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isReceiveOpen} onOpenChange={setReceiveOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <ArrowDownLeft className="h-4 w-4 text-cyan-400" />
            </div>
            <DialogTitle className="text-xl">Receive Testnet Assets</DialogTitle>
          </div>
          <DialogDescription>
            Deposit testnet tokens to this address on {selectedNetwork.toUpperCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4 space-y-4">
          {/* QR Code Container */}
          <div className="h-48 w-48 rounded-2xl bg-white p-4 flex items-center justify-center shadow-xl border-4 border-slate-800">
            {/* SVG Visual QR Placeholder */}
            <div className="flex flex-col items-center justify-center text-slate-900">
              <QrCode className="h-28 w-28 text-slate-950" />
              <span className="text-[10px] font-mono font-bold mt-1 text-slate-700">SCAN TO PAY</span>
            </div>
          </div>

          <Badge variant="cyan" className="uppercase text-xs font-mono">
            Network: {selectedNetwork.replace("_", " ")}
          </Badge>

          {/* Copyable Address Box */}
          <div className="w-full flex items-center justify-between bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            <span className="font-mono text-xs text-slate-300 break-all select-all">
              {activeAddress}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="ml-2 h-9 px-3 shrink-0 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Only send testnet assets to this address. Sending mainnet assets may result in permanent loss.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
