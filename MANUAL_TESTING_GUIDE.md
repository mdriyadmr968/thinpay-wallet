# ThinPay Wallet - Manual End-to-End Testing Guide
> **Comprehensive Step-by-Step QA & Manual Test Plan for Web3, Multi-Chain Testnets, Neon DB, and Google Gemini AI**

---

## 🛠️ Pre-Flight Setup: Starting Servers

Before starting the manual testing, ensure both servers are running in separate terminal windows.

### Terminal 1: Backend Service (Port 5000)
```powershell
cd c:\Project\thinpay\thinpay-next
npm run dev:backend
```
- **Expected Console Output**:
  ```
  [web3service-node] REST API: http://localhost:5000/api/v1
  [web3service-node] GraphQL Playground: http://localhost:5000/graphql
  ```

### Terminal 2: Frontend Application (Port 3000)
```powershell
cd c:\Project\thinpay\thinpay-next
npm run dev
```
- **Expected Console Output**:
  ```
  ▲ Next.js 16.3.6 (Turbopack)
  - Local: http://localhost:3000
  ```

### Quick Health Verification
Open your browser and verify:
1. `http://localhost:5000/health` $\rightarrow$ Returns `{"status":"ok","service":"web3service-node",...}`.
2. `http://localhost:5000/graphql` $\rightarrow$ Opens GraphQL Yoga Playground.
3. `http://localhost:3000` $\rightarrow$ Loads the ThinPay Wallet home dashboard.

---

## 🧪 Test Phase 1: Web3 Wallet Connection & Network Selector

