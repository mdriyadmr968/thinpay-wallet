import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Sparkles className="h-8 w-8" />
      </div>
      <h2 className="text-3xl font-black text-white">404 - Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm">
        The testnet module or resource you are looking for does not exist or has been relocated.
      </p>
      <Link href="/">
        <Button variant="gradient" size="sm" className="mt-2">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Overview
        </Button>
      </Link>
    </div>
  );
}
