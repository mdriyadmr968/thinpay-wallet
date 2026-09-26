"use client";

import * as React from "react";
import { useUiStore } from "@/stores/use-ui-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { useAccount } from "wagmi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ArrowDownLeft, ExternalLink } from "lucide-react";

const EXPLORERS: Record<string, string> = {
  sepolia: "https://sepolia.etherscan.io",
  amoy: "https://amoy.polygonscan.com",
  bsc_testnet: "https://testnet.bscscan.com",
  base_sepolia: "https://sepolia.basescan.org",
  solana_devnet: "https://explorer.solana.com?cluster=devnet",
};

export function ReceiveModal() {
  const { isReceiveOpen, setReceiveOpen, selectedNetwork } = useUiStore();
  const { address: storeAddress } = useWalletStore();
  const { address: wagmiAddress } = useAccount();
  const [copied, setCopied] = React.useState(false);

  const activeAddress = wagmiAddress || storeAddress || "0xAf187317F446d3D525a415C2c6b44781498b581b";

  const handleCopy = () => {
    navigator.clipboard.writeText(activeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeAddress)}&margin=8`;
  const explorerBase = EXPLORERS[selectedNetwork] || "https://sepolia.etherscan.io";
  const explorerUrl = `${explorerBase}/address/${activeAddress}`;

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

        <div className="flex flex-col items-center py-3 space-y-4">
          {/* Real High-Resolution Scannable QR Code */}
          <div className="h-52 w-52 rounded-2xl bg-white p-3 flex items-center justify-center shadow-xl border-4 border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`QR Code for ${activeAddress}`}
              className="h-44 w-44 object-contain rounded-lg"
            />
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

          <div className="flex items-center justify-between w-full text-xs text-slate-400 px-1">
            <span>Scan with any Web3 mobile wallet</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
            >
              <span>View Explorer</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