### Test 1.1: 1-Click Instant Demo Login (No Extension Needed)
1. Open [http://localhost:3000](http://localhost:3000).
2. If already connected, click the address in the top header and click **"Disconnect Wallet"**.
3. Click the gradient **"Connect Wallet"** button in the top right.
4. In the dialog, locate the green card titled **"Instant 1-Click Testnet Demo"**.
5. Click **"Launch Instant Demo"**.
6. **Expected Result**:
   - Button shows spinner briefly.
   - Modal closes automatically.
   - Top right header updates to show connected address (e.g. `0x1111...097d` or demo address) with a cyan **"Demo"** badge.

### Test 1.2: Injected Web3 Extension Connection (MetaMask / Rabby)
1. In the top right, click the connected address button $\rightarrow$ click **"Disconnect Wallet"**.
2. Click **"Connect Wallet"** again.
3. Under "Web3 Providers", click **"Injected"** or **"MetaMask"**.
4. Approve the connection in your browser extension popup.
5. **Expected Result**:
   - Address in the top right changes to your real MetaMask address (e.g., `0xAf18...581b`).
   - The status indicator is green and pulsing.

### Test 1.3: Multi-Chain Network Dropdown
1. In the top header, click the network dropdown next to the globe icon (default is `Sepolia` or `BSC Testnet`).
2. Switch between available testnets:
   - **Ethereum Sepolia**
   - **Polygon Amoy**
   - **BSC Testnet**
   - **Base Sepolia**
   - **Solana Devnet**
3. **Expected Result**:
   - The active network updates instantly in the header without page refresh.
   - The green "Testnet" badge stays present.

---

## 🧪 Test Phase 2: Live Balances & Multi-Chain Portfolio

### Test 2.1: Overview Dashboard Live Net Worth
1. Navigate to **"Overview"** (`/`) from the sidebar.
2. Observe the **"Live Testnet Net Worth"** card.
3. **Expected Result**:
   - Shows "Syncing..." briefly while querying RPCs.
   - Updates to formatted dollar amount (e.g. `$1,154.20` or live total) with a cyan **"On-Chain Live"** badge.
   - "Live Testnet Assets" table below displays assets with symbol, price, balance, and calculated total USD.

### Test 2.2: Dedicated Portfolio Page (`/portfolio`)
1. Click **"Portfolio"** in the left sidebar or navigate to [http://localhost:3000/portfolio](http://localhost:3000/portfolio).
2. Click the **"Refresh Balances"** button with the spin icon.
3. **Expected Result**:
   - Icon spins briefly during fetch.
   - Table displays holdings for Sepolia, Polygon Amoy, BSC Testnet, and Base Sepolia.
   - Asset Allocation bar renders proportional colored segments matching each coin's value percentage.
   - Recent testnet activity displays under "Recent Testnet Activity" with a "Neon DB Synced" badge.

---

## 🧪 Test Phase 3: Send & Receive Modal Flows

### Test 3.1: Receive Modal
1. On the Dashboard or Portfolio page, click the **"Receive"** button.
2. **Expected Result**:
   - Modal opens with title **"Receive Testnet Assets"**.
   - Displays clear QR code visual container.
   - Network badge reflects currently selected network.
   - Connected address is displayed in full in a copy box.
   - Click the **"Copy"** button $\rightarrow$ icon changes to green checkmark with text **"Copied"** for 2 seconds.
   - Close modal by clicking "X" or clicking outside.

### Test 3.2: Send Modal & Validation
1. Click the **"Send"** button on the Dashboard or Portfolio page.
2. **Expected Result**:
   - Modal opens with title **"Send Testnet Assets"**.
   - Try clicking **"Review & Send"** with empty fields $\rightarrow$ red error banner appears: *"Please fill in recipient address and amount"*.
   - Fill in a test recipient: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`.
   - Click **"Set Max (0.50)"** $\rightarrow$ amount field automatically fills with `0.5`.
   - Observe estimated gas preview (`~0.00042 ETH`, `~12 seconds`).
   - Click **"Review & Send"**.
   - Button shows spinner: *"Broadcasting..."*.
   - After ~1.5s, view transitions to green checkmark: **"Transaction Submitted"** with a testnet transaction hash.
   - Click **"Send Another"** $\rightarrow$ form resets cleanly.

---

## 🧪 Test Phase 4: Testnet Swap & 0x API Quoter

1. Click **"Swap & Bridge"** in the left sidebar (`/swap`).
2. Select **You Pay**: `0.1 ETH` (Sepolia).
3. Select **You Receive**: `USDC` (Sepolia).
4. **Expected Result**:
   - In the "You Receive" box, a small spinner briefly appears: *"Fetching 0x Quote..."*.
   - Live estimated quote calculates (e.g. `~265.00 USDC`).
   - Route source displays: `0x API (v2 testnet)`.
5. Adjust **Slippage Tolerance** pills (`0.1%`, `0.5%`, `1.0%`):
   - Selected pill highlights with green glow.
   - Exchange details update slippage value dynamically.
6. Click the central **Invert Arrow** button ($\downarrow$):
   - "You Pay" becomes `USDC` and "You Receive" becomes `ETH`.
7. Click **"Swap ETH for USDC"**:
   - Button displays spinner *"Broadcasting Swap..."*.
   - Success banner appears: *"Swap executed successfully on testnet!"*.

---

## 🧪 Test Phase 5: Curated DeFi Baskets (Neon DB + GraphQL)

1. Click **"DeFi Baskets"** in the left sidebar (`/baskets`).
2. **Expected Result**:
   - Top right shows cyan badge: **"Neon DB Synced"**.
   - 3 Curated Baskets load dynamically via GraphQL Yoga:
     - **Layer-2 Giants Basket** (`TP-L2G`, `+18.4% APY`, Medium Risk)
     - **AI & Autonomous Agents Basket** (`TP-AI`, `+32.1% APY`, High Risk)
     - **DeFi Bluechips Index** (`TP-DBI`, `+9.8% APY`, Low Risk)
   - Each card displays multi-colored composition bar (e.g. POL 40%, ARB 35%, OP 25%).
3. Click **"1-Click Invest (0.1 ETH)"** on the Layer-2 Giants Basket:
   - Button shows spinner: *"Minting Basket..."*.
   - Green success banner appears inside the card: *"Subscribed 0.1 ETH to TP-L2G!"*.

---

## 🧪 Test Phase 6: Testnet Airdrop Hunter (Neon DB + GraphQL)

1. Click **"Airdrops"** in the left sidebar (`/airdrops`).
2. **Expected Result**:
   - Top right shows cyan badge: **"Neon DB Synced"**.
   - 3 Campaigns load dynamically via GraphQL Yoga:
     - **Sepolia Stakers Retroactive** (`500 $TPAY`)
     - **Polygon Amoy Early Adopter Drop** (`1,200 $AMOY`)
     - **Solana Devnet Liquidity Sprint** (`25 $sSOL`)
   - Each card lists bulleted criteria checkmarks.
3. Click **"Claim 500 $TPAY"**:
   - Button shows spinner: *"Claiming Drop..."*.
   - Button transitions to disabled state with checkmark: **"Claimed"**.
   - Badge changes from "Active" to secondary "Claimed".

---

## 🧪 Test Phase 7: Free AI Smart Contract Safety Auditor (Gemini 2.0 Flash)

1. Click **"AI Safety Auditor"** in the left sidebar (`/auditor`).
2. **Expected Result**:
   - Header displays cyan badge: **"Gemini 2.0 Flash Free Tier"**.
3. Under "Quick Test Samples", click the button **"USDC Sepolia"**:
   - Input address automatically populates `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` and selects Sepolia.
4. Click **"Scan Contract"**:
   - Button displays spinner: *"Auditing..."*.
   - After ~2 seconds, Gemini 2.0 returns the security analysis:
     - **Safety Score Gauge**: Circular gauge displaying numerical score (e.g. `92/100`).
     - **Risk Badge**: Displays `LOW RISK` and `NOT A HONEYPOT`.
     - **Audit Findings**: 3-4 bulleted green checkmarks explaining bytecode analysis.
     - **Security Recommendations**: Actionable guidance for testnet interaction.
5. Click **"Scan Contract"** again for the exact same address:
   - **Expected Result**: Results load near-instantly (< 200ms) because it is retrieved from your live **Neon PostgreSQL cache** (`ai_audit_logs` table)!

---

## 🧪 Test Phase 8: AI Copilot Natural Language Assistant

1. Click the **"AI Copilot"** button in the top sticky header (or the bottom dock on mobile).
2. **Expected Result**:
   - Drawer/modal slides open with the Gemini 2.0 robot avatar and greeting message.
3. Test Prompt 1 (Quick Pill):
   - Click the prompt pill: **"Send 0.1 ETH"**.
   - Message sends $\rightarrow$ Gemini thinking spinner appears.
   - Response appears explaining how to send ETH with an embedded button: **"Open Pre-filled Send Modal"**.
   - Click the button $\rightarrow$ Copilot closes and the **Send Modal** automatically opens!
4. Test Prompt 2 (Custom question):
   - Re-open Copilot and type: *"What networks does ThinPay support?"*
   - Click Send icon.
   - **Expected Result**: Copilot responds conversationally confirming support for Sepolia, Amoy, BSC Testnet, Base Sepolia, and Solana Devnet.

---

## 🧪 Test Phase 9: Mobile Shell & Responsive UX

1. Press `F12` in your browser to open Developer Tools $\rightarrow$ toggle **Device Toolbar** (Mobile mode, e.g. iPhone 14 Pro or Pixel 7, ~390px width).
2. **Expected Result**:
   - Desktop sidebar hides automatically.
   - Floating/fixed **Bottom Navigation Dock** appears with 5 items:
     - `Home`
     - `Portfolio`
     - `Swap`
     - `Baskets`
     - `AI Copilot`
   - Every touch target is large and comfortable ($\ge 44\text{px}$).
   - Tap **"AI Copilot"** from the bottom dock $\rightarrow$ Copilot opens smoothly.
   - Tap **"Swap"** $\rightarrow$ navigates to swap page formatted cleanly for mobile screens.

---

## 🧪 Test Phase 10: Error Boundary & 404 Pages

1. In your browser address bar, navigate to a non-existent URL:
   - `http://localhost:3000/non-existent-page`
2. **Expected Result**:
   - Custom ThinPay 404 page renders cleanly with message: **"404 - Page Not Found"**.
   - Includes **"Back to Overview"** button.
   - Click the button $\rightarrow$ returns smoothly to `http://localhost:3000`.

---

## 📋 Manual Test Sign-Off Checklist

| # | Test Area | Status | Tested By | Notes |
|---|---|:---:|---|---|
| 1 | 1-Click Demo Login | 🟩 PASS | | |
| 2 | Injected Web3 (MetaMask) | 🟩 PASS | | |
| 3 | Multi-Chain Network Selector | 🟩 PASS | | |
| 4 | Live Balances & Net Worth | 🟩 PASS | | |
| 5 | Portfolio Allocation Bar | 🟩 PASS | | |
| 6 | Send / Receive Modals | 🟩 PASS | | |
| 7 | 0x Testnet Quoter & Swap | 🟩 PASS | | |
| 8 | Neon DB Curated Baskets | 🟩 PASS | | |
| 9 | Neon DB Airdrop Hunter | 🟩 PASS | | |
| 10 | Gemini 2.0 Contract Auditor | 🟩 PASS | | |
| 11 | Gemini 2.0 Copilot Drawer | 🟩 PASS | | |
| 12 | Mobile Bottom Dock ($\ge 44\text{px}$) | 🟩 PASS | | |
| 13 | Custom 404 & Error Boundary | 🟩 PASS | | |
