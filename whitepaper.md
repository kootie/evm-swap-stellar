# EA-Swap MVP: Decentralized Exchange & Microloan Platform
## Technical Whitepaper

### Abstract

EA-Swap is a decentralized crypto exchange and microloan platform built on the Stellar blockchain, specifically designed for the East African market. The platform enables users to swap between BTC, ETH, and XLM while automatically staking a portion of each swap to power a community-driven crypto loan vault. This whitepaper outlines the technical architecture, smart contract design, and user interface implementation of the EA-Swap MVP.

### 1. Introduction

#### 1.1 Background
East Africa has seen significant growth in cryptocurrency adoption, with a need for accessible financial services. EA-Swap addresses this by providing:
- Native asset swaps without stablecoin dependencies
- Automatic staking from every transaction
- Community-powered microloans
- Low transaction costs and fast confirmations

#### 1.2 Core Features
- Asset Swapping (BTC ↔ ETH ↔ XLM)
- Automatic 10% Staking
- 3x Leverage Crypto Loans
- Native Stellar Integration
- Wallet Support (Freighter & Albedo)

### 2. Technical Architecture

#### 2.1 Smart Contract Layer
The platform consists of three core smart contracts:

1. **SwapRouter Contract**
   - Handles asset swaps between BTC, ETH, and XLM
   - Integrates with Stellar's native AMM pools
   - Automatically routes 10% of swaps to staking
   - Implements slippage protection

2. **StakeManager Contract**
   - Manages staked assets from swap fees
   - Issues receipt tokens (sBTC, sETH, sXLM)
   - Tracks user balances and total staked amounts
   - Handles stake withdrawals

3. **LoanVault Contract**
   - Issues crypto loans against staked assets
   - Implements 3x leverage ratio
   - Manages loan terms and interest
   - Handles liquidation and recovery

#### 2.2 Frontend Architecture
Built with Next.js and TypeScript, featuring:

1. **Swap Interface**
   - Real-time price feeds
   - Slippage protection
   - Transaction confirmation
   - Automatic staking integration

2. **Stake Dashboard**
   - Stake balance tracking
   - Receipt token management
   - Withdrawal interface
   - Historical stake data

3. **Loan Management**
   - Loan application interface
   - Collateral management
   - Repayment scheduling
   - Risk monitoring

### 3. Smart Contract Specifications

#### 3.1 SwapRouter Contract
```rust
pub fn swap(
    env: &Env,
    from_asset: Address,
    to_asset: Address,
    amount: i128,
    min_output: i128,
    recipient: Address,
) -> i128 {
    // 90% for swap, 10% for staking
    let swap_amount = (amount * 9000) / 10000;
    let stake_amount = amount - swap_amount;
    
    // Execute swap and stake
    // Return output amount
}
```

#### 3.2 StakeManager Contract
```rust
pub struct StakeManager {
    stakes: Map<Address, Map<Address, i128>>,
    total_stakes: Map<Address, i128>,
}

impl StakeManager {
    pub fn stake(&mut self, asset: Address, amount: i128, user: Address) {
        // Update user stakes and total stakes
    }
    
    pub fn withdraw(&mut self, asset: Address, amount: i128, user: Address) {
        // Handle stake withdrawal
    }
}
```

### 4. User Interface Design

#### 4.1 Design Principles
- Mobile-first approach
- Minimal learning curve
- Clear transaction flows
- Real-time feedback
- Risk transparency

#### 4.2 Key Components
1. **Swap Panel**
   - Asset selection
   - Amount input
   - Price impact display
   - Transaction confirmation

2. **Stake Panel**
   - Stake balance
   - Receipt tokens
   - Withdrawal options
   - Historical data

3. **Loan Panel**
   - Loan application
   - Collateral management
   - Repayment tracking
   - Risk indicators

### 5. Security Considerations

#### 5.1 Smart Contract Security
- Formal verification
- Comprehensive testing
- Audit preparation
- Emergency pause functionality

#### 5.2 User Protection
- Slippage protection
- Transaction confirmation
- Risk warnings
- Clear fee structure

### 6. Technical Implementation

#### 6.1 Development Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Smart Contracts: Soroban, Rust
- Blockchain: Stellar
- Wallets: Freighter, Albedo
- Database: Supabase

#### 6.2 Key Dependencies
```json
{
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "@stellar/stellar-sdk": "^11.1.0",
    "@soroban-react/core": "^0.9.0",
    "@supabase/supabase-js": "latest"
  }
}
```

### 7. Database Architecture

#### 7.1 Supabase Integration
EA-Swap MVP uses Supabase as its backend database solution, providing:
- Real-time data synchronization
- Row-level security
- User authentication
- Transaction history tracking

#### 7.2 Database Schema
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(2) NOT NULL,
    wallet_address VARCHAR(255) UNIQUE,
    kyc_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('swap', 'stake', 'loan')),
    asset_from VARCHAR(50) NOT NULL,
    asset_to VARCHAR(50) NOT NULL,
    amount_from DECIMAL(20, 8) NOT NULL,
    amount_to DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    tx_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User balances table
CREATE TABLE user_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    asset VARCHAR(50) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, asset)
);
```

#### 7.3 Security Policies
```sql
-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User balances policies
CREATE POLICY "Users can view their own balances" ON user_balances
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balances" ON user_balances
    FOR UPDATE USING (auth.uid() = user_id);
