# EA-Swap MVP

A decentralized crypto exchange and microloan platform for East Africa, built on the Stellar blockchain using native assets only.

## Features

- 🔄 Swap between BTC, ETH, and XLM using Stellar's native AMM pools
- 💰 Automatic 10% staking from every swap
- 🏦 Crypto loans against staked assets (up to 3x leverage)
- 🔐 Secure smart contracts using Soroban
- 📱 Modern web interface with wallet integration

## Tech Stack

- Frontend: Next.js 14 with TypeScript
- Smart Contracts: Soroban
- Blockchain: Stellar
- Wallets: Freighter & Albedo integration

## Project Structure

```
evm-swap/
├── contracts/           # Soroban smart contracts
│   ├── swap_router/    # Swap routing logic
│   ├── stake_manager/  # Staking management
│   └── loan_vault/     # Loan issuance and management
├── frontend/           # Next.js web application
│   ├── components/     # React components
│   ├── pages/         # Next.js pages
│   └── styles/        # CSS and styling
└── scripts/           # Deployment and utility scripts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build and deploy contracts:
   ```bash
   npm run deploy:contracts
   ```

## Smart Contracts

### SwapRouter
- Handles asset swaps between BTC, ETH, and XLM
- Automatically routes 10% of swaps to staking

### StakeManager
- Manages staked assets
- Issues receipt tokens (sBTC, sETH, sXLM)
- Tracks user balances and staking pool

### LoanVault
- Issues crypto loans against staked assets
- Manages loan terms and interest
- Handles repayment and default scenarios

## License

MIT 