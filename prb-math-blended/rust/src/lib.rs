#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;
extern crate fluentbase_sdk;

use alloc::string::{String, ToString};
use fluentbase_sdk::{
    basic_entrypoint,
    derive::{router, signature},
    SharedAPI,
};

#[derive(Default)]
struct ROUTER;

pub trait RouterAPI {
    fn sqrt<SDK: SharedAPI>(&self, x: u64) -> u64;
    fn exp<SDK: SharedAPI>(&self, x: i64) -> i64;
    fn ln<SDK: SharedAPI>(&self, x: u64) -> i64;
    fn log10<SDK: SharedAPI>(&self, x: u64) -> i64;
    fn log2<SDK: SharedAPI>(&self, x: u64) -> i64;
}

#[router(mode = "solidity")]
impl RouterAPI for ROUTER {
    /// Calculate square root using libm
    /// Input and output are scaled by 10^18 for fixed-point arithmetic
    #[signature("function sqrt(uint256) external view returns (uint256)")]
    fn sqrt<SDK: SharedAPI>(&self, x: u64) -> u64 {
        if x == 0 {
            return 0;
        }
        
        // Convert from fixed-point (18 decimals) to float
        let x_float = (x as f64) / 1e18;
        
        // Calculate square root using libm
        let result = libm::sqrt(x_float);
        
        // Convert back to fixed-point
        (result * 1e18) as u64
    }

    /// Calculate e^x using libm
    /// Input and output are scaled by 10^18 for fixed-point arithmetic
    #[signature("function exp(int256) external view returns (int256)")]
    fn exp<SDK: SharedAPI>(&self, x: i64) -> i64 {
        // Convert from fixed-point (18 decimals) to float
        let x_float = (x as f64) / 1e18;
        
        // Clamp input to prevent overflow
        let clamped_x = if x_float > 40.0 {
            40.0
        } else if x_float < -40.0 {
            -40.0
        } else {
            x_float
        };
        
        // Calculate e^x using libm
        let result = libm::exp(clamped_x);
        
        // Convert back to fixed-point
        (result * 1e18) as i64
    }

    /// Calculate natural logarithm using libm
    /// Input and output are scaled by 10^18 for fixed-point arithmetic
    #[signature("function ln(uint256) external view returns (int256)")]
    fn ln<SDK: SharedAPI>(&self, x: u64) -> i64 {
        if x == 0 {
            return i64::MIN; // Return minimum value for ln(0)
        }
        
        // Convert from fixed-point (18 decimals) to float
        let x_float = (x as f64) / 1e18;
        
        // Calculate natural logarithm using libm
        let result = libm::log(x_float);
        
        // Convert back to fixed-point
        (result * 1e18) as i64
    }

    /// Calculate base-10 logarithm using libm
    /// Input and output are scaled by 10^18 for fixed-point arithmetic
    #[signature("function log10(uint256) external view returns (int256)")]
    fn log10<SDK: SharedAPI>(&self, x: u64) -> i64 {
        if x == 0 {
            return i64::MIN; // Return minimum value for log10(0)
        }
        
        // Convert from fixed-point (18 decimals) to float
        let x_float = (x as f64) / 1e18;
        
        // Calculate base-10 logarithm using libm
        let result = libm::log10(x_float);
        
        // Convert back to fixed-point
        (result * 1e18) as i64
    }

    /// Calculate base-2 logarithm using libm
    /// Input and output are scaled by 10^18 for fixed-point arithmetic
    #[signature("function log2(uint256) external view returns (int256)")]
    fn log2<SDK: SharedAPI>(&self, x: u64) -> i64 {
        if x == 0 {
            return i64::MIN; // Return minimum value for log2(0)
        }
        
        // Convert from fixed-point (18 decimals) to float
        let x_float = (x as f64) / 1e18;
        
        // Calculate base-2 logarithm using libm
        let result = libm::log2(x_float);
        
        // Convert back to fixed-point
        (result * 1e18) as i64
    }
}

impl ROUTER {
    fn deploy<SDK: SharedAPI>(&self) {
        // Any custom deployment logic here
    }
}

basic_entrypoint!(ROUTER);
