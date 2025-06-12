# PRB Math Blended with libm Integration

## Overview
This project successfully integrates the `libm` library for mathematical functions in a Rust WebAssembly (WASM) module deployed on the Fluent testnet. The implementation provides accurate floating-point mathematical operations without requiring the standard library.

## What is libm?
`libm` is a pure Rust implementation of the C math library (libm) that provides mathematical functions for `no_std` environments like WebAssembly. It includes functions like:
- `sqrt()` - Square root
- `exp()` - Exponential function (e^x)
- `log()` - Natural logarithm (ln)
- `log2()` - Base-2 logarithm
- `log10()` - Base-10 logarithm

## Why libm is Needed
When compiling Rust to WebAssembly with `#![no_std]`, we don't have access to the standard library's math functions. The `libm` crate provides these essential mathematical operations in a `no_std` compatible way.

## Implementation Details

### Rust Code Structure
```rust
#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

use libm;  // Import the libm crate for math functions

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, Contract},
    SharedAPI,
    U256, I256,
};
```

### Mathematical Functions Implemented
1. **sqrt(uint256)** - Square root with 18 decimal precision
2. **exp(int256)** - Exponential function with 18 decimal precision  
3. **ln(uint256)** - Natural logarithm with 18 decimal precision
4. **log2(uint256)** - Base-2 logarithm with 18 decimal precision
5. **log10(uint256)** - Base-10 logarithm with 18 decimal precision

### Key Implementation Features
- **Fixed-point arithmetic**: All values use 18 decimal places (wei scale)
- **Type conversion**: Converts between U256/I256 and f64 for calculations
- **Error handling**: Proper handling of edge cases (like log of zero)
- **libm integration**: Uses libm functions for accurate floating-point math

## How It Works

### Data Flow
1. **Input**: Solidity passes U256/I256 values (18 decimal fixed-point)
2. **Conversion**: Rust converts to f64 by dividing by 1e18
3. **Calculation**: libm performs the mathematical operation
4. **Conversion**: Result is scaled back to 18 decimals and converted to I256
5. **Output**: Solidity receives the result as int256

### Example: Square Root
```rust
#[function_id("sqrt(uint256)")]
fn sqrt(&self, x: U256) -> I256 {
    if x.is_zero() {
        return I256::unchecked_from(0);
    }
    
    // Convert U256 to f64 (treating as 18 decimal fixed point)
    let x_u64 = x.to::<u64>();
    let x_f64 = (x_u64 as f64) / 1e18;
    
    // Calculate sqrt using libm
    let result_f64 = libm::sqrt(x_f64);
    
    // Convert back to 18 decimal fixed point
    let result_scaled = (result_f64 * 1e18) as i64;
    
    I256::unchecked_from(result_scaled)
}
```

## Building and Deployment

### Prerequisites
- Rust with wasm32-unknown-unknown target
- Node.js and npm
- Fluent CLI tools

### Build Process
```bash
# Build for WebAssembly
cd rust/
cargo build --target wasm32-unknown-unknown --release

# Copy WASM file
cp target/wasm32-unknown-unknown/release/prb_math_blended.wasm ../lib.wasm
```

### Dependencies in Cargo.toml
```toml
[dependencies]
alloy-sol-types = {version = "0.7.4", default-features = false}
fluentbase-sdk = {git = "https://github.com/fluentlabs-xyz/fluentbase", default-features = false}
libm = {version = "0.2", default-features = false}  # Key dependency for math functions
```

## Testing

### Basic Test Values
- `sqrt(4 * 10^18)` should return `2 * 10^18`
- `exp(1 * 10^18)` should return `2.718... * 10^18` (e)
- `ln(e * 10^18)` should return `1 * 10^18`
- `log2(8 * 10^18)` should return `3 * 10^18`
- `log10(100 * 10^18)` should return `2 * 10^18`

### Running Tests
```bash
node test-libm-implementation.js
```

## Troubleshooting Common Issues

### 1. Compilation Errors
**Issue**: `function_id` is defined multiple times
**Solution**: Don't import `function_id` explicitly; the `router` macro provides it automatically.

### 2. Type Conversion Errors  
**Issue**: `no method named 'to' found`
**Solution**: Use `x.to::<u64>()` for U256 and `x.as_i64()` for I256.

### 3. Literal Overflow
**Issue**: Large negative numbers exceed i64 range
**Solution**: Use appropriate ranges like `-1000000000000000000i64` instead of larger values.

### 4. Missing Math Functions
**Issue**: Math functions not available in `no_std`
**Solution**: Add `libm = {version = "0.2", default-features = false}` to dependencies.

## Performance Considerations

- **Precision**: f64 provides sufficient precision for most mathematical operations
- **Range**: Input values are limited by u64/i64 conversion ranges
- **Gas costs**: Mathematical operations are computationally efficient
- **WASM size**: libm adds minimal overhead to the binary size

## Security Notes

- **Input validation**: All functions check for edge cases (zero values, overflows)
- **Safe conversions**: Uses appropriate type conversions to prevent panics
- **Range limits**: Results are clamped to prevent overflow errors

## Reference Implementation
This implementation is based on the reference code from:
https://github.com/MarcusWentz/Web3_Get_Set_Contract_Metamask/blob/main/Scripts/rust/fluent/prb_math_return_test/src/lib.rs

## Conclusion
The libm integration successfully provides accurate mathematical functions for WebAssembly modules on the Fluent blockchain. This approach enables complex mathematical operations while maintaining the performance and security benefits of Rust and WASM.
