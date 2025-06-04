#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, Contract},
    SharedAPI,
    U256,    // alloy Solidity type for uint256
    I256,    // alloy Solidity type for int256
};

#[derive(Contract)]
struct ROUTER<SDK> {
    sdk: SDK,
}

pub trait RouterAPI {
    // Make sure type interfaces are defined here or else there will be a compiler error.
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
        let input = x.to::<u64>();
        if input == 0 {
            return I256::unchecked_from(0);
        }
        
        // Convert to f64 for calculation (with 18 decimal places)
        let input_f64 = input as f64 / 1e18;
        
        // Newton's method for square root
        let mut guess = input_f64 / 2.0;
        for _ in 0..50 {
            if guess == 0.0 { break; }
            let new_guess = (guess + input_f64 / guess) / 2.0;
            if (new_guess - guess).abs() < 1e-15 {
                break;
            }
            guess = new_guess;
        }
        
        // Convert back to I256 with 18 decimal places
        let result = (guess * 1e18) as i64;
        I256::unchecked_from(result)
    }

    #[function_id("exp(int256)")]
    fn exp(&self, x: I256) -> I256 {
        let input_f64 = x.as_i64() as f64 / 1e18;
        
        // Handle extreme cases
        if input_f64 > 40.0 {
            return I256::unchecked_from(i64::MAX); // Very large positive value
        }
        if input_f64 < -40.0 {
            return I256::unchecked_from(0);
        }
        
        // Taylor series for e^x
        let mut result = 1.0;
        let mut term = 1.0;
        
        for i in 1..50 {
            term *= input_f64 / (i as f64);
            result += term;
            if term.abs() < 1e-15 {
                break;
            }
        }
        
        let final_result = (result * 1e18) as i64;
        I256::unchecked_from(final_result)
    }    #[function_id("ln(uint256)")]
    fn ln(&self, x: U256) -> I256 {
        let input = x.to::<u64>();
        if input == 0 {
            return I256::unchecked_from(-9223372036854775808i64); // Very negative for ln(0)
        }
        
        let input_f64 = input as f64 / 1e18;
        
        if input_f64 <= 0.0 {
            return I256::unchecked_from(-9223372036854775808i64);
        }
        
        // Natural logarithm using series expansion around x=1
        let ln_result = if input_f64 == 1.0 {
            0.0
        } else {
            self.ln_internal(input_f64)
        };
        
        let final_result = (ln_result * 1e18) as i64;
        I256::unchecked_from(final_result)
    }

    #[function_id("log2(uint256)")]
    fn log2(&self, x: U256) -> I256 {
        let ln_result = self.ln(x);
        let ln_2 = I256::unchecked_from((0.6931471805599453 * 1e18) as i64);
        
        if ln_2.as_i64() == 0 {
            return I256::unchecked_from(0);
        }
        
        // log2(x) = ln(x) / ln(2)
        let result = (ln_result.as_i64() as i128 * 1000000000000000000i128) / (ln_2.as_i64() as i128);
        I256::unchecked_from(result as i64)
    }

    #[function_id("log10(uint256)")]
    fn log10(&self, x: U256) -> I256 {
        let ln_result = self.ln(x);
        let ln_10 = I256::unchecked_from((2.302585092994046 * 1e18) as i64);
        
        if ln_10.as_i64() == 0 {
            return I256::unchecked_from(0);
        }
        
        // log10(x) = ln(x) / ln(10)
        let result = (ln_result.as_i64() as i128 * 1000000000000000000i128) / (ln_10.as_i64() as i128);
        I256::unchecked_from(result as i64)
    }
}

impl<SDK: SharedAPI> ROUTER<SDK> {
    fn deploy(&self) {
        // any custom deployment logic here
    }
    
    fn ln_internal(&self, x: f64) -> f64 {
        if x <= 0.0 {
            return -1000.0;
        }
        if x == 1.0 {
            return 0.0;
        }
        
        // Use series expansion: ln(1+u) = u - u²/2 + u³/3 - u⁴/4 + ...
        // Transform x to 1+u form
        if x > 0.5 && x < 1.5 {
            let u = x - 1.0;
            let mut result = 0.0;
            let mut term = u;
            let mut sign = 1.0;
            
            for i in 1..100 {
                result += sign * term / (i as f64);
                term *= u;
                sign *= -1.0;
                if term.abs() < 1e-15 {
                    break;
                }
            }
            result
        } else if x >= 1.5 {
            // ln(2x) = ln(2) + ln(x)
            0.6931471805599453 + self.ln_internal(x / 2.0)
        } else {
            // ln(1/x) = -ln(x)
            -self.ln_internal(1.0 / x)
        }
    }
}

basic_entrypoint!(ROUTER);