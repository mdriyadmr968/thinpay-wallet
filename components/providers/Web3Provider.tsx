"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/web3/wagmiConfig";
import { ConnectWalletModal } from "@/components/wallet/ConnectWalletModal";
import { SendModal } from "@/components/wallet/SendModal";
import { BatchSendModal } from "@/components/wallet/BatchSendModal";
import { ReceiveModal } from "@/components/wallet/ReceiveModal";
import { CopilotDrawer } from "@/components/ai/CopilotDrawer";

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ConnectWalletModal />
        <SendModal />
        <BatchSendModal />
        <ReceiveModal />
        <CopilotDrawer />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
