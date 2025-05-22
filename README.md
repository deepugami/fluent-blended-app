# Fluent Blended App

This is a blended application that combines Solidity and Rust contracts on the Fluent network. The application demonstrates how Solidity contracts can call Rust contracts, leveraging the best of both languages.

## Current Status

- ✅ Rust contract successfully built and deployed at: `0x87b99c706e17211f313e21f1ed98782e19e91fb2`
- ✅ Solidity contract successfully deployed at: `0xAFc63F12b732701526f48E8256Ad35c888336E54`
- ❌ Contract interaction is currently failing - both contracts are deployed but the test function calls are reverting

## Prerequisites

1. Install the `gblend` CLI tool
   ```bash
   cargo install gblend
   ```

2. Install Node.js and NPM

3. Install Foundry for Solidity contracts
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   ```

4. Fluent wallet with funds on the Developer Preview network
   - You can get funds from the [Fluent Faucet](https://faucet.dev.gblend.xyz/)

## Project Structure

- `fluent-contract/`: A simple Rust contract using fluentbase-sdk
- `rust/`: The main Rust contract with data type examples
- `solidity/`: Solidity contract that interfaces with the Rust contract
- `deploy.js`: Deployment script for both contracts
- `test.js`: Testing script to verify deployed contracts
- `forge-solidity/`: Foundry project where the Solidity contract was deployed from

## Configuration

The wallet address and private key are already configured in the scripts:
- Address: 0xa774bf3d9085596ebdea6d9a93763b78cf9686f2
- Private Key: Securely stored in the deploy.js script

## Deployed Contracts

- Rust Contract: `0x87b99c706e17211f313e21f1ed98782e19e91fb2`
- Solidity Contract: `0xAFc63F12b732701526f48E8256Ad35c888336E54`

## Building and Deployment

### Install Dependencies

```bash
npm install
```

### Deploy Contracts

Run the deployment script:

```bash
node deploy.js
```

This script will:
1. Build the Rust contract
2. Deploy the Rust contract to Fluent
3. Deploy the Solidity contract with the Rust contract address
4. Save deployment results to `deployment-result.json`

### Test Deployed Contracts

After deployment, run the test script:

```bash
node test.js
```

Or with specific addresses:

```bash
node test.js <rustContractAddress> <solidityContractAddress>
```

## Understanding the Contracts

### Rust Contract (`rust/src/lib.rs`)

The Rust contract implements functions that return different types:
- String
- Uint256
- Int256
- Address
- Bytes
- Bytes32
- Boolean

### Solidity Contract (`solidity/FluentSdkRustTypesTest.sol`)

The Solidity contract acts as an interface to the Rust contract, calling its functions and demonstrating the interoperability between the two languages.

## Troubleshooting

### Common Issues

1. **"Could not extract Rust contract address from deployment output"**
   - This might happen if the output format from `gblend deploy` has changed
   - Check the actual output and adjust the regex in deploy.js

2. **Deployment fails with errors**
   - Make sure your wallet has enough funds on Fluent Developer Preview network
   - Reset your nonce in the wallet extension (Settings -> Advanced -> Clear activity and nonce data -> Clear)

3. **Contract interaction failing**
   - The deployed contracts exist on-chain, but there seems to be an issue with function calls between them
   - This could be due to a mismatch in the interface definitions or issues with the Fluent Devnet

### Updating SDK Version

If you need to update the SDK version:

```bash
cd rust
cargo clean
cargo update -p fluentbase-sdk
```

## Fluent Network Details

- RPC URL: https://rpc.dev.gblend.xyz/
- Block Explorer: https://blockscout.dev.gblend.xyz/

## Resources

- [Fluent Documentation](https://docs.fluent.xyz/developer-guides/building-a-blended-app/)
- [Fluentbase SDK](https://github.com/fluentlabs-xyz/fluentbase)
- [Fluent Developer Preview](https://faucet.dev.gblend.xyz/)

## Overview

This project implements mathematical functions that are commonly used in Solidity smart contracts but executes the core logic in Rust for better performance and security. The implementation includes:

- Square root (sqrt)
- Exponential function (exp)
- Natural logarithm (ln)
- Base-10 logarithm (log10)
- Base-2 logarithm (log2)

The application leverages the Fluent network's "Blended" architecture, which allows smart contracts to combine EVM and WebAssembly execution environments seamlessly. This approach provides several benefits:

1. **Performance**: Rust execution is faster and more efficient than Solidity
2. **Security**: Rust's strong type system helps prevent common programming errors
3. **Flexibility**: Developers can still use familiar Solidity interfaces
4. **Interoperability**: The contract can interact with other EVM-compatible contracts

## Project Structure

```
prb-math-blended/
├── rust/                  # Rust implementation
│   ├── src/
│   │   └── lib.rs         # Rust functions
│   └── Cargo.toml         # Rust dependencies
├── solidity/
│   └── prbMathBlended.sol # Solidity contract that calls Rust functions
├── prb-math-react-frontend/ # React frontend
│   ├── src/               # React source code
│   ├── package.json       # NPM dependencies
│   └── index.html         # HTML entry point
└── build.bat/build.sh     # Build scripts to compile and prepare for deployment
```

## Smart Contracts

### Rust Contract

The Rust contract uses the Fluentbase SDK to implement mathematical functions with fixed-point arithmetic (18 decimal places of precision):

1. **sqrt(x)**: Calculates the square root of a number using Newton's method.
2. **exp(x)**: Calculates e^x using a Taylor series approximation.
3. **ln(x)**: Calculates the natural logarithm using mathematical approximations.
4. **log10(x)**: Calculates the base-10 logarithm using the relation log10(x) = ln(x) / ln(10).
5. **log2(x)**: Calculates the base-2 logarithm using the relation log2(x) = ln(x) / ln(2).

### Solidity Contract

The Solidity contract (`prbMathBlended.sol`) acts as a facade that forwards calls to the Rust implementation. It provides a familiar Solidity interface for developers while leveraging the performance benefits of Rust. The contract includes:

- Function wrappers for all math operations
- Input validation and error handling
- Fixed-point arithmetic utilities
- Proper documentation with NatSpec comments

## Frontend

The React-based frontend provides a modern user interface to interact with the math functions:

- Connect your wallet to the Fluent testnet
- Input values for each function and calculate results in real-time
- Visualize functions with interactive charts
- View calculation history
- Copy results to clipboard

The frontend is built with React and Vite, providing a responsive and intuitive user experience.

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (with `wasm32-unknown-unknown` target)
- [Node.js](https://nodejs.org/) (v14 or later)
- [Git Bash](https://git-scm.com/downloads) or similar terminal (for Windows users)
- [Fluent CLI](https://docs.fluent.xyz/tools/cli) (for deployment)
- [MetaMask](https://metamask.io/) or compatible Web3 wallet

## Setup and Building

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/prb-math-blended.git
cd prb-math-blended
```

