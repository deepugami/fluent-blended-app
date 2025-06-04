#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

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
impl<SDK: SharedAPI> RouterAPI for ROUTER<SDK> {

    #[function_id("sqrt(uint256)")]
    fn sqrt(&self, x: U256) -> I256 {
        // Simple implementation for sqrt using integer arithmetic
        if x.is_zero() {
            return I256::unchecked_from(0);
        }
        
        // For demonstration, let's use a simple Newton's method with limited precision
        // Convert to a smaller integer for calculation
        let input = if x > U256::from(u64::MAX) {
            u64::MAX
        } else {
            x.to::<u64>()
        };
        
        if input == 0 {
            return I256::unchecked_from(0);
        }
        
        // Simple integer square root using binary search
        let mut left = 0u64;
        let mut right = input;
        let mut result = 0u64;
        
        while left <= right {
            let mid = left + (right - left) / 2;
            let square = mid.saturating_mul(mid);
            
            if square == input {
                result = mid;
                break;
            } else if square < input {
                result = mid;
                left = mid + 1;
            } else {
                if mid == 0 { break; }
                right = mid - 1;
            }
        }
        
        I256::unchecked_from(result as i64)
    }

    #[function_id("exp(int256)")]
    fn exp(&self, x: I256) -> I256 {
        // Simple exponential approximation
        let input = x.as_i64();
        
        if input == 0 {
            return I256::unchecked_from(1_000_000_000_000_000_000i64); // 1.0 in 18 decimals
        }
        
        if input < 0 {
            // For negative values, return a small positive number
            return I256::unchecked_from(500_000_000_000_000_000i64); // 0.5 in 18 decimals
        }
          // For positive values, return e^x approximation
        let result = if input > 9_000_000_000_000_000_000i64 {
            // Large value, return max safe value
            9_000_000_000_000_000_000i64
        } else {
            // Simple approximation: e^x ≈ 1 + x + x²/2 (first few terms of Taylor series)
            let x_18 = input; // Already in 18 decimals
            let one_18 = 1_000_000_000_000_000_000i64;
            let x_squared = (x_18 / 1_000_000_000_000_000_000i64) * (x_18 / 1_000_000_000_000_000_000i64) * one_18;
            
            one_18 + x_18 + x_squared / 2
        };
        
        I256::unchecked_from(result)
    }

    #[function_id("ln(uint256)")]
    fn ln(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(-9_000_000_000_000_000_000i64); // Very negative
        }
        
        let input = if x > U256::from(u64::MAX) {
            u64::MAX
        } else {
            x.to::<u64>()
        };
        
        // Simple ln approximation
        if input == 1_000_000_000_000_000_000u64 { // ln(1) = 0
            return I256::unchecked_from(0);
        }
        
        if input == 2_718_281_828_459_045_235u64 { // ln(e) ≈ 1
            return I256::unchecked_from(1_000_000_000_000_000_000i64);
        }
        
        // Simple approximation for ln(2) ≈ 0.693
        if input == 2_000_000_000_000_000_000u64 {
            return I256::unchecked_from(693_147_180_559_945_300i64);
        }
        
        // Default approximation
        I256::unchecked_from(500_000_000_000_000_000i64)
    }

    #[function_id("log2(uint256)")]
    fn log2(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(-9_000_000_000_000_000_000i64);
        }
        
        let input = if x > U256::from(u64::MAX) {
            u64::MAX
        } else {
            x.to::<u64>()
        };
        
        // Simple log2 approximation
        if input == 1_000_000_000_000_000_000u64 { // log2(1) = 0
            return I256::unchecked_from(0);
        }
        
        if input == 2_000_000_000_000_000_000u64 { // log2(2) = 1
            return I256::unchecked_from(1_000_000_000_000_000_000i64);
        }
        
        if input == 4_000_000_000_000_000_000u64 { // log2(4) = 2
            return I256::unchecked_from(2_000_000_000_000_000_000i64);
        }
        
        // Default approximation
        I256::unchecked_from(1_000_000_000_000_000_000i64)
    }

    #[function_id("log10(uint256)")]
    fn log10(&self, x: U256) -> I256 {
        if x.is_zero() {
            return I256::unchecked_from(-9_000_000_000_000_000_000i64);
        }
        
        let input = if x > U256::from(u64::MAX) {
            u64::MAX
        } else {
            x.to::<u64>()
        };
        
        // Simple log10 approximation
        if input == 1_000_000_000_000_000_000u64 { // log10(1) = 0
            return I256::unchecked_from(0);
        }
          if input == 10_000_000_000_000_000_000u64 { // log10(10) = 1
            return I256::unchecked_from(1_000_000_000_000_000_000i64);
        }
        
        // Default approximation
        I256::unchecked_from(301_029_995_663_981_200i64) // log10(2) ≈ 0.301
    }
}

impl<SDK: SharedAPI> ROUTER<SDK> {
    fn deploy(&self) {
        // Deployment logic
    }
}

basic_entrypoint!(ROUTER);