import { create } from "zustand";

interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnected: boolean;
  isDemo: boolean;
  jwtToken: string | null;
  isConnecting: boolean;
  connectModalOpen: boolean;
  setConnectModalOpen: (open: boolean) => void;
  setWallet: (address: string, chainId: number, isDemo?: boolean, token?: string) => void;
  setBalance: (balance: string) => void;
  setConnecting: (loading: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  balance: "0.00",
  isConnected: false,
  isDemo: false,
  jwtToken: null,
  isConnecting: false,
  connectModalOpen: false,
  setConnectModalOpen: (open) => set({ connectModalOpen: open }),
  setWallet: (address, chainId, isDemo = false, token = undefined) =>
    set({
      address,
      chainId,
      isConnected: true,
      isDemo,
      jwtToken: token || null,
      isConnecting: false,
      connectModalOpen: false,
    }),
  setBalance: (balance) => set({ balance }),
  setConnecting: (loading) => set({ isConnecting: loading }),
  disconnect: () =>
    set({
      address: null,
      chainId: null,
      balance: "0.00",
      isConnected: false,
      isDemo: false,
      jwtToken: null,
      isConnecting: false,
    }),
}));
