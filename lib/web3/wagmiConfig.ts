import { http, createConfig } from "wagmi";
import { sepolia, polygonAmoy, bscTestnet, baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const SUPPORTED_CHAINS = [sepolia, polygonAmoy, bscTestnet, baseSepolia] as const;

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [
    injected(),
  ],
  transports: {
    [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
    [polygonAmoy.id]: http("https://polygon-amoy-bor-rpc.publicnode.com"),
    [bscTestnet.id]: http("https://bsc-testnet-rpc.publicnode.com"),
    [baseSepolia.id]: http("https://base-sepolia-rpc.publicnode.com"),
  },
  ssr: true,
});
