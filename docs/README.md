# ThinPay Documentation Index

Welcome to the comprehensive technical documentation for the ThinPay Web3 DeFi platform.

---

## 📚 Document Index

1. [System Architecture & Design (`ARCHITECTURE.md`)](./ARCHITECTURE.md)
   - Component topology and interaction flow
   - Frontend and backend microservice design
   - Blockchain RPC network bindings
   - Technology stack reference

2. [Authentication & Custody Models (`AUTHENTICATION_AND_CUSTODY.md`)](./AUTHENTICATION_AND_CUSTODY.md)
   - Self-Custody Vault (Web Crypto AES-256-GCM + BIP-39)
   - ERC-4337 Passkey Smart Account & Gasless Paymaster
   - Injected Web3 (EVM) and Phantom (SVM) adapters
   - Instant 1-Click Demo session lifecycle

3. [AI Security & Risk Engine (`AI_SECURITY_ENGINE.md`)](./AI_SECURITY_ENGINE.md)
   - Gemini Pre-Flight Transaction Simulation
   - Smart Contract Safety Auditor
   - Token Approvals & Allowance Revocation Manager
   - Bytecode caching with Neon DB

4. [API & GraphQL Reference (`API_AND_GRAPHQL.md`)](./API_AND_GRAPHQL.md)
   - REST endpoints (`/auth`, `/faucet`, `/swap`, `/ai`)
   - GraphQL Yoga schema and resolvers (`/graphql`)
   - Request and response schemas

5. [Multi-Chain Testnet Setup (`TESTNET_NETWORKS_SETUP.md`)](./TESTNET_NETWORKS_SETUP.md)
   - Network directory (Sepolia, Amoy, BSC Testnet, Base Sepolia, Solana Devnet)
   - RPC endpoints, chain IDs, and block explorers
   - Faucet acquisition guide and built-in drip aggregator

6. [Production Deployment Guide (`DEPLOYMENT.md`)](./DEPLOYMENT.md)
   - Deploying Next.js frontend to Vercel
   - Deploying Express & GraphQL backend to Railway or Render
   - Neon Serverless PostgreSQL connection and migration
   - Post-deployment verification checklist and CORS troubleshooting
