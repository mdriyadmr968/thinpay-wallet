import { parseAbi } from 'viem';
import { sepolia, polygonAmoy, bscTestnet, baseSepolia, arbitrumSepolia } from 'viem/chains';

export interface ChainConfig {
  id: number;
  name: string;
  slug: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  blockExplorer: string;
  viemChain: any;
}

export const SUPPORTED_EVM_CHAINS: Record<string, ChainConfig> = {
  sepolia: {
    id: sepolia.id,
    name: 'Ethereum Sepolia',
    slug: 'sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
    blockExplorer: 'https://sepolia.etherscan.io',
    viemChain: sepolia,
  },
  amoy: {
    id: polygonAmoy.id,
    name: 'Polygon Amoy',
    slug: 'amoy',
    nativeCurrency: { name: 'Polygon Ecosystem Token', symbol: 'POL', decimals: 18 },
    rpcUrl: process.env.POLYGON_AMOY_RPC_URL || 'https://polygon-amoy-bor-rpc.publicnode.com',
    blockExplorer: 'https://amoy.polygonscan.com',
    viemChain: polygonAmoy,
  },
  bsc_testnet: {
    id: bscTestnet.id,
    name: 'BNB Smart Chain Testnet',
    slug: 'bsc_testnet',
    nativeCurrency: { name: 'Testnet BNB', symbol: 'tBNB', decimals: 18 },
    rpcUrl: process.env.BSC_TESTNET_RPC_URL || 'https://bsc-testnet-rpc.publicnode.com',
    blockExplorer: 'https://testnet.bscscan.com',
    viemChain: bscTestnet,
  },
  base_sepolia: {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    slug: 'base_sepolia',
    nativeCurrency: { name: 'Base Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://base-sepolia-rpc.publicnode.com',
    blockExplorer: 'https://sepolia.basescan.org',
    viemChain: baseSepolia,
  },
  arbitrum_sepolia: {
    id: arbitrumSepolia.id,
    name: 'Arbitrum Sepolia',
    slug: 'arbitrum_sepolia',
    nativeCurrency: { name: 'Arbitrum Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL || 'https://arbitrum-sepolia-rpc.publicnode.com',
    blockExplorer: 'https://sepolia.arbiscan.io',
    viemChain: arbitrumSepolia,
  },
};

export const SOLANA_DEVNET_CONFIG = {
  name: 'Solana Devnet',
  slug: 'solana_devnet',
  rpcUrl: process.env.SOLANA_DEVNET_RPC_URL || 'https://api.devnet.solana.com',
  nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
  blockExplorer: 'https://explorer.solana.com/?cluster=devnet',
};

// Standard ERC-20 ABI
export const ERC20_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]);
