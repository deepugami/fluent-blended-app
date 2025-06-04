# PRB Math Blended - Rust & Solidity Mathematical Functions

A blended application demonstrating mathematical functions implemented in Rust and interfaced through Solidity on the Fluent testnet.

## 🚀 Quick Start

### Deployed Contracts

- **NEW Rust Contract (WORKING)**: `0x210c583479f3cfece4080e39496000bc0d9bf568` (Fluent Testnet)
- **OLD Rust Contract (BROKEN)**: `0x447cc72447d69cf9e0622756ff447725a8ee5fa6` (Fluent Testnet) 
- **Network**: Fluent Testnet (Chain ID: 20993)
- **RPC**: https://rpc.dev.gblend.xyz/

> ⚠️ **IMPORTANT**: Use the NEW contract address for all applications. The old contract has function selector issues.

### Mathematical Functions Available

- `sqrt(x)` - Square root
- `exp(x)` - Exponential (e^x)
- `ln(x)` - Natural logarithm
- `log2(x)` - Base-2 logarithm
- `log10(x)` - Base-10 logarithm

## 📁 Project Structure

```
blended-app/
├── src/
│   └── lib.rs                 # Rust mathematical functions contract
├── solidity/
│   └── prbMathBlended.sol     # Solidity interface contract
├── frontend/
│   └── index.html             # Web interface for testing
├── Cargo.toml                 # Rust dependencies
├── test-rust-contract.js      # Test script for Rust contract
└── deploy-solidity.js         # Deployment helper for Solidity
```

## 🔧 Setup Instructions

### 1. Build the Rust Contract

```bash
# Install gblend CLI (if not already installed)
cargo install gblend

# Build the Rust contract
gblend build rust -r
```

### 2. Deploy Rust Contract

The Rust contract is already deployed at: `0x447cc72447d69cf9e0622756ff447725a8ee5fa6`

To deploy your own:
```bash
gblend deploy \
  --private-key YOUR_PRIVATE_KEY \
  --dev lib.wasm \
  --gas-limit 3000000
```

### 3. Deploy Solidity Contract

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file and paste the content from `solidity/prbMathBlended.sol`
3. Compile the contract (Solidity 0.8.30)
4. Connect MetaMask to Fluent Testnet:
   - Network: Fluent Testnet
   - RPC URL: https://rpc.dev.gblend.xyz/
   - Chain ID: 20993
   - Symbol: ETH
5. Deploy with constructor parameter: `0x447cc72447d69cf9e0622756ff447725a8ee5fa6`

### 4. Use the Frontend

1. Open `frontend/index.html` in a web browser
2. The Rust contract is pre-configured
3. Enter your deployed Solidity contract address
4. Test the mathematical functions

## 🧪 Testing

### Test Rust Contract Directly

```bash
node test-rust-contract.js
```

### Test via Frontend

1. Open the frontend in a browser
2. Enter a value (in 18 decimal places, e.g., `2000000000000000000` for 2.0)
3. Click any mathematical function button
4. View results in real-time

## 📊 Function Examples

| Function | Input (2.0) | Expected Output |
|----------|-------------|-----------------|
| sqrt(2)  | ~1.414      | Square root     |
| exp(2)   | ~7.389      | e^2             |
| ln(2)    | ~0.693      | Natural log     |
| log2(2)  | 1.0         | Base-2 log      |
| log10(2) | ~0.301      | Base-10 log     |

## 🔗 Contract Interfaces

### Rust Contract ABI
```javascript
[
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "sqrt",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // ... other functions
]
```

### Solidity Contract
- Acts as an interface to the Rust contract
- Provides type-safe access to mathematical functions
- Can be verified on Blockscout: https://blockscout.dev.gblend.xyz/

## 🛠 Development

### Dependencies
- Rust with `fluentbase-sdk`
- Node.js with `ethers@5.7.2`
- MetaMask for browser testing

### Build Commands
```bash
# Rust contract
gblend build rust -r

# Install JS dependencies
npm install

# Test contracts
node test-rust-contract.js
```

## 🌐 Network Configuration

Add Fluent Testnet to MetaMask:
- **Network Name**: Fluent Testnet
- **RPC URL**: https://rpc.dev.gblend.xyz/
- **Chain ID**: 20993
- **Currency Symbol**: ETH
- **Block Explorer**: https://blockscout.dev.gblend.xyz/

## 📝 Notes

- All inputs/outputs use 18 decimal places (1.0 = 1000000000000000000)
- Rust contract implements high-precision mathematical functions
- Solidity contract provides a standard interface
- Frontend offers real-time testing capabilities

## 🚨 Important

This is a demonstration project for Fluent's blended execution. Use appropriate validation and error handling for production applications.
