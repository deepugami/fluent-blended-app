#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;
extern crate libm;

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, Contract},
    SharedAPI,
    U256,
    I256,
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
        
        // Convert from 18 decimal places to f64
        let input_f64 = x.to::<u128>() as f64 / 1e18;
        
        // Use libm for accurate square root
        let result_f64 = libm::sqrt(input_f64);
        
        // Convert back to 18 decimal places
        let result_i128 = (result_f64 * 1e18) as i128;
        
        // Clamp to i64 range for safety
        let result_i64 = if result_i128 > i64::MAX as i128 {
            i64::MAX
        } else if result_i128 < i64::MIN as i128 {
            i64::MIN
        } else {
            result_i128 as i64
        };
        
        I256::unchecked_from(result_i64)
    }    #[function_id("exp(int256)")]
    fn exp(&self, x: I256) -> I256 {
        // Convert from 18 decimal places to f64
        let input_f64 = x.as_i128() as f64 / 1e18;
        
        // Use libm for accurate exponential
        let result_f64 = libm::exp(input_f64);
        
        // Convert back to 18 decimal places
        let result_i128 = (result_f64 * 1e18) as i128;
        
        // Clamp to i64 range for safety
        let result_i64 = if result_i128 > i64::MAX as i128 {
            i64::MAX
        } else if result_i128 < i64::MIN as i128 {
            i64::MIN
        } else {
            result_i128 as i64
        };
        
        I256::unchecked_from(result_i64)
    }    #[function_id("ln(uint256)")]
    fn ln(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(i64::MIN); // -∞ approximation
        }
        
        // Convert from 18 decimal places to f64
        let input_f64 = x.to::<u128>() as f64 / 1e18;
        
        // Use libm for accurate natural logarithm
        let result_f64 = libm::ln(input_f64);
        
        // Convert back to 18 decimal places
        let result_i128 = (result_f64 * 1e18) as i128;
        
        // Clamp to i64 range for safety
        let result_i64 = if result_i128 > i64::MAX as i128 {
            i64::MAX
        } else if result_i128 < i64::MIN as i128 {
            i64::MIN
        } else {
            result_i128 as i64
        };
        
        I256::unchecked_from(result_i64)
    }    #[function_id("log2(uint256)")]
    fn log2(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(i64::MIN); // -∞ approximation
        }
        
        // Convert from 18 decimal places to f64
        let input_f64 = x.to::<u128>() as f64 / 1e18;
        
        // Use libm for accurate base-2 logarithm
        let result_f64 = libm::log2(input_f64);
        
        // Convert back to 18 decimal places
        let result_i128 = (result_f64 * 1e18) as i128;
        
        // Clamp to i64 range for safety
        let result_i64 = if result_i128 > i64::MAX as i128 {
            i64::MAX
        } else if result_i128 < i64::MIN as i128 {
            i64::MIN
        } else {
            result_i128 as i64
        };
        
        I256::unchecked_from(result_i64)
    }    #[function_id("log10(uint256)")]
    fn log10(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(i64::MIN); // -∞ approximation
        }
        
        // Convert from 18 decimal places to f64
        let input_f64 = x.to::<u128>() as f64 / 1e18;
        
        // Use libm for accurate base-10 logarithm
        let result_f64 = libm::log10(input_f64);
        
        // Convert back to 18 decimal places
        let result_i128 = (result_f64 * 1e18) as i128;
        
        // Clamp to i64 range for safety
        let result_i64 = if result_i128 > i64::MAX as i128 {
            i64::MAX
        } else if result_i128 < i64::MIN as i128 {
            i64::MIN
        } else {
            result_i128 as i64
        };
        
        I256::unchecked_from(result_i64)
    }
}

impl<SDK: SharedAPI> ROUTER<SDK> {
    fn deploy(&self) {
        // Deployment logic
    }
}

basic_entrypoint!(ROUTER);