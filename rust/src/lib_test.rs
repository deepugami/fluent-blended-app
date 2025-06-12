#![cfg_attr(target_arch = "wasm32", no_std)]

use fluentbase_sdk::{
    basic_entrypoint,
    derive::{function_id, router, signature},
    SharedAPI,
};

#[derive(router)]
pub enum Router {
    #[signature("function testFunction(uint256) external view returns (uint256)")]
    TestFunction,
}

impl Router {
    pub fn handle(&self) -> i64 {
        match self {
            Router::TestFunction => {
                let input = SharedAPI::input_u256();
                let output = input * 2; // Simple doubling function
                SharedAPI::write(&output.to_le_bytes());
                0
            }
        }
    }
}

basic_entrypoint!(Router);
