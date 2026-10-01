import { create } from "zustand";

interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnected: boolean;
  isDemo: boolean;
  isPasskey: boolean;
  accountType: "eoa" | "smart_account" | "passkey";
  jwtToken: string | null;
  isConnecting: boolean;
  connectModalOpen: boolean;
  setConnectModalOpen: (open: boolean) => void;
  setWallet: (address: string, chainId: number, isDemo?: boolean, token?: string, accountType?: "eoa" | "smart_account" | "passkey") => void;
  setPasskeyWallet: (address: string, chainId: number) => void;
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
  isPasskey: false,
  accountType: "eoa",
  jwtToken: null,
  isConnecting: false,
  connectModalOpen: false,
  setConnectModalOpen: (open) => set({ connectModalOpen: open }),
  setWallet: (address, chainId, isDemo = false, token = undefined, accountType = isDemo ? "smart_account" : "eoa") =>
    set({
      address,
      chainId,
      isConnected: true,
      isDemo,
      isPasskey: accountType === "passkey",
      accountType,
      jwtToken: token || null,
      isConnecting: false,
      connectModalOpen: false,
    }),
  setPasskeyWallet: (address, chainId) =>
    set({
      address,
      chainId,
      isConnected: true,
      isDemo: false,
      isPasskey: true,
      accountType: "passkey",
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
      isPasskey: false,
      accountType: "eoa",
      jwtToken: null,
      isConnecting: false,
    }),
}));
