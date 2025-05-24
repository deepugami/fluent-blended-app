# Contract Deployment Instructions

The application now uses the following deployed contract addresses on the Fluent Developer Preview network.

## Current Contract Addresses

- **Solidity Contract**: `0x2ed29d982b0120d49899a7cc7afe7f5d5435bc56`
- **Rust Contract**: `0xaf3d76b5294c82c080c93b4c964cdf6a15f29d1e`
- **Wallet Address**: `0xE3be5250dC953F4581e4be70EaB0C23544006261`
- **Private Key**: `0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa`

## Deployment Steps

To properly deploy the contracts and enable blockchain functionality on Fluent:

1. Navigate to the deployment directory:
   ```
   cd ../deployment
   ```

2. Build the Rust contract:
   ```
   cd ../rust
   rustup target add wasm32-unknown-unknown
   cargo build --release --target wasm32-unknown-unknown
   ```

3. Deploy the Rust contract using gblend:
   ```
   gblend deploy --private-key 0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa --dev target/wasm32-unknown-unknown/release/prbmath.wasm --gas-limit 3000000
   ```
   Note the address of the deployed Rust contract.

4. Compile the Solidity contract:
   ```
   cd ../deployment
   solcjs --abi --bin --include-path node_modules/ --base-path . prbMathBlended.sol
   ```

5. Deploy the Solidity contract with the Rust contract address:
   ```
   cd ../deployment/scripts
   node real-world-deploy.js
   ```

6. Update the `App.jsx` file with the new contract address:
   ```javascript
   // In src/App.jsx
   const FLUENT_CONTRACT_ADDRESS = "[new-solidity-contract-address]";
   ```

7. Remove or comment out the automatic mock mode for Fluent network:
   ```javascript
   // Comment out or remove this section in connectWallet function
   /* 
   if (selectedNetwork === 'fluent') {
     console.log("Checking for contract existence on Fluent network...");
     useFallbackMock("Using automatic mock mode for Fluent network");
     setConnecting(false);
     return;
   }
   */
   ```

## Error Troubleshooting

If you encounter deployment errors:

1. **Gas Limit Errors**: Try increasing the gas limit for the deployment
2. **Rust Contract Issues**: Make sure the Rust contract is properly compiled
3. **Solidity Contract Issues**: Verify the constructor arguments are correct

## Network Details

- **Network**: Fluent Developer Preview
- **Chain ID**: 20993
- **RPC URL**: `https://rpc.dev.gblend.xyz`
- **Block Explorer**: `https://explorer.dev.gblend.xyz/` 