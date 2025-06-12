#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

// Use libm for mathematical functions since we don't have std
use libm;

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{function_id, router, Contract},
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

    #[function_id("sqrt(uint256)")]
    fn sqrt(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(0);
        }
        
        // Convert from 18 decimal places to f64
        let input_f64 = x.to::<u128>() as f64 / 1e18;
        
        // Use libm for accurate square root
        let result_f64 = libm::sqrt(input_f64);
        
        // Convert back to 18 decimal places and round
        let result_rounded = libm::round(result_f64 * 1e18);
        
        // Convert to i128 and then to I256
        let result_i128 = if result_rounded < i128::MIN as f64 {
            i128::MIN
        } else if result_rounded > i128::MAX as f64 {
            i128::MAX
        } else {
            result_rounded as i128
        };
        
        I256::unchecked_from(result_i128)
    }

    #[function_id("exp(int256)")]
    fn exp(&self, x: I256) -> I256 {
        // Convert from 18 decimal places to f64
        let input_i128 = x.to::<i128>();
        let input_f64 = input_i128 as f64 / 1e18;
        
        // Use libm for accurate exponential
        let result_f64 = libm::exp(input_f64);
        
        // Convert back to 18 decimal places and round
        let result_rounded = libm::round(result_f64 * 1e18);
        
        // Convert to i128 and then to I256
        let result_i128 = if result_rounded < i128::MIN as f64 {
            i128::MIN
        } else if result_rounded > i128::MAX as f64 {
            i128::MAX
        } else {
            result_rounded as i128
        };
        
        I256::unchecked_from(result_i128)
    }

    #[function_id("ln(uint256)")]
    fn ln(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(i128::MIN); // Return very negative value for ln(0)
        }
        
        // Convert from 18 decimal places to f64
        let input_f64 = x.to::<u128>() as f64 / 1e18;
        
        // Use libm for accurate natural logarithm
        let result_f64 = libm::log(input_f64); // libm::log is ln
        
        // Convert back to 18 decimal places and round
        let result_rounded = libm::round(result_f64 * 1e18);
        
        // Convert to i128 and then to I256 (preserving sign)
        let result_i128 = if result_rounded < i128::MIN as f64 {
            i128::MIN
        } else if result_rounded > i128::MAX as f64 {
            i128::MAX
        } else {
            result_rounded as i128
        };
        
        I256::unchecked_from(result_i128)
    }

    #[function_id("log2(uint256)")]
    fn log2(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(i128::MIN); // Return very negative value for log2(0)
        }
        
        // Convert from 18 decimal places to f64
        let input_f64 = x.to::<u128>() as f64 / 1e18;
        
        // Use libm for accurate base-2 logarithm
        let result_f64 = libm::log2(input_f64);
        
        // Convert back to 18 decimal places and round
        let result_rounded = libm::round(result_f64 * 1e18);
        
        // Convert to i128 and then to I256 (preserving sign)
        let result_i128 = if result_rounded < i128::MIN as f64 {
            i128::MIN
        } else if result_rounded > i128::MAX as f64 {
            i128::MAX
        } else {
            result_rounded as i128
        };
        
        I256::unchecked_from(result_i128)
    }

    #[function_id("log10(uint256)")]
    fn log10(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(i128::MIN); // Return very negative value for log10(0)
        }
        
        // Convert from 18 decimal places to f64
        let input_f64 = x.to::<u128>() as f64 / 1e18;
        
        // Use libm for accurate base-10 logarithm
        let result_f64 = libm::log10(input_f64);
        
        // Convert back to 18 decimal places and round
        let result_rounded = libm::round(result_f64 * 1e18);
        
        // Convert to i128 and then to I256 (preserving sign)
        let result_i128 = if result_rounded < i128::MIN as f64 {
            i128::MIN
        } else if result_rounded > i128::MAX as f64 {
            i128::MAX
        } else {
            result_rounded as i128
        };
        
        I256::unchecked_from(result_i128)
    }
}

impl<SDK: SharedAPI> ROUTER<SDK> {
    fn deploy(&self) {
        // Deployment logic
    }
}

basic_entrypoint!(ROUTER);
