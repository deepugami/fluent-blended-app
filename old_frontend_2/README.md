# PRB Math Blended React Frontend

This is the React frontend for the PRB Math Blended application. It provides a modern user interface for interacting with the PRB Math functions implemented in Rust and exposed through a Solidity contract on the Fluent network.

## Features

- Connect to Fluent network using Web3 wallet (MetaMask)
- Calculate mathematical functions using the blockchain:
  - Square root (sqrt)
  - Exponential function (exp)
  - Natural logarithm (ln)
  - Base-10 logarithm (log10)
  - Base-2 logarithm (log2)
- Visualize function graphs
- Track calculation history
- Copy results to clipboard

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Configuration

Update the contract address and network configuration in `src/App.jsx` before deploying:

```javascript
// Contract address - update with your deployed contract
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Fluent Network configuration
const FLUENT_NETWORK = {
  name: 'Fluent Testnet',
  chainId: 424242,  // Update with actual chain ID
  rpcUrl: 'https://testnet.fluent.xyz',  // Update with actual RPC URL
  blockExplorer: 'https://explorer.testnet.fluent.xyz'  // Update with actual explorer URL
};
```

## Technologies Used

- React
- Vite
- ethers.js
- Chart.js
- React Chart.js 2
