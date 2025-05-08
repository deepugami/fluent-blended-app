# Fluent Blended App Deployment

This documentation covers the real-world deployment process for the PRB Math Blended App on the Fluent network.

## Deployed Contract Addresses

| Contract | Address | Explorer Link |
|----------|---------|---------------|
| Rust Contract | `0xEd4da3497bcBFff1F944eB566E7D33e812C43F7a` | [View on Explorer](https://blockscout.dev.thefluent.xyz/address/0xEd4da3497bcBFff1F944eB566E7D33e812C43F7a) |
| Solidity Contract | `0x8D4E34c7A6a757574665CaF2E23684b1dff31Fda` | [View on Explorer](https://blockscout.dev.thefluent.xyz/address/0x8D4E34c7A6a757574665CaF2E23684b1dff31Fda) |

## Network Configuration

- **Network Name**: Fluent Developer Preview
- **Chain ID**: 20993
- **RPC URL**: https://rpc.dev.thefluent.xyz/
- **Block Explorer**: https://blockscout.dev.thefluent.xyz/

## Step-by-Step Deployment Process

### 1. Building the Rust Contract

The Rust contract must be compiled to WebAssembly (WASM) before deployment:

```bash
# Navigate to the rust directory
cd ./rust

# Add the WebAssembly target
rustup target add wasm32-unknown-unknown

# Build the contract for release
cargo build --release --target wasm32-unknown-unknown
```

The output WASM file will be located at `rust/target/wasm32-unknown-unknown/release/prbmath.wasm`.

### 2. Deploying the Rust Contract

The Rust contract is deployed to Fluent network using the gblend tool:

```bash
# Deploy the WASM contract
gblend deploy \
  --private-key YOUR_PRIVATE_KEY \
  --dev rust/target/wasm32-unknown-unknown/release/prbmath.wasm \
  --gas-limit 3000000
```

After deployment, you will receive a contract address for the Rust contract.

### 3. Compiling the Solidity Contract

```bash
# Install Solidity compiler if needed
npm install -g solc

# Compile the Solidity contract
solcjs --abi --bin --include-path node_modules/ --base-path . deployment/prbMathBlended.sol
```

### 4. Deploying the Solidity Contract

The Solidity contract is deployed using a deployment script that references the Rust contract address:

```javascript
const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
  // Connect to Fluent network
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.dev.thefluent.xyz/');
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
  
  // Load contract ABI and bytecode
  const abi = JSON.parse(fs.readFileSync('./prbMathBlended.abi', 'utf8'));
  const bytecode = fs.readFileSync('./prbMathBlended.bin', 'utf8');
  
  // Deploy with Rust contract address as constructor parameter
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy('0xEd4da3497bcBFff1F944eB566E7D33e812C43F7a');
  
  await contract.deployed();
  console.log(`Solidity contract deployed at: ${contract.address}`);
}

main().catch(console.error);
```

Run the deployment script:

```bash
node deploy.js
```

### 5. Updating Frontend Configuration

After deployment, update the frontend application's configuration with the deployed contract addresses:

```javascript
// Update in prb-math-react-frontend/src/App.jsx
const CONTRACT_ADDRESS = "0x8D4E34c7A6a757574665CaF2E23684b1dff31Fda";

const FLUENT_NETWORK = {
  name: 'Fluent Developer Preview',
  chainId: 20993,
  rpcUrl: 'https://rpc.dev.thefluent.xyz/',
  blockExplorer: 'https://blockscout.dev.thefluent.xyz/'
};
```

### 6. Verifying Contracts on Block Explorer

1. Navigate to the Fluent block explorer: https://blockscout.dev.thefluent.xyz/
2. Search for your contract address
3. Click on "Verify & Publish"
4. Select the compiler version and optimization settings
5. Paste your contract source code
6. For the Solidity contract, also provide the constructor arguments (ABI-encoded)

## Testing the Deployed Application

1. Start the frontend application:
   ```bash
   cd prb-math-react-frontend
   npm install
   npm run dev
   ```

2. Connect your wallet to the Fluent Developer Preview network
3. Use the application to perform mathematical calculations that will execute on the deployed contracts

## Troubleshooting

- **Connection Issues**: Ensure your wallet is configured with the correct RPC URL and Chain ID
- **Transaction Failures**: Check that you have enough ETH in your wallet for gas
- **Function Errors**: Verify that the Rust contract is correctly referenced in the Solidity contract

## Security Considerations

- The wallet private key used in this deployment is for testing purposes only
- In a production environment, use a secure method to store and access private keys
- Consider using a hardware wallet or key management system for deployment 