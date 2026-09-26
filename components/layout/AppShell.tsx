"use client";

import { usePathname } from "next/navigation";
import { DesktopSidebar } from "./DesktopSidebar";
import { TopHeader } from "./TopHeader";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/login";

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Desktop Sidebar Navigation */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Header */}
        <TopHeader />

        {/* Dynamic Route Content */}
        <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Dock */}
      <MobileNav />
    </div>
  );
}
