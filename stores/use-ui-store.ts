import { create } from "zustand";

export interface SendPrefillData {
  recipient?: string;
  amount?: string;
  network?: string;
}

interface UiState {
  isSendOpen: boolean;
  isReceiveOpen: boolean;
  isCopilotOpen: boolean;
  isMobileNavOpen: boolean;
  isGaslessEnabled: boolean;
  isBatchSendOpen: boolean;
  selectedNetwork: string; // e.g. 'sepolia', 'amoy', 'bsc_testnet', 'base_sepolia', 'solana_devnet'
  sendPrefill: SendPrefillData | null;
  setSendOpen: (open: boolean) => void;
  setReceiveOpen: (open: boolean) => void;
  setCopilotOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setGaslessEnabled: (enabled: boolean) => void;
  setBatchSendOpen: (open: boolean) => void;
  setSelectedNetwork: (network: string) => void;
  setSendPrefill: (data: SendPrefillData | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSendOpen: false,
  isReceiveOpen: false,
  isCopilotOpen: false,
  isMobileNavOpen: false,
  isGaslessEnabled: true, // Enabled by default for sponsored testnet experience
  isBatchSendOpen: false,
  selectedNetwork: "sepolia",
  sendPrefill: null,
  setSendOpen: (open) => set({ isSendOpen: open }),
  setReceiveOpen: (open) => set({ isReceiveOpen: open }),
  setCopilotOpen: (open) => set({ isCopilotOpen: open }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setGaslessEnabled: (enabled) => set({ isGaslessEnabled: enabled }),
  setBatchSendOpen: (open) => set({ isBatchSendOpen: open }),
  setSelectedNetwork: (network) => set({ selectedNetwork: network }),
  setSendPrefill: (data) => set({ sendPrefill: data }),
}));
