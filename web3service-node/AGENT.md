# Web3Service Node - Agent Coding Guidelines & Architecture Rules

## Core Principles
1. **Modularity & Single Responsibility**:
   - Keep files small, modular, and focused.
   - Target maximum ~150 lines per file. If a file grows beyond that, split it into smaller sub-modules or helpers.
   - Separate concerns cleanly: Routes -> Controllers -> Services -> Database / Web3 clients.

2. **File & Directory Naming Conventions**:
   - Filenames: `camelCase.ts` for controllers, services, and utilities (e.g. `authController.ts`, `evmService.ts`, `cache.ts`).
   - Types and schemas: `camelCase.ts` or `kebab-case.ts` (e.g. `schema.ts`, `authTypes.ts`).
   - No monolithic controller or service files.

3. **Strict TypeScript & Typing**:
   - Enable strict mode in `tsconfig.json`.
   - Never use `any` unless strictly interfacing with an untyped external CJS module (and even then, narrow with unknown/guards).
   - Use Zod for runtime schema validation on all incoming request bodies, params, and query strings.

4. **Web3 & Multi-Chain Safety**:
   - Strictly use **Testnets** (Sepolia, Polygon Amoy, BSC Testnet, Base Sepolia, Arbitrum Sepolia, Solana Devnet).
   - Never log private keys, mnemonic phrases, or secret keys in console or error outputs.
   - Encrypt any sensitive session state with AES-256-GCM before writing to the database.
   - Use `viem` and `@solana/web3.js` for RPC communication.

5. **Database & Drizzle ORM**:
   - Define all tables cleanly in `src/db/schema.ts` with proper indexes, foreign keys, and timestamps.
   - Run migrations via `drizzle-kit generate` and `drizzle-kit migrate`.
   - Keep seed scripts updated in `src/db/seed.ts` for reproducible developer setups.

6. **Caching**:
   - Wrap RPC queries and 0x quotes with `src/utils/cache.ts` (`lru-cache`) to preserve rate limits on public testnets.
   - Cache deterministic AI audit results in PostgreSQL.

7. **Error Handling**:
   - Centralize all error responses through `src/middleware/errorHandler.ts`.
   - Return standard RFC-7807 error shapes: `{ status: 'error', code: 'STRING_CODE', message: 'Details' }`.
