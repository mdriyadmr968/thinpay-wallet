"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  WalletCards, 
  ArrowLeftRight, 
  Layers, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/use-ui-store";

export function MobileNav() {
  const pathname = usePathname();
  const { setCopilotOpen } = useUiStore();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portfolio", label: "Portfolio", icon: WalletCards },
    { href: "/swap", label: "Swap", icon: ArrowLeftRight },
    { href: "/baskets", label: "Baskets", icon: Layers },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-xl transition-all",
                isActive ? "text-emerald-400 font-medium" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", isActive ? "text-emerald-400" : "text-slate-400")} />
              <span className="text-[11px] leading-tight">{link.label}</span>
            </Link>
          );
        })}

        {/* AI Copilot Button */}
        <button
          onClick={() => setCopilotOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-xl text-cyan-400 transition-all hover:opacity-90 active:scale-95"
        >
          <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center mb-0.5 shadow-sm shadow-cyan-500/30">
            <Sparkles className="h-3.5 w-3.5 text-slate-950" />
          </div>
          <span className="text-[11px] font-medium leading-tight text-cyan-300">AI Copilot</span>
        </button>
      </div>
    </div>
  );
}
