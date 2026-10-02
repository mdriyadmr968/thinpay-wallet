# API & GraphQL Reference

The ThinPay backend (`web3service-node`) exposes REST endpoints at `/api/v1` and a high-performance GraphQL Yoga interface mounted at `/graphql`.

Default Base URLs:
- **REST**: `http://127.0.0.1:5000/api/v1`
- **GraphQL**: `http://127.0.0.1:5000/graphql`

---

## 1. REST Endpoints

### 1.1 Authentication & Sessions (`/api/v1/auth`)

#### `POST /auth/demo-login`
Creates or retrieves an active demo testnet session.
- **Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr_demo123",
      "walletAddress": "0x71c8360f3a8b4119d691e84c0f0811ef78b40b64",
      "isDemo": true
    }
  }
  ```

---

### 1.2 Multi-Chain Testnet Faucet (`/api/v1/faucet`)

#### `POST /faucet/drip`
Requests testnet gas tokens for a specific network and address.
- **Request Body**:
  ```json
  {
    "network": "sepolia",
    "address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "amount": "0.05 ETH",
    "txHash": "0x4b7c...",
    "cooldownRemainingMs": 3600000
  }
  ```

#### `GET /faucet/status/:network/:address`
Checks whether an address is currently in cooldown.
- **Response**:
  ```json
  {
    "canClaim": true,
    "cooldownRemainingMs": 0,
    "lastClaimTime": null
  }
  ```

---

### 1.3 AI Safety & Simulation (`/api/v1/ai`)

#### `POST /ai/simulate`
Simulates a testnet transaction before submission.
- **Request Body**:
  ```json
  {
    "to": "0x1234...",
    "value": "0.05",
    "chain": "sepolia",
    "sender": "0xabcd..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "simulation": {
      "riskLevel": "LOW",
      "summary": "Transfer to known EOA",
      "expectedBalanceChange": "-0.0500 ETH",
      "recommendation": "Safe to execute."
    }
  }
  ```

#### `POST /ai/audit`
Performs smart contract safety audit using Gemini 2.0.
- **Request Body**:
  ```json
  {
    "contractAddress": "0xContract...",
    "network": "amoy"
  }
  ```

---

### 1.4 Swap & Routing (`/api/v1/swap`)

#### `GET /swap/quote`
Retrieves live 0x Protocol swap quotes for testnet assets.
- **Query Params**:
  - `buyToken`: string
  - `sellToken`: string
  - `sellAmount`: string
  - `chainId`: number

---

## 2. GraphQL Schema (`/graphql`)

The GraphQL endpoint provides unified access to portfolio assets, transactions, and curated DeFi baskets:

```graphql
type Query {
  portfolio(address: String!): PortfolioResult!
  baskets: [DeFiBasket!]!
  basket(id: ID!): DeFiBasket
  transactionHistory(address: String!, chainId: Int): [TransactionRecord!]!
}

type PortfolioResult {
  totalUsdValue: Float!
  chains: [ChainPortfolio!]!
}

type ChainPortfolio {
  chainId: Int!
  chainName: String!
  nativeBalance: String!
  usdValue: Float!
  tokens: [TokenHolding!]!
}

type TokenHolding {
  symbol: String!
  address: String!
  balance: String!
  usdValue: Float!
  decimals: Int!
}

type DeFiBasket {
  id: ID!
  name: String!
  symbol: String!
  category: String!
  description: String!
  apy: Float!
  riskLevel: String!
  tokens: [BasketTokenWeight!]!
}

type BasketTokenWeight {
  symbol: String!
  weightPercent: Float!
}
```
