"use client";

import { usePathname } from "next/navigation";
import { DesktopSidebar } from "./DesktopSidebar";
import { TopHeader } from "./TopHeader";
import { MobileNav } from "./MobileNav";
import { RouteTransition } from "./RouteTransition";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/login";

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
        <RouteTransition>{children}</RouteTransition>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Desktop Sidebar Navigation */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Header */}
        <TopHeader />

        {/* Dynamic Route Content with Route Transition */}
        <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl w-full mx-auto flex flex-col">
          <RouteTransition>{children}</RouteTransition>
        </main>
      </div>

      {/* Mobile Bottom Dock */}
      <MobileNav />
    </div>
  );
}
