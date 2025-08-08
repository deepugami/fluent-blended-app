# PRB Math Blended - Rust & Solidity Mathematical Functions

A blended application demonstrating mathematical functions implemented in Rust and interfaced through Solidity on the Fluent testnet.

## Project Overview

This project showcases a hybrid approach to implementing mathematical functions using Rust compiled to WebAssembly (WASM) and made accessible through a Solidity interface. The system is deployed on the Fluent testnet.

## Deployed Contracts

- **Rust Contract**: `0xB8Bf5Da7bCbCF96d7DFe057F8bC9D97037D6Da24` (Fluent Testnet)
- **Solidity Interface**: `0x2F1fDcC76f0419Ce81e1D4B949902a776f8D8bB4` (Fluent Testnet) 
- **Network**: Fluent Testnet (Chain ID: 20993)
- **RPC**: https://rpc.dev.gblend.xyz/
- **Explorer**: https://blockscout.dev.gblend.xyz/
- **Frontend**: `frontend/index.html` - Interactive web interface for testing all functions

## Mathematical Functions Available

- `sqrt(x)` - Square root
- `exp(x)` - Exponential (e^x)
- `ln(x)` - Natural logarithm
- `log2(x)` - Base-2 logarithm
- `log10(x)` - Base-10 logarithm

## Project Structure

```
blended-app/
├── rust/
│   └── src/lib.rs             # Rust mathematical functions implementation
├── solidity/
│   └── src/prbMathBlended.sol # Solidity interface contract
├── frontend/
│   └── index.html             # Web interface for testing
└── README.md                  # This file
```

## Setup Instructions

### 1. Build the Rust Contract

```bash
# Install gblend CLI (if not already installed)
cargo install gblend

# Build the Rust contract
gblend build rust -r
```

### 2. Deploy Contracts

The contracts are already deployed and verified on Fluent testnet:
- Rust Contract: `0x5e44930a479f34fbc1c9657c68f5b7f761363769`
- Solidity Interface: `0xB5f2c8f502C654C3F52BA8118b9f83Ff16379E96`

To deploy your own contracts, use the deployment scripts in the `solidity/` directory.

### 3. Use the Frontend

1. Open `frontend/index.html` in a web browser
2. Click "Connect to Contracts" to initialize
3. Enter values and test mathematical functions

## Testing

The frontend provides a complete interface for testing all mathematical functions with real-time results.

## Function Examples

| Function | Input (2.0) | Expected Result |
|----------|-------------|----------------|
| sqrt(2)  | ~1.414      | Square root    |
| exp(2)   | ~7.389      | e^2            |
| ln(2)    | ~0.693      | Natural log    |
| log2(2)  | 1.0         | Base-2 log     |
| log10(2) | ~0.301      | Base-10 log    |

## Contract Interfaces

### Rust Contract ABI
```javascript
[
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "sqrt",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  }
  // Additional functions: exp, ln, log2, log10
]
```

### Solidity Contract
- Acts as an interface to the Rust contract
- Provides type-safe access to mathematical functions
- Verified on Blockscout: https://blockscout.dev.gblend.xyz/

## Development

### Dependencies
- Rust with `fluentbase-sdk`
- Node.js with `ethers`
- MetaMask for browser testing

### Build Commands
```bash
# Rust contract
gblend build rust -r

# Install JS dependencies
npm install
```

## Network Configuration

Add Fluent Testnet to MetaMask:
- **Network Name**: Fluent Testnet
- **RPC URL**: https://rpc.dev.gblend.xyz/
- **Chain ID**: 20993
- **Currency Symbol**: ETH
- **Block Explorer**: https://blockscout.dev.gblend.xyz/

## Notes

- All inputs/outputs use 18 decimal places (1.0 = 1000000000000000000)
- Rust contract implements high-precision mathematical functions
- Solidity contract provides a standard interface
- Frontend offers real-time testing capabilities

## Important

This is a demonstration project for Fluent's blended execution. Use appropriate validation and error handling for production applications.
