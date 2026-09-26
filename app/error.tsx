"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-white">Something Went Wrong</h2>
      <p className="text-xs text-slate-400 max-w-sm">
        {error.message || "An unexpected error occurred while loading this module."}
      </p>
      <Button variant="secondary" size="sm" onClick={() => reset()} className="mt-2">
        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
        Try Again
      </Button>
    </div>
  );
}
