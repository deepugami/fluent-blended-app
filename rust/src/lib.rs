#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

// Using optimized mathematical functions to prevent timeouts and errors
mod lib_2;

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, Contract},
    SharedAPI,
    U256,    // alloy Solidity type for uint256
};

#[derive(Contract)]
struct ROUTER<SDK> {
    sdk: SDK,
}

pub trait RouterAPI {
    // Test functions
    fn echo_input(&self, x: U256) -> U256;
    fn double_input(&self, x: U256) -> U256;
    
    // Mathematical functions matching the Solidity interface exactly
    fn sqrt(&self, x: U256) -> U256;
    fn exp(&self, x: U256) -> U256;
    fn ln(&self, x: U256) -> U256;
    fn log2(&self, x: U256) -> U256;
    fn log10(&self, x: U256) -> U256;
}

#[router(mode = "solidity")]
impl<SDK: SharedAPI> RouterAPI for ROUTER<SDK> {

        #[function_id("echo_input(uint256)")]
    fn echo_input(&self, x: U256) -> U256 {
        use lib_2::OptimizedMathApproximations;
        let math = OptimizedMathApproximations::new();
        math.echo_input(x)
    }

    #[function_id("double_input(uint256)")]
    fn double_input(&self, x: U256) -> U256 {
        use lib_2::OptimizedMathApproximations;
        let math = OptimizedMathApproximations::new();
        math.double_input(x)
    }

    // Mathematical functions with optimization
    #[function_id("sqrt(uint256)")]
    fn sqrt(&self, x: U256) -> U256 {
        use lib_2::OptimizedMathApproximations;
        let math = OptimizedMathApproximations::new();
        math.rust_sqrt_uint256(x)
    }

    #[function_id("exp(uint256)")]
    fn exp(&self, x: U256) -> U256 {
        use lib_2::OptimizedMathApproximations;
        let math = OptimizedMathApproximations::new();
        math.rust_exp_uint256(x)
    }

    #[function_id("ln(uint256)")]
    fn ln(&self, x: U256) -> U256 {
        use lib_2::OptimizedMathApproximations;
        let math = OptimizedMathApproximations::new();
        math.rust_ln_uint256(x)
    }

    #[function_id("log2(uint256)")]
    fn log2(&self, x: U256) -> U256 {
        use lib_2::OptimizedMathApproximations;
        let math = OptimizedMathApproximations::new();
        math.rust_log2_uint256(x)
    }

    #[function_id("log10(uint256)")]
    fn log10(&self, x: U256) -> U256 {
        use lib_2::OptimizedMathApproximations;
        let math = OptimizedMathApproximations::new();
        math.rust_log10_uint256(x)
    }
}

impl<SDK: SharedAPI> ROUTER<SDK> {
    fn deploy(&self) {
        // any custom deployment logic here
    }
}

basic_entrypoint!(ROUTER);
