import { create } from "zustand";

interface UiState {
  isSendOpen: boolean;
  isReceiveOpen: boolean;
  isCopilotOpen: boolean;
  isMobileNavOpen: boolean;
  selectedNetwork: string; // e.g. 'sepolia', 'amoy', 'bsc_testnet', 'base_sepolia', 'solana_devnet'
  setSendOpen: (open: boolean) => void;
  setReceiveOpen: (open: boolean) => void;
  setCopilotOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setSelectedNetwork: (network: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSendOpen: false,
  isReceiveOpen: false,
  isCopilotOpen: false,
  isMobileNavOpen: false,
  selectedNetwork: "sepolia",
  setSendOpen: (open) => set({ isSendOpen: open }),
  setReceiveOpen: (open) => set({ isReceiveOpen: open }),
  setCopilotOpen: (open) => set({ isCopilotOpen: open }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setSelectedNetwork: (network) => set({ selectedNetwork: network }),
}));
