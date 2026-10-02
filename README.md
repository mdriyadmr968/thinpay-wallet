# ThinPay Wallet (`thinpay-wallet`)
> **Next-Generation Multi-Chain Web3 Testnet DeFi Wallet & AI Copilot Suite**

ThinPay Wallet is a production-grade, multi-chain Web3 testnet application built for seamless portfolio management, token swaps, thematic crypto baskets, self-custody key management, and AI-driven smart contract security auditing.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-orange?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)

---

## 🌟 Key Features

### 1. Multi-Chain Testnet Focus
Strictly testnet environment with zero real funds at risk. Live integrations with:
- **Ethereum Sepolia** (`11155111`)
- **Polygon Amoy** (`80002`)
- **BNB Smart Chain Testnet** (`97`)
- **Base Sepolia** (`84532`)
- **Solana Devnet** (Lamports & SPL tokens via JSON-RPC)

### 2. Comprehensive Authentication & Custody Matrix
- **Self-Custody Testnet Vault**: Generate 12-word BIP-39 recovery phrases or import raw private keys. Encrypted locally with your password using browser `window.crypto.subtle` (PBKDF2 100k iterations + AES-256-GCM). Direct on-chain signing via `viem`.
- **ERC-4337 Passkey Smart Account**: WebAuthn biometric login (Windows Hello, Touch ID, Face ID). Sponsored gasless mode via ThinPay Paymaster and multi-recipient batch send.
- **Injected Web3 & Solana Adapters**: Connect MetaMask, Rabby, Coinbase Wallet, or Phantom for Solana Devnet.
- **Instant 1-Click Demo Mode**: Jump straight into the dashboard with a pre-seeded testnet wallet without installing any browser extensions.

### 3. Integrated AI Security & Copilot
- **Gemini Pre-Flight Transaction Simulation**: Simulates transaction parameters before broadcasting, predicting balance changes, counterparty risks, and contract trustworthiness.
- **Smart Contract Safety Auditor**: Deep bytecode and source code inspection evaluating reentrancy, honeypots, fee traps, and owner privileges using Google Gemini 2.0.
- **Token Approvals & Revocation**: Scans ERC-20 allowances across protocols and provides one-click `approve(spender, 0)` revoke transactions.
- **Natural Language DeFi Copilot**: Conversational AI assistant that translates natural prompts into testnet transactions.

### 4. DeFi Swaps & Thematic Baskets
- **0x Protocol Swap Aggregator**: Real-time testnet quote aggregation and slippage controls.
- **Thematic DeFi Baskets**: Curated multi-asset portfolios (*Layer 2 Giants*, *DeFi Bluechips*, *AI & Data*) with 1-click allocation.
- **1-Click Multi-Chain Faucet Aggregator**: Instant drips for Sepolia (0.05 ETH), Amoy (10 POL), BSC (0.05 BNB), Base (0.05 ETH), and Solana (1 SOL) with cooldown tracking.

---

## 🏗️ Repository Architecture

```
thinpay-next/
├── docs/                       # Technical Project Documentation
│   ├── ARCHITECTURE.md         # System Architecture & Component Flow
│   ├── AUTHENTICATION_AND_CUSTODY.md # Self-Custody, Passkeys, and Injected Web3
│   ├── AI_SECURITY_ENGINE.md   # Gemini Pre-Flight & Contract Auditor
│   ├── API_AND_GRAPHQL.md      # REST & GraphQL Yoga Reference
│   └── TESTNET_NETWORKS_SETUP.md # Multi-Chain RPCs, Explorers & Faucets
├── app/                        # Next.js 16 Pages & Layouts
│   ├── page.tsx                # Landing Page
│   ├── login/page.tsx          # Multi-Method Login (Vault, Passkey, Web3, Demo)
│   ├── dashboard/page.tsx      # Testnet Dashboard & Activity
│   ├── portfolio/page.tsx      # Multi-Chain Holdings & Balances
│   ├── swap/page.tsx           # 0x Swap & Bridge
│   ├── baskets/page.tsx        # Thematic DeFi Baskets
│   ├── approvals/page.tsx      # Token Allowance Manager & Revoker
│   ├── auditor/page.tsx        # Gemini AI Contract Auditor
│   └── airdrops/page.tsx       # Testnet Airdrop Claims
├── components/
│   ├── wallet/                 # SelfCustodyModal, BatchSendModal, SendModal, FaucetModal
│   ├── layout/                 # DesktopSidebar, TopHeader, AppShell
│   └── ai/                     # Gemini Copilot Drawer
├── lib/
│   ├── self-custody.ts         # BIP-39 & AES-256-GCM Web Crypto Implementation
│   ├── webauthn.ts             # ERC-4337 WebAuthn Biometrics
│   └── solana.ts               # Phantom Adapter & Solana Devnet JSON-RPC
├── stores/                     # Zustand Stores (Wallet, UI)
└── web3service-node/           # Express Backend Service
    ├── src/
    │   ├── routes/             # /auth, /faucet, /swap, /ai
    │   ├── services/           # geminiService, faucetService, swapService
    │   ├── db/                 # Drizzle ORM schema & Neon DB pool
    │   └── server.ts           # Express Server & GraphQL Yoga
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20+)
- **npm** or **pnpm**
- **Neon PostgreSQL**: Active database instance

### 2. Environment Variables

**Frontend (`thinpay-next/.env.local`):**
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=46fc298ae0d511f88be4f78acf36c167
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api/v1
NEXT_PUBLIC_GRAPHQL_URL=http://127.0.0.1:5000/graphql
```

**Backend (`thinpay-next/web3service-node/.env`):**
```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:***@***.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=AQ.***
ZERO_EX_API_KEY=d0f0825e-095b-4bdf-845a-26fa0dbb6b7d
JWT_SECRET=thinpay_jwt_secret_dev_key_2026_testnet
```

### 3. Database Migration & Seeding
From `thinpay-next`:
```bash
npm run db:migrate
npm run db:seed
```

### 4. Running Locally
Run backend service (port 5000):
```bash
npm run dev:backend
```

Run frontend application (port 3000):
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open ThinPay.

---

## 📖 Detailed Documentation

Please refer to [`docs/`](./docs/README.md) for comprehensive technical guides:
- [System Architecture](docs/ARCHITECTURE.md)
- [Authentication & Custody Models](docs/AUTHENTICATION_AND_CUSTODY.md)
- [AI Security Engine](docs/AI_SECURITY_ENGINE.md)
- [API & GraphQL Reference](docs/API_AND_GRAPHQL.md)
- [Multi-Chain Testnet Setup](docs/TESTNET_NETWORKS_SETUP.md)
