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
  Sparkles,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: WalletCards },
  { href: "/swap", label: "Swap & Bridge", icon: ArrowLeftRight },
  { href: "/baskets", label: "DeFi Baskets", icon: Layers },
  { href: "/airdrops", label: "Airdrops", icon: Gift },
  { href: "/auditor", label: "AI Safety Auditor", icon: ShieldCheck, isAi: true },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              ThinPay <span className="text-emerald-400 font-semibold text-xs uppercase px-1 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Wallet</span>
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
                  ? "bg-slate-800/90 text-emerald-400 font-semibold shadow-sm border border-slate-700/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-300")} />
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

      {/* Testnet Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <div className="text-xs">
            <div className="font-medium text-emerald-400">Multi-Chain Active</div>
            <div className="text-[11px] text-slate-400">EVM & Solana Testnets</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
