#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

use libm;

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
impl<SDK: SharedAPI> RouterAPI for ROUTER<SDK> {    #[function_id("sqrt(uint256)")]
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
    }    #[function_id("exp(int256)")]
    fn exp(&self, x: I256) -> I256 {
        // Convert I256 to f64 (treating as 18 decimal fixed point)
        let x_i64 = x.as_i64();
        let x_f64 = (x_i64 as f64) / 1e18;
        
        // Calculate exp using libm
        let result_f64 = libm::exp(x_f64);
        
        // Convert back to 18 decimal fixed point
        let result_scaled = (result_f64 * 1e18) as i64;
        
        I256::unchecked_from(result_scaled)
    }    #[function_id("ln(uint256)")]
    fn ln(&self, x: U256) -> I256 {        if x.is_zero() {
            // Return a very negative number for ln(0)
            return I256::unchecked_from(-1000000000000000000i64);
        }
        
        // Convert U256 to f64 (treating as 18 decimal fixed point)
        let x_u64 = x.to::<u64>();
        let x_f64 = (x_u64 as f64) / 1e18;
        
        // Calculate ln using libm
        let result_f64 = libm::log(x_f64);
        
        // Convert back to 18 decimal fixed point
        let result_scaled = (result_f64 * 1e18) as i64;
        
        I256::unchecked_from(result_scaled)
    }    #[function_id("log2(uint256)")]
    fn log2(&self, x: U256) -> I256 {        if x.is_zero() {
            // Return a very negative number for log2(0)
            return I256::unchecked_from(-1000000000000000000i64);
        }
        
        // Convert U256 to f64 (treating as 18 decimal fixed point)
        let x_u64 = x.to::<u64>();
        let x_f64 = (x_u64 as f64) / 1e18;
        
        // Calculate log2 using libm
        let result_f64 = libm::log2(x_f64);
        
        // Convert back to 18 decimal fixed point
        let result_scaled = (result_f64 * 1e18) as i64;
        
        I256::unchecked_from(result_scaled)
    }    #[function_id("log10(uint256)")]
    fn log10(&self, x: U256) -> I256 {        if x.is_zero() {
            // Return a very negative number for log10(0)
            return I256::unchecked_from(-1000000000000000000i64);
        }
        
        // Convert U256 to f64 (treating as 18 decimal fixed point)
        let x_u64 = x.to::<u64>();
        let x_f64 = (x_u64 as f64) / 1e18;
        
        // Calculate log10 using libm
        let result_f64 = libm::log10(x_f64);
        
        // Convert back to 18 decimal fixed point
        let result_scaled = (result_f64 * 1e18) as i64;
        
        I256::unchecked_from(result_scaled)
    }
}

impl<SDK: SharedAPI> ROUTER<SDK> {
    fn deploy(&self) {
        // Deployment logic
    }
}

basic_entrypoint!(ROUTER);