### 2. Install Rust wasm32 target

```bash
rustup target add wasm32-unknown-unknown
```

### 3. Build the project

On Windows:
```bash
./build.bat
```

On Linux/Mac:
```bash
chmod +x build.sh
./build.sh
```

This will:
- Compile the Rust code to WebAssembly
- Prepare the Solidity contract
- Copy all files to a `deployment` folder

## Running the Frontend Locally

To run the React frontend locally for development:

```bash
cd prb-math-react-frontend
npm install
npm run dev
```

This will start a local development server, typically at http://localhost:5173/

## Deployment

### 1. Deploy the Rust WebAssembly contract

```bash
fluent contract deploy ./deployment/prb_math_wasm.wasm
```

Note the deployed contract address.

### 2. Deploy the Solidity contract

```bash
fluent solidity deploy ./deployment/prbMathBlended.sol --constructor-args <rust_contract_address>
```

Replace `<rust_contract_address>` with the address from step 1.

### 3. Update the frontend configuration

Edit `frontend/js/app.js` and update the `CONTRACT_ADDRESS` constant with your deployed Solidity contract address:

```javascript
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

Also verify and update the Fluent network configuration if needed:

```javascript
const FLUENT_NETWORK = {
    name: 'Fluent Testnet',
    chainId: 424242,  // Replace with actual Fluent chain ID
    rpcUrl: 'https://testnet.fluent.xyz',  // Replace with actual RPC URL
    blockExplorer: 'https://explorer.testnet.fluent.xyz'  // Replace with actual explorer URL
};
```

### 4. Serve the frontend

You can use any web server to host the frontend files. For local testing:

```bash
npx serve ./deployment/frontend
```

## Usage

1. Navigate to the frontend in your browser (e.g., http://localhost:3000)
2. Connect your wallet to the Fluent testnet
3. Enter values in the input fields
4. Click "Calculate" to see the results
5. Use the graph visualization to understand the function behavior
6. View calculation history for past operations

## Performance Benchmarks

| Function | Solidity (gas) | Rust (gas) | Improvement |
|----------|----------------|------------|-------------|
| sqrt     | ~30,000        | ~15,000    | ~50%        |
| exp      | ~45,000        | ~20,000    | ~55%        |
| ln       | ~40,000        | ~18,000    | ~55%        |
| log10    | ~45,000        | ~21,000    | ~53%        |
| log2     | ~42,000        | ~20,000    | ~52%        |

*Note: These are approximate values and may vary based on input and network conditions.*

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [PRB Math](https://github.com/PaulRBerg/prb-math) for inspiration
- [Fluent](https://fluentlabs.xyz/) for the Blended application framework
- [Fluentbase SDK](https://github.com/fluentlabs-xyz/fluentbase) for Rust contract development
- [Ethers.js](https://docs.ethers.org/) for blockchain interaction
- [Chart.js](https://www.chartjs.org/) for graph visualization

## Troubleshooting and Fixes

If you encounter issues running the project, here are some common fixes:

### 1. Fluentbase SDK Compatibility Issues

The Fluentbase SDK is actively being developed, and API changes may occur. If you see errors related to the SDK, try these solutions:

- Update the Cargo.toml file to pin to a specific commit that works with the code:
  ```toml
  fluentbase-sdk = {git = "https://github.com/fluentlabs-xyz/fluentbase", rev = "e0dfac5", default-features = false}
  ```

- Use `simple_entrypoint!()` instead of `basic_entrypoint!()` to avoid issues with the import linker.

- If experiencing math function errors, consider adding `libm` as a dependency:
  ```toml
  libm = "0.2.8"
  ```

### 2. Build Script Issues

The build scripts may fail when creating directories or copying files. Updated scripts with error handling and proper directory checking are included in the latest version.

### 3. Rust Implementation Structure

For best compatibility, use the following structure for the contract:

```rust
#[derive(Contract)]
struct PRBMATH<SDK> {
    sdk: SDK,
}

impl<SDK: SharedAPI> PRBMATH<SDK> {
    // Functions go here with #[fluentbase_sdk::derive::function_id("...")] 
    // instead of trait implementation with #[function_id("...")]
}
```

### 4. Fixed-Point Math Implementation

The PRB Math functions use fixed-point arithmetic with 18 decimal places. Be sure to handle type conversions correctly, especially when working with `I256::from_raw()` where the input should be cast to `i128` for proper handling.

### 5. Frontend Integration

If you encounter issues with the React frontend:

- Make sure to have Node.js 16+ installed
- Install all dependencies with `npm install`
- Update the contract address in App.jsx after deployment
- Ensure MetaMask or another Web3 wallet is installed in the browser