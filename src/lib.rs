#![cfg_attr(target_arch = "wasm32", no_std)]

extern crate fluentbase_sdk;

use fluentbase_sdk::{basic_entrypoint, derive::Contract, SharedAPI};

#[derive(Contract)]
struct GREETING<SDK> {
    sdk: SDK,
}

impl<SDK: SharedAPI> GREETING<SDK> {
    fn deploy(&mut self) {
        // Add any custom deployment logic here
    }

    fn main(&mut self) {
        self.sdk.write("Hello, World".as_bytes());
    }
}

basic_entrypoint!(GREETING); 