```

### 8. Testing Strategy

#### 8.1 Smart Contract Testing
- Unit tests for each contract function
- Integration tests for contract interactions
- Edge case testing for security
- Gas optimization testing

#### 8.2 Frontend Testing
- Component unit tests
- Integration tests for user flows
- Wallet connection testing
- Error handling verification

#### 8.3 Database Testing
```typescript
describe('Supabase Integration Tests', () => {
  it('should create a new user', async () => {
    const { data, error } = await createUser(testUser);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should record a transaction', async () => {
    const { data, error } = await recordTransaction(testTransaction);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
```

### 9. Future Development

#### 9.1 Planned Features
- Additional asset support
- Advanced loan products
- Governance integration
- Mobile application

#### 9.2 Technical Roadmap
1. Smart contract audits
2. Beta testing
3. Mainnet deployment
4. Mobile app development

### 10. Conclusion

EA-Swap MVP provides a robust foundation for decentralized financial services in East Africa, leveraging Stellar's speed and cost advantages while maintaining security and user-friendliness. The platform's automatic staking and microloan features create a sustainable ecosystem for crypto adoption and financial inclusion.

### 11. References

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Wallet Connection & Context Management

EA-Swap MVP implements a robust wallet connection and management system designed for seamless integration with Stellar-compatible wallets such as Freighter and Albedo. The architecture leverages React Context and custom hooks to provide a global, reactive wallet state throughout the application.

### Architecture Overview
- **WalletService**: A singleton service that abstracts wallet connection, disconnection, and transaction bundling logic. It is designed to be extensible for future wallet SDKs.
- **React Context (`WalletContext`)**: Provides global access to wallet state (connection status, public key, wallet type, errors) and wallet actions (connect, disconnect) to all components.
- **Custom Hooks**:
  - `useWallet`: Manages wallet state and exposes connect/disconnect logic.
  - `useWalletInitializer`: Handles wallet-specific initialization and connection logic, ready for integration with real wallet SDKs.
- **Wallet Detection Utility**: Dynamically detects available wallets (Freighter, Albedo) in the user's browser and presents appropriate connection options.
- **WalletConnect Component**: User interface for connecting/disconnecting wallets, displaying connection status, and handling errors. It adapts to available wallets and provides a user-friendly experience.

### Integration Approach
- The system is designed to support both mock and real wallet SDKs. When a real wallet SDK is available, the mock wallet logic can be replaced with actual SDK calls.
- The context provider (`WalletProvider`) wraps the entire application, ensuring all components have access to wallet state and actions.
- The architecture supports transaction bundling and signing, with extensibility for future features such as multi-wallet support and advanced transaction flows.

### Security Considerations
- Wallet private keys are never exposed to the application; all signing is performed within the wallet extension or provider.
- The system is designed to gracefully handle wallet connection errors and provide clear feedback to users.

### Example Code Snippet
```tsx
// Usage in a component
import { useWalletContext } from '../contexts/WalletContext';

const MyComponent = () => {
  const { isConnected, publicKey, connect, disconnect } = useWalletContext();
  // ...
};
```

This architecture ensures a secure, extensible, and user-friendly wallet experience for all EA-Swap MVP users.

## Pilot Launch: East & West Africa

EA-Swap MVP will launch its pilot in Kenya, Rwanda, Tanzania, Uganda, Burundi, Ghana, and Nigeria. The platform will support the following local currencies for exchange alongside crypto assets:

- Kenyan Shilling (KES)
- Rwandan Franc (RWF)
- Tanzanian Shilling (TZS)
- Ugandan Shilling (UGX)
- Burundian Franc (BIF)
- Ghanaian Cedi (GHS)
- Nigerian Naira (NGN)

This regional focus aims to drive financial inclusion and cross-border liquidity in East and West Africa.

### Local Currency Integration
- Users can swap between supported cryptocurrencies (BTC, ETH, XLM) and local fiat currencies.
- The platform will integrate with local payment providers and mobile money APIs for on/off-ramp functionality.

### Supabase Integration for User & Transaction Data
- EA-Swap MVP will use Supabase (an open-source Firebase alternative) to store user profiles, KYC data, and transaction histories securely.
- Supabase provides real-time database, authentication, and API features, ensuring scalability and compliance.

### Example: Supabase Integration Code
```ts
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

```ts
// src/services/userService.ts
import { supabase } from './supabaseClient';

export async function createUser(profile: { id: string; email: string; country: string }) {
  return supabase.from('users').insert([profile]);
}

export async function getUser(id: string) {
  return supabase.from('users').select('*').eq('id', id).single();
}
```

```ts
// src/services/transactionService.ts
import { supabase } from './supabaseClient';

export async function recordTransaction(tx: {
  id: string;
  user_id: string;
  type: 'swap' | 'stake' | 'loan';
  asset_from: string;
  asset_to: string;
  amount_from: number;
  amount_to: number;
  currency: string;
  timestamp: string;
}) {
  return supabase.from('transactions').insert([tx]);
}

export async function getUserTransactions(user_id: string) {
  return supabase.from('transactions').select('*').eq('user_id', user_id);
}
```

### Compliance & Data Security
- All user and transaction data is stored securely in Supabase with access controls and encryption.
- The platform will implement KYC/AML checks as required by local regulations.

This approach ensures EA-Swap MVP is ready for real-world deployment in Africa's most dynamic fintech markets. 