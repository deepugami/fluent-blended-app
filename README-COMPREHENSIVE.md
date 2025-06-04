# PRB Math Blended App

A comprehensive blended application combining Rust WASM smart contracts, Solidity interfaces, and JavaScript frontend for advanced mathematical calculations on the Fluent testnet.

## 🏗️ Project Structure

```
blended-app/
├── rust/                      # Rust WASM contract
│   ├── src/lib.rs            # Mathematical functions implementation
│   └── Cargo.toml            # Rust dependencies
├── solidity/                  # Solidity contracts
│   ├── src/
│   │   ├── prbMathBlended.sol              # Main Solidity interface
│   │   └── deployConstructor/
│   │       └── prbMathBlended.txt         # Constructor arguments
│   └── foundry.toml          # Foundry configuration
├── javascript/               # JavaScript test scripts
│   ├── package.json         # Dependencies
│   ├── solidity.js          # Test Solidity contract
│   ├── rust.js              # Test Rust contract directly
│   └── comprehensive-test.js # Complete testing suite
├── frontend/                # Web application
│   └── index.html           # Complete frontend interface
└── README.md               # This file
```

## 🚀 Deployed Contracts

### Rust Contract (WASM)
- **Address:** `0x447cc72447d69cf9e0622756ff447725a8ee5fa6`
- **Network:** Fluent Testnet (Chain ID: 20993)
- **Functions:** sqrt, exp, ln, log2, log10

### Solidity Contract (Interface)
- **Address:** `0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f`
- **Network:** Fluent Testnet (Chain ID: 20993)
- **Purpose:** Interfaces with Rust contract for mathematical operations

## 🧮 Mathematical Functions

All functions use 18-decimal fixed-point arithmetic:

1. **sqrt(uint256 x)** → int256: Square root calculation
2. **exp(int256 x)** → int256: Exponential function (e^x)
3. **ln(uint256 x)** → int256: Natural logarithm
4. **log2(uint256 x)** → int256: Base-2 logarithm
5. **log10(uint256 x)** → int256: Base-10 logarithm

## 🛠️ Development Setup

### Prerequisites
- Rust with wasm32 target
- Node.js and npm
- Foundry (for Solidity)
- gblend CLI tool

### Installation

1. **Clone and setup:**
   ```bash
   git clone <repository>
   cd blended-app
   ```

2. **Install dependencies:**
   ```bash
   # JavaScript dependencies
   cd javascript && npm install
   
   # Rust dependencies are managed by Cargo
   ```

### Build and Deploy

#### 1. Deploy Rust Contract
```bash
cd rust
gblend build rust -r
gblend deploy \
  --private-key $devTestnetPrivateKey \
  --dev lib.wasm \
  --gas-limit 3000000
```

#### 2. Deploy Solidity Contract
```bash
cd ../solidity
forge create src/prbMathBlended.sol:prbMathBlended \
  --constructor-args-path src/deployConstructor/prbMathBlended.txt \
  --private-key $devTestnetPrivateKey \
  --rpc-url https://rpc.dev.gblend.xyz/ \
  --gas-limit 1000000 \
  --broadcast
```

#### 3. Verify Contracts
```bash
forge verify-contract <CONTRACT_ADDRESS> \
  src/prbMathBlended.sol:prbMathBlended \
  --constructor-args $(cast abi-encode "constructor(address)" <RUST_CONTRACT_ADDRESS>) \
  --verifier blockscout \
  --verifier-url https://blockscout.dev.gblend.xyz/api/ \
  --rpc-url https://rpc.dev.gblend.xyz/
```

## 🧪 Testing

### JavaScript Tests
```bash
cd javascript

# Test Solidity contract (calls Rust contract)
node solidity.js

# Test Rust contract directly
node rust.js

# Comprehensive testing suite
node comprehensive-test.js
```

### Frontend Testing
1. Open `frontend/index.html` in a web browser
2. Connect to MetaMask with Fluent testnet
3. Use the Mathematical Calculator section for calculations
4. Use the Smart Contracts section to test deployed contracts

## 🌐 Network Configuration

### Fluent Testnet
- **RPC URL:** https://rpc.dev.gblend.xyz/
- **Chain ID:** 20993
- **Block Explorer:** https://blockscout.dev.gblend.xyz/

### MetaMask Setup
Add Fluent testnet to MetaMask:
```json
{
  "networkName": "Fluent Testnet",
  "rpcUrl": "https://rpc.dev.gblend.xyz/",
  "chainId": "20993",
  "symbol": "ETH",
  "blockExplorer": "https://blockscout.dev.gblend.xyz/"
}
```

## 🎯 Usage Examples

### Frontend Interface
1. **Mathematical Calculator:**
   - Enter values and select functions
   - Results are calculated client-side and via smart contracts
   - Compare local vs blockchain results

2. **Smart Contract Testing:**
   - Connect to deployed contracts
   - Test individual functions
   - View transaction results and gas usage

### JavaScript Integration
```javascript
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://rpc.dev.gblend.xyz/');
const contract = new ethers.Contract(contractAddress, abi, provider);

// Calculate sqrt(4) = 2 (with 18 decimals)
const result = await contract.sqrt(ethers.parseEther('4'));
console.log(ethers.formatEther(result)); // "2.0"
```

## 🔧 Configuration Files

### Foundry Configuration (`solidity/foundry.toml`)
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.30"

[rpc_endpoints]
fluent_testnet = "https://rpc.dev.gblend.xyz/"
```

### Rust Configuration (`rust/Cargo.toml`)
```toml
[package]
name = "prb-math-blended"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
fluentbase-sdk = { git = "https://github.com/fluentlabs-xyz/fluentbase", default-features = false }

[profile.release]
panic = "abort"
lto = true
opt-level = "z"
```

## 🔍 Verification

Both contracts are verified on Blockscout:
- **Rust Contract:** [View on Blockscout](https://blockscout.dev.gblend.xyz/address/0x447cc72447d69cf9e0622756ff447725a8ee5fa6)
- **Solidity Contract:** [View on Blockscout](https://blockscout.dev.gblend.xyz/address/0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f)

## 🚨 Important Notes

1. **Fixed-Point Arithmetic:** All values use 18 decimal places
2. **Gas Optimization:** Rust WASM provides efficient mathematical computations
3. **Error Handling:** Functions include bounds checking and overflow protection
4. **Testing:** Always test with small values first to avoid numerical issues

## 📞 Support

For issues or questions:
1. Check the [Fluent Documentation](https://docs.fluent.xyz/)
2. Review contract verification on Blockscout
3. Test functionality using the provided frontend

## 📄 License

MIT License - see individual contract files for specific licensing information.
