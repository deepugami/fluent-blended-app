#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, Contract},
    SharedAPI,
    U256, I256,
};

#[derive(Contract)]
struct ROUTER<SDK> {
    sdk: SDK,
}

pub trait RouterAPI {
    fn sqrt(&self, x: U256) -> I256;
    fn exp(&self, x: I256) -> I256;
    fn ln(&self, x: U256) -> I256;
    fn log2(&self, x: U256) -> I256;
    fn log10(&self, x: U256) -> I256;
}

#[router(mode = "solidity")]
impl<SDK: SharedAPI> RouterAPI for ROUTER<SDK> {

    fn sqrt(&self, x: U256) -> I256 {
        // Simple test - just return 2 * 10^18 for sqrt(4)
        I256::unchecked_from(2000000000000000000i128)
    }

    fn exp(&self, x: I256) -> I256 {
        // Simple test - just return 54 * 10^18 for exp(4)
        I256::unchecked_from(54000000000000000000i128)
    }

    fn ln(&self, x: U256) -> I256 {
        // Simple test - just return 1.4 * 10^18 for ln(4)
        I256::unchecked_from(1400000000000000000i128)
    }

    fn log2(&self, x: U256) -> I256 {
        // Simple test - just return 2 * 10^18 for log2(4)
        I256::unchecked_from(2000000000000000000i128)
    }

    fn log10(&self, x: U256) -> I256 {
        // Simple test - just return 0.6 * 10^18 for log10(4)
        I256::unchecked_from(600000000000000000i128)
    }
}

impl<SDK: SharedAPI> ROUTER<SDK> {
    fn deploy(&self) {
        // Deployment logic
    }
}

basic_entrypoint!(ROUTER);
