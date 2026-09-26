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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 px-2 py-1 safe-area-pb shadow-lg">
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
                isActive ? "text-emerald-700 font-semibold" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", isActive ? "text-emerald-700" : "text-slate-500")} />
              <span className="text-[11px] leading-tight">{link.label}</span>
            </Link>
          );
        })}

        {/* AI Copilot Button */}
        <button
          onClick={() => setCopilotOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-xl text-sky-700 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
        >
          <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center mb-0.5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[11px] font-medium leading-tight text-sky-800">AI Copilot</span>
        </button>
      </div>
    </div>
  );
}
