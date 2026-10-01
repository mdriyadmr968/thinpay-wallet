"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  WalletCards, 
  ArrowLeftRight, 
  Layers, 
  Gift, 
  ShieldCheck, 
  ShieldAlert,
  Sparkles,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/use-ui-store";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: WalletCards },
  { href: "/swap", label: "Swap & Bridge", icon: ArrowLeftRight },
  { href: "/baskets", label: "DeFi Baskets", icon: Layers },
  { href: "/airdrops", label: "Airdrops", icon: Gift },
  { href: "/approvals", label: "Token Approvals", icon: ShieldAlert },
  { href: "/auditor", label: "AI Safety Auditor", icon: ShieldCheck, isAi: true },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const { setFaucetOpen } = useUiStore();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/90 bg-white/90 backdrop-blur-xl h-screen sticky top-0 shrink-0 select-none z-30 shadow-2xs">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              ThinPay <span className="text-emerald-700 font-semibold text-xs uppercase px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">Wallet</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Testnet Suite</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-emerald-50/90 text-emerald-800 font-semibold shadow-2xs border border-emerald-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-emerald-700" : "text-slate-500 group-hover:text-slate-700")} />
              <span>{item.label}</span>
              {item.isAi && (
                <Badge variant="cyan" className="ml-auto text-[10px] py-0 px-1.5">
                  Gemini
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 1-Click Faucet Trigger Button */}
      <div className="px-3 pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFaucetOpen(true)}
          className="w-full justify-start gap-2.5 text-xs text-sky-700 bg-sky-50/80 hover:bg-sky-100 border-sky-200 shadow-2xs font-semibold cursor-pointer"
        >
          <Droplets className="h-4 w-4 text-sky-600" />
          <span>1-Click Testnet Faucet</span>
        </Button>
      </div>

      {/* Testnet Status Footer */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/60">
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3 flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </div>
          <div className="text-xs">
            <div className="font-semibold text-emerald-800">Multi-Chain Active</div>
            <div className="text-[11px] text-slate-500">EVM & Solana Testnets</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
