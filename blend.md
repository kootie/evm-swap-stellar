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

## Conclusion
The integration of Blend into the EA-Swap MVP platform is structured to provide a seamless experience for users to manage their positions and interact with the Blend smart contract. The `BlendService` acts as a bridge between the frontend components and the blockchain, facilitating data retrieval and position management. 