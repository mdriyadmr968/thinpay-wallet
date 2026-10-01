import { create } from "zustand";

interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnected: boolean;
  isDemo: boolean;
  isPasskey: boolean;
  isSelfCustody: boolean;
  selfCustodyKey: string | null;
  accountType: "eoa" | "smart_account" | "passkey" | "self_custody";
  jwtToken: string | null;
  solanaAddress: string | null;
  isSolanaConnected: boolean;
  isConnecting: boolean;
  connectModalOpen: boolean;
  setConnectModalOpen: (open: boolean) => void;
  setWallet: (address: string, chainId: number, isDemo?: boolean, token?: string, accountType?: "eoa" | "smart_account" | "passkey" | "self_custody") => void;
  setPasskeyWallet: (address: string, chainId: number) => void;
  setSelfCustodyWallet: (address: string, chainId: number, privateKey: string) => void;
  setSolanaWallet: (address: string) => void;
  disconnectSolana: () => void;
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
  isSelfCustody: false,
  selfCustodyKey: null,
  accountType: "eoa",
  jwtToken: null,
  solanaAddress: null,
  isSolanaConnected: false,
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
      isSelfCustody: accountType === "self_custody",
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
      isSelfCustody: false,
      selfCustodyKey: null,
      accountType: "passkey",
      isConnecting: false,
      connectModalOpen: false,
    }),
  setSelfCustodyWallet: (address, chainId, privateKey) =>
    set({
      address,
      chainId,
      isConnected: true,
      isDemo: false,
      isPasskey: false,
      isSelfCustody: true,
      selfCustodyKey: privateKey,
      accountType: "self_custody",
      isConnecting: false,
      connectModalOpen: false,
    }),
  setSolanaWallet: (address) =>
    set({
      solanaAddress: address,
      isSolanaConnected: true,
    }),
  disconnectSolana: () =>
    set({
      solanaAddress: null,
      isSolanaConnected: false,
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
      isSelfCustody: false,
      selfCustodyKey: null,
      accountType: "eoa",
      jwtToken: null,
      solanaAddress: null,
      isSolanaConnected: false,
      isConnecting: false,
    }),
}));
