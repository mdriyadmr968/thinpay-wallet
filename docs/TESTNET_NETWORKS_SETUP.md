# Multi-Chain Testnet Setup & Configuration

ThinPay is dedicated to testnet operations, providing zero-cost exploration across major EVM chains and the Solana Devnet SVM.

---

## 1. Supported Networks Directory

| Network | Chain ID | Native Currency | RPC Endpoint | Explorer |
|---|---|---|---|---|
| **Ethereum Sepolia** | `11155111` | `ETH` | `https://ethereum-sepolia-rpc.publicnode.com` | [Sepolia Etherscan](https://sepolia.etherscan.io) |
| **Polygon Amoy** | `80002` | `POL` | `https://rpc-amoy.polygon.technology` | [PolygonScan Amoy](https://amoy.polygonscan.com) |
| **BNB Smart Chain Testnet** | `97` | `tBNB` | `https://data-seed-prebsc-1-s1.binance.org:8545` | [BscScan Testnet](https://testnet.bscscan.com) |
| **Base Sepolia** | `84532` | `ETH` | `https://sepolia.base.org` | [BaseScan Sepolia](https://sepolia.basescan.org) |
| **Solana Devnet** | `N/A` | `SOL` | `https://api.devnet.solana.com` | [Solana Explorer (Devnet)](https://explorer.solana.com?cluster=devnet) |

---

## 2. Setting Up Testnet Wallets

### 2.1 Using ThinPay Self-Custody Vault (No Extension Required)
1. Navigate to `/login` and select **"Self-Custody Testnet Vault"**.
2. Click **"Create New"** to generate a 12-word BIP-39 recovery phrase.
3. Confirm that you have securely saved the words and set an 8+ character password.
4. Your wallet is instantly active across all 4 EVM networks!

### 2.2 Using MetaMask
1. Open MetaMask Settings > Networks > Add Network.
2. In the search box, toggle **"Show test networks"** to ON.
3. Select **Sepolia**, **Polygon Amoy**, or **Base Sepolia**.
4. To add BSC Testnet manually:
   - Network Name: `BNB Smart Chain Testnet`
   - RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545`
   - Chain ID: `97`
   - Currency Symbol: `tBNB`
   - Block Explorer URL: `https://testnet.bscscan.com`

### 2.3 Using Phantom (Solana Devnet)
1. Open Phantom Settings > Developer Settings.
2. Toggle **"Testnet Mode"** to ON.
3. Select **"Solana Devnet"**.
4. In ThinPay, click **Connect Wallet** > **Phantom / Solana Devnet**.

---

## 3. Acquiring Testnet Tokens (Faucets)

### Built-in 1-Click Faucet Aggregator
ThinPay features an integrated faucet modal accessible from the top header or sidebar:
- Drips `0.05 ETH`, `10 POL`, `0.05 BNB`, `0.05 Base ETH`, or `1 SOL` directly to your connected address.
- 60-minute cooldown per network.

### External Backup Faucets
- **Sepolia**: [Google Cloud Web3 Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) | [Alchemy Sepolia Faucet](https://sepoliafaucet.com)
- **Polygon Amoy**: [Polygon Faucet](https://faucet.polygon.technology/)
- **BNB Testnet**: [BNB Chain Faucet](https://testnet.bnbchain.org/faucet-smart)
- **Base Sepolia**: [Coinbase Faucet](https://coinbase.com/faucets/base-ethereum-sepolia-faucet)
- **Solana Devnet**: `solana airdrop 1 <YOUR_ADDRESS> --url devnet`
