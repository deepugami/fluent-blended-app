#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;
extern crate libm;

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{function_id, router, signature},
    SharedAPI,
};

#[derive(router)]
pub enum Router {
    #[signature("function sqrt(uint256) external view returns (int256)")]
    Sqrt,
    #[signature("function exp(uint256) external view returns (int256)")]
    Exp,
    #[signature("function ln(uint256) external view returns (int256)")]
    Ln,
    #[signature("function log2(uint256) external view returns (int256)")]
    Log2,
    #[signature("function log10(uint256) external view returns (int256)")]
    Log10,
}

impl Router {
    pub fn handle(&self) -> i64 {
        match self {
            Router::Sqrt => {
                let input = SharedAPI::input_u256();
                let x = input as f64 / 1e18; // Convert from wei to float
                let result = libm::sqrt(x);
                let output = (result * 1e18) as i64; // Convert back to wei
                SharedAPI::write(&output.to_le_bytes());
                0
            }
            Router::Exp => {
                let input = SharedAPI::input_u256();
                let x = input as f64 / 1e18;
                let result = libm::exp(x);
                let output = (result * 1e18) as i64;
                SharedAPI::write(&output.to_le_bytes());
                0
            }
            Router::Ln => {
                let input = SharedAPI::input_u256();
                let x = input as f64 / 1e18;
                let result = libm::ln(x);
                let output = (result * 1e18) as i64;
                SharedAPI::write(&output.to_le_bytes());
                0
            }
            Router::Log2 => {
                let input = SharedAPI::input_u256();
                let x = input as f64 / 1e18;
                let result = libm::log2(x);
                let output = (result * 1e18) as i64;
                SharedAPI::write(&output.to_le_bytes());
                0
            }
            Router::Log10 => {
                let input = SharedAPI::input_u256();
                let x = input as f64 / 1e18;
                let result = libm::log10(x);
                let output = (result * 1e18) as i64;
                SharedAPI::write(&output.to_le_bytes());
                0
            }
        }
    }
}

basic_entrypoint!(Router);
