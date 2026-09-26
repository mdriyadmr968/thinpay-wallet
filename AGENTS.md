<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ThinPay Wallet - Frontend Architecture & Agent Guidelines

## 1. Core Architectural Rules
- **Brand Identity**: Use **ThinPay Wallet** (`thinpay-wallet`). Never use "Talewallet", "TaleCoin", or "NFTverse".
- **Strictly Testnet**: Only interact with testnets (Sepolia, Polygon Amoy, BSC Testnet, Base Sepolia, Arbitrum Sepolia, Solana Devnet). Zero mainnet RPCs or logic.
- **Server Components (RSC) First**: Default to React Server Components for page layouts, token lists, and initial data fetching. Use `"use client"` only for components requiring hooks, DOM event listeners, or Web3 wallet signing.
- **Mobile First**: All UI must be optimized for viewports from 360px up. Touch targets must be at least 44px. Use drawers/sheets instead of full-screen desktop modals on small screens.

## 2. Modularity & File Size Limits
- Target maximum ~150 lines per file.
- Split components into atomic sub-components (e.g., `TokenIcon`, `BalanceDisplay`, `TransactionRow`).
- Keep state and business logic in custom hooks (`hooks/`) or Zustand stores (`stores/`), not inside JSX view components.

## 3. Naming Conventions
- React Components: `PascalCase.tsx` (e.g. `AccountBar.tsx`, `TokenCard.tsx`).
- Hooks: `camelCase.ts` or `kebab-case.ts` starting with `use` (e.g. `useSwapQuote.ts`).
- Stores: `kebab-case.ts` starting with `use-` in `stores/` (e.g. `use-ui-store.ts`, `use-wallet-store.ts`).
- Utilities and libraries: `camelCase.ts` or `kebab-case.ts` in `lib/` (e.g. `formatters.ts`, `web3-client.ts`).

## 4. Styling & UI Components
- Tailwind CSS v4 with shadcn/ui design tokens.
- Motion for subtle, 60fps animations (use `useReducedMotion` where appropriate).
- Avoid monolithic CSS files; rely on utility classes and scoped shadcn components.

## 5. State Management
- **Wagmi v2 + TanStack Query**: For all asynchronous blockchain queries and RPC calls.
- **Zustand**: For global client UI state (modals, drawers, active testnet choice).
- **URL SearchParams**: For active tabs, token filters, and pagination.
