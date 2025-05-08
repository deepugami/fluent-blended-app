#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

use alloc::string::String;
use fluentbase_sdk::{
    simple_entrypoint,
    derive::Contract,
    SharedAPI,
    U256,
    I256,
};

// Constants for fixed-point math (with 18 decimals of precision)
const SCALE: u64 = 1_000_000_000_000_000_000; // 10^18

#[derive(Contract)]
struct PRBMATH<SDK> {
    sdk: SDK,
}

impl<SDK: SharedAPI> PRBMATH<SDK> {
    fn deploy(&self) {
        // Any deployment logic here
    }

    // Square root function using Newton's method
    #[fluentbase_sdk::derive::function_id("sqrt(uint256)")]
    pub fn sqrt(&self, x: U256) -> U256 {
        if x == U256::ZERO {
            return U256::ZERO;
        }
        
        if x == U256::from(1) {
            return U256::from(1);
        }
        
        let mut z = x;
        let mut y = (z + U256::from(1)) / U256::from(2);
        
        // Continue until we reach sufficient precision
        while y < z {
            z = y;
            y = (x / y + y) / U256::from(2);
        }
        
        z
    }

    // Exponential function e^x using Taylor series
    #[fluentbase_sdk::derive::function_id("exp(int256)")]
    pub fn exp(&self, x: I256) -> I256 {
        // Handle edge cases
        if x == I256::ZERO {
            return I256::from_raw(SCALE as i128); // e^0 = 1
        }
        
        // For very large negative values, return 0
        if x < I256::from_raw(-40 * SCALE as i128) {
            return I256::ZERO;
        }
        
        // For very large positive values, return max value to prevent overflow
        if x > I256::from_raw(40 * SCALE as i128) {
            return I256::MAX;
        }
        
        // Handle negative exponents: e^(-x) = 1/e^x
        let is_negative = x < I256::ZERO;
        let abs_x = if is_negative { -x } else { x };
        
        // Taylor series approximation for e^x with sufficient terms for accuracy
        let mut result = I256::from_raw(SCALE as i128); // Start with 1 (scaled)
        let mut term = I256::from_raw(SCALE as i128);   // Current term (starts at 1)
        
        // Use more terms for better precision
        for i in 1..=20 {
            term = (term * abs_x) / I256::from_raw((i * SCALE) as i128);
            result = result + term;
            
            // Break early if term becomes insignificant
            if term < I256::from_raw((SCALE / 1_000_000) as i128) {
                break;
            }
        }
        
        // For negative exponents, compute 1/result
        if is_negative {
            return (I256::from_raw(SCALE as i128) * I256::from_raw(SCALE as i128)) / result;
        }
        
        result
    }

    // Natural logarithm
    #[fluentbase_sdk::derive::function_id("ln(uint256)")]
    pub fn ln(&self, x: U256) -> I256 {
        // Handle edge cases
        if x == U256::ZERO {
            return I256::MIN; // Return min value for log(0) = -∞
        }
        
        let scale_u256 = U256::from_limbs([SCALE, 0, 0, 0]);
        
        if x == scale_u256 {
            return I256::ZERO; // ln(1) = 0
        }
        
        if x < scale_u256 {
            // For 0 < x < 1, use ln(x) = -ln(1/x)
            let inv_x = (scale_u256 * scale_u256) / x;
            return -self.ln(inv_x);
        }
        
        // For x > 1, use the Taylor series around y = (x-1)/(x+1)
        let num = x - scale_u256;
        let denom = x + scale_u256;
        let y = (num * scale_u256) / denom;
        
        // Compute 2 * (y + y^3/3 + y^5/5 + ...)
        let mut result = I256::ZERO;
        let mut term = I256::from_raw(y.as_limbs()[0] as i128);
        let mut power = term;
        let scale_i256 = I256::from_raw(SCALE as i128);
        
        for i in 0..12 {
            let divisor = I256::from_raw((2 * i as u64 + 1) as i128);
            result = result + power / divisor;
            
            // Calculate next term: y^(2i+3)
            power = (power * term * term) / scale_i256;
        }
        
        result * I256::from_raw(2)
    }

    // Base-10 logarithm: log10(x) = ln(x) / ln(10)
    #[fluentbase_sdk::derive::function_id("log10(uint256)")]
    pub fn log10(&self, x: U256) -> I256 {
        if x == U256::ZERO {
            return I256::MIN; // Return min value for log10(0) = -∞
        }
        
        let ln_x = self.ln(x);
        let ln_10 = I256::from_raw(2_302_585_092_994_045_684); // ln(10) * 10^18
        (ln_x * I256::from_raw(SCALE as i128)) / ln_10
    }

    // Base-2 logarithm: log2(x) = ln(x) / ln(2)
    #[fluentbase_sdk::derive::function_id("log2(uint256)")]
    pub fn log2(&self, x: U256) -> I256 {
        if x == U256::ZERO {
            return I256::MIN; // Return min value for log2(0) = -∞
        }
        
        let ln_x = self.ln(x);
        let ln_2 = I256::from_raw(693_147_180_559_945_309); // ln(2) * 10^18
        (ln_x * I256::from_raw(SCALE as i128)) / ln_2
    }
}

simple_entrypoint!(PRBMATH); 