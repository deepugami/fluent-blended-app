# Fluent Blended Math Challenge

A mathematical calculation application demonstrating the integration between Solidity and Rust smart contracts on Fluent Network.

## Quick Start

To run the frontend locally:

```bash
# Windows
launch-frontend.bat

# Linux/macOS
./launch-frontend.sh

# Or manually
cd prb-math-blended/frontend && python -m http.server 8000
```

Open http://localhost:8000 in your browser.

## Deployed Contracts

### Rust Contract (libm Mathematical Functions)
- **Address**: `0x87b99c706e17211f313e21f1ed98782e19e91fb2`
- **Explorer**: [View on Blockscout](https://blockscout.dev.gblend.xyz/address/0x87b99c706e17211f313e21f1ed98782e19e91fb2)

### Solidity Contract (PRB-Math Style + Blended Execution)
- **Address**: `0xafc63f12b732701526f48e8256ad35c888336e54`
- **Explorer**: [View on Blockscout](https://blockscout.dev.gblend.xyz/address/0xafc63f12b732701526f48e8256ad35c888336e54)

## Network Configuration

**Fluent DevNet**
- RPC URL: https://rpc.dev.gblend.xyz/
- Chain ID: 20993
- Block Explorer: https://blockscout.dev.gblend.xyz/

## What This Project Does

This application compares mathematical implementations between Solidity and Rust:

### Core Features
- **Cross-language contract calls**: Solidity contracts calling Rust functions within single transactions
- **Performance benchmarking**: Real-time comparison of execution times
- **Accuracy analysis**: Precision comparisons between different mathematical approaches
- **Interactive interface**: Web-based calculator for testing functions

### Mathematical Functions Implemented
- **Square Root (√x)**: Babylonian method vs libm::sqrt
- **Exponential (e^x)**: Taylor series vs libm::exp  
- **Natural Logarithm (ln(x))**: Binary search vs libm::log
- **Base-2 Logarithm (log₂(x))**: Bit manipulation vs libm::log2
- **Base-10 Logarithm (log₁₀(x))**: Change of base vs libm::log10

## Frontend Application

### Calculator Interface
- Side-by-side comparison of Solidity vs Rust results
- Performance timing measurements
- Accuracy difference calculations
- Input validation and error handling

### Visualizations
- Performance charts showing execution time comparisons
- Function accuracy plots
- Automated test suite with comprehensive coverage
- Live demonstrations with various input ranges

### Technical Information
- Implementation details for both contract languages
- Documentation links and external resources
- Educational content about blended execution benefits

## Technical Architecture

```
Web Frontend (JavaScript + Web3)
    ↓
Solidity Contract (Fixed-point arithmetic)
    ↓ (Cross-language call)
Rust Contract (libm floating-point)
    ↓
Fluent Network (Blended Execution)
```

### Technologies Used
- **Solidity**: PRB-Math style fixed-point arithmetic (18 decimals)
- **Rust**: libm library for high-precision floating-point operations
- **Fluent SDK**: WASM compilation and blended execution framework
- **Frontend**: JavaScript with Web3 integration and Chart.js visualizations

## Project Structure

```
blended-app/
├── prb-math-blended/
│   ├── rust/                 # Rust contract (libm functions)
│   ├── frontend/             # Web application
│   └── deploy.js             # Deployment scripts
├── solidity/                 # Solidity contract source
├── deployment-result.json    # Contract addresses
├── DEPLOYMENT_COMPLETE.md    # Deployment documentation
├── verify-deployment.js      # Contract verification
└── launch-frontend.*         # Quick start scripts
```

## Testing

### Contract Verification
```bash
# Test contract connectivity
node verify-deployment.js

# Test contract interactions  
node test_contract_interaction.js

# Check contract details
node check_contracts.js
```

### Frontend Validation
The application includes tests for:
1. Network connectivity to Fluent DevNet
2. Contract address verification
3. Mathematical function calculations
4. Performance benchmarking
5. Visual demonstrations

## Resources

- [Fluent Blended App Guide](https://docs.fluent.xyz/developer-guides/building-a-blended-app/)
- [PRB-Math Library](https://github.com/PaulRBerg/prb-math)
- [Rust libm Crate](https://crates.io/crates/libm)
- [Desmos Calculator](https://www.desmos.com/calculator/5p8c3q2is2)
- [Fluent Discord](https://discord.gg/fluent)

## Implementation Details

This project demonstrates practical integration between Solidity and Rust smart contracts. The application showcases cross-language contract interactions, performance comparisons, and mathematical precision analysis through a professional web interface.

The system successfully implements:
- Cross-language smart contract integration
- Real-time performance comparison
- Mathematical precision analysis  
- Professional frontend interface
- Comprehensive documentation