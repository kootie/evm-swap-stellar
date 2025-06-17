# Blend Integration in EA-Swap MVP

## Overview
The EA-Swap MVP platform integrates with Blend, a smart contract on the Stellar blockchain, to facilitate asset swaps and community loans. This document outlines how Blend is utilized within the platform.

## Key Components

### BlendService Class
- **Purpose**: Interacts with the Blend smart contract to fetch pool data, create positions, move positions, and retrieve user positions.
- **Methods**:
  - `getPools()`: Fetches available pools from the Blend contract.
  - `createPosition(poolId: string, amount: number)`: Creates a new position in a specified pool.
  - `movePosition(positionId: string, newPoolId: string)`: Moves an existing position to a different pool.
  - `getPositions(userAddress: string)`: Retrieves the positions associated with a user.

### PositionMaker Component
- **Purpose**: Allows users to create and manage their Blend positions.
- **Functionality**:
  - Fetches available pools and displays them to the user.
  - Allows users to select a pool and specify an amount to create a position.
  - Handles errors and provides feedback to the user.

### Loan Component
- **Purpose**: Handles borrowing against staked assets, complementing the overall functionality of the platform.

## Integration Flow
- **User Interaction**: Users can interact with the Blend functionality through the `PositionMaker` component, where they can view available pools and create positions.
- **Data Fetching**: The `BlendService` is used to fetch data from the Blend smart contract, ensuring that the application has the latest information on pools and user positions.
- **Error Handling**: The service includes error handling to manage any issues that arise during interactions with the Blend contract.

## Implementation Notes

### BlendService Placeholder Methods

The `BlendService` class contains placeholder methods that need to be replaced with actual Blend contract calls. Here's what each method is intended to do:

#### 1. getPools()
```typescript
async getPools(): Promise<Pool[]>
```
This method should:
- Call Blend's pool factory contract to get a list of all lending pools
- Return real pool data including:
  - Pool ID/address
  - Supported assets
  - Current APY
  - Total Value Locked (TVL)
  - Risk parameters (Collateral Factor, Liability Factor)

#### 2. createPosition()
```typescript
async createPosition(params: CreatePositionParams): Promise<Position>
```
This method should:
- Call Blend's lending pool contract to:
  - Deposit collateral assets
  - Borrow against the collateral
  - Set up position parameters (leverage, risk settings)
- Return the created position details including:
  - Position ID
  - Collateral amount
  - Borrowed amount
  - Health factor (collateral ratio)
  - Current APY

#### 3. movePosition()
```typescript
async movePosition(params: MovePositionParams): Promise<Position>
```
This method should:
- Call Blend's lending pool contract to:
  - Add/remove collateral
  - Borrow more or repay debt
  - Update position parameters
- Return the updated position details

#### 4. getPositions()
```typescript
async getPositions(userAddress: string): Promise<Position[]>
```
This method should:
- Call Blend's lending pool contract to:
  - Get all positions for a user address
  - Get current position details including:
    - Collateral amounts and assets
    - Borrowed amounts and assets
    - Health factor
    - Current APY
    - Interest accrued

### Required Contract Information

To replace these placeholders with actual Blend contract calls, we need:
1. Blend's smart contract addresses
2. Contract ABIs (function signatures)
3. Specific function names for:
   - Getting pool information
   - Creating positions
   - Managing positions
   - Querying user positions

### Example Implementation

Here's an example of how `getPools()` might be implemented with actual contract calls:

```typescript
async getPools(): Promise<Pool[]> {
    const poolFactory = new ethers.Contract(
        BLEND_POOL_FACTORY_ADDRESS,
        BLEND_POOL_FACTORY_ABI,
        this.provider
    );
    
    const poolCount = await poolFactory.getPoolCount();
    const pools = [];
    
    for (let i = 0; i < poolCount; i++) {
        const poolAddress = await poolFactory.pools(i);
        const pool = new ethers.Contract(
            poolAddress,
            BLEND_POOL_ABI,
            this.provider
        );
        
        pools.push({
            id: poolAddress,
            name: await pool.name(),
            assets: await pool.getSupportedAssets(),
            apy: await pool.getCurrentAPY(),
            tvl: await pool.getTotalValueLocked(),
            riskLevel: await pool.getRiskLevel()
        });
    }
    
    return pools;
}
```

Note: The actual implementation will depend on Blend's specific contract interface and available functions.

## Conclusion
The integration of Blend into the EA-Swap MVP platform is structured to provide a seamless experience for users to manage their positions and interact with the Blend smart contract. The `BlendService` acts as a bridge between the frontend components and the blockchain, facilitating data retrieval and position management. 