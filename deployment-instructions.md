# Blended App Deployment Instructions

This document provides step-by-step instructions for deploying your Blended App on the Fluent network.

## Prerequisites

1. Install the `gblend` CLI tool
2. Set up a private key with funds on the Fluent Developer Preview network (https://faucet.dev.gblend.xyz/)
3. Install Node.js and npm

## Step 1: Deploy the Rust Contract

1. Navigate to the `rust` directory
   ```bash
   cd rust
   ```

2. Build the Rust contract
   ```bash
   gblend build rust -r
   ```

3. Set up your private key as an environment variable
   ```bash
   export devTestnetPrivateKey=YOUR_PRIVATE_KEY_HERE
   ```

4. Deploy the Rust contract
   ```bash
   gblend deploy \
   --private-key $devTestnetPrivateKey \
   --dev lib.wasm \
   --gas-limit 3000000
   ```

5. Copy the deployed Rust contract address and save it for the Solidity contract deployment.

## Step 2: Deploy the Solidity Contract

1. Navigate to the `solidity` directory
   ```bash
   cd ../solidity
   ```

2. Update the `constructor-args.txt` file with your deployed Rust contract address
   ```bash
   echo "YOUR_RUST_CONTRACT_ADDRESS" > constructor-args.txt
   ```

3. Deploy the Solidity contract
   ```bash
   forge create FluentSdkRustTypesTest.sol:FluentSdkRustTypesTest \
   --constructor-args-path constructor-args.txt \
   --private-key $devTestnetPrivateKey \
   --rpc-url https://rpc.dev.gblend.xyz/ \
   --broadcast \
   --verify \
   --verifier blockscout \
   --verifier-url https://blockscout.dev.gblend.xyz/api/
   ```

4. Copy the deployed Solidity contract address for the JavaScript testing.

## Step 3: Testing with JavaScript

1. Install dependencies
   ```bash
   npm install
   ```

2. Update the contract addresses in the JavaScript files
   - Open `solidity.js` and update `contractAddress` with your deployed Solidity contract address
   - Open `rust.js` and update `contractAddress` with your deployed Rust contract address

3. Test the Solidity contract calling Rust
   ```bash
   node solidity.js
   ```

4. Test the direct Rust contract interaction
   ```bash
   node rust.js
   ```

## Troubleshooting

If you encounter issues with the Rust SDK, try:

```bash
cd rust
cargo clean
cargo update -p fluentbase-sdk
```

For more information, visit: https://docs.fluent.xyz/developer-guides/building-a-blended-app/ 