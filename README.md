# ThinPay Wallet (`thinpay-wallet`)
> **Next-Generation Multi-Chain Web3 Testnet DeFi Wallet & AI Copilot Suite**

ThinPay Wallet is a production-grade, multi-chain Web3 testnet application built for seamless portfolio management, token swaps, thematic crypto baskets, and AI-driven smart contract security auditing.

---

## 🌟 Key Features

- **Strictly Testnet Focused**: Zero real funds at risk. Native support for:
  - **Ethereum Sepolia** (`11155111`)
  - **Polygon Amoy** (`80002`)
  - **BNB Smart Chain Testnet** (`97`)
  - **Base Sepolia** (`84532`)
  - **Solana Devnet** (Lamports & SPL)
- **Free-Tier AI Superpowers**:
  - **Smart Contract Safety Auditor**: Bytecode inspection, honeypot detection, fee trap analysis, and risk scoring (0-100) powered by **Google Gemini 2.0 Flash**.
  - **Natural Language DeFi Copilot**: Conversational intent parser that prepares one-click transactions directly from human prompts.
- **Unified Modern Tech Stack**:
  - **Frontend**: Next.js 16 (App Router, Turbopack, React 19), Tailwind CSS v4, shadcn/ui design tokens, Zustand, Wagmi v2, TanStack React Query.
  - **Backend**: Modular Node.js/Express service (`web3service-node/`) with Drizzle ORM, PostgreSQL on Neon Serverless, and GraphQL Yoga mounted at `/graphql`.
- **Hybrid Wallet Experience**:
  - Web3 Injected providers (MetaMask, Coinbase, Rabby).
  - **1-Click Instant Demo Wallet**: Test all features immediately without requiring any browser extensions.

---

## 🏗️ Repository Architecture

```
thinpay-next/
├── app/                        # Next.js 16 App Router
│   ├── page.tsx                # Overview & Dashboard
│   ├── portfolio/page.tsx      # Multi-Chain Holdings & Allocation
│   ├── swap/page.tsx           # Testnet Swap & Cross-Chain Bridge
│   ├── baskets/page.tsx        # Curated DeFi Baskets (1-Click Invest)
│   ├── airdrops/page.tsx       # Testnet Airdrop Hunter & Claims
│   ├── auditor/page.tsx        # Gemini AI Smart Contract Auditor
│   ├── layout.tsx              # Root Layout with AppShell & Web3Provider
│   ├── globals.css             # Tailwind v4 glassmorphic dark theme
│   ├── not-found.tsx           # Custom 404 handler
│   └── error.tsx               # Client error boundary
├── components/
│   ├── ai/                     # CopilotDrawer & chat assistants
│   ├── layout/                 # DesktopSidebar, TopHeader, MobileNav, AppShell
│   ├── providers/              # Web3Provider (Wagmi + React Query)
│   ├── ui/                     # Atomic shadcn/ui components
│   └── wallet/                 # ConnectWalletModal, SendModal, ReceiveModal
├── lib/
│   ├── utils.ts                # cn, formatAddress, formatUsd
│   └── web3/wagmiConfig.ts     # Viem & Wagmi testnet client configuration
├── stores/
│   ├── use-ui-store.ts         # Navigation & modal states
│   └── use-wallet-store.ts     # Multi-chain wallet & demo session state
└── web3service-node/           # Modular Express Backend
    ├── src/
    │   ├── db/                 # Drizzle ORM schema, migration, and seeds
    │   ├── graphql/            # GraphQL Yoga schema and resolvers
    │   ├── routes/             # REST routes (/auth, /wallet, /swap, /ai)
    │   ├── services/           # EVM, Solana, 0x Swap, and Gemini AI services
    │   └── server.ts           # Central Express app & port binding
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20+)
- **Git**: Installed
- **Neon Database**: PostgreSQL connection string

### 2. Environment Setup

Frontend `.env.local` (`thinpay-next/.env.local`):
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=46fc298ae0d511f88be4f78acf36c167
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api/v1
NEXT_PUBLIC_GRAPHQL_URL=http://127.0.0.1:5000/graphql
```

Backend `.env` (`thinpay-next/web3service-node/.env`):
```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:***@ep-cool-flower-b4vds03v-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=AQ.***
ZERO_EX_API_KEY=d0f0825e-095b-4bdf-845a-26fa0dbb6b7d
JWT_SECRET=thinpay_jwt_secret_dev_key_2026_testnet
```

### 3. Database Migration & Seed
Run from the root or inside `thinpay-next`:
```bash
npm run db:migrate
npm run db:seed
```

### 4. Running the Development Servers

Run backend service (port 5000):
```bash
npm run dev:backend
```

Run frontend application (port 3000):
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the ThinPay Wallet interface!

---

## 🧪 Production Build Verification

Both the frontend and backend are configured for strict type-checking and zero-warning compilation:

```bash
# Build frontend
npm run build

# Build backend
npm run build:backend
```

---

## 🔒 Security & Testnet Safeguards
- **Strictly Testnet**: Mumbai and Goerli are deprecated. All RPC endpoints point to active publicnode testnet endpoints.
- **Environment Isolation**: `.env` and `.env.local` files are untracked by Git.
- **AI Rate Limiting**: Smart contract audits are cached in Neon DB to eliminate duplicate Gemini API calls.
