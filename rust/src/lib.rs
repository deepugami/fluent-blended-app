#![cfg_attr(target_arch = "wasm32", no_std)]
extern crate alloc;

use alloc::string::{String, ToString};
use fluentbase_sdk::{
    basic_entrypoint,
    derive::Contract,
    derive::function_id,
    SharedAPI,
    U256,    // alloy Solidity type for uint256
    I256,    // alloy Solidity type for int256
    Address, // alloy Solidity type for address
    address, // alloy Solidity marco to define values for type Address
    Bytes,   // alloy Solidity type for bytes
    B256,    // alloy Solidity type for bytes32
    b256     // alloy Solidity marco to define values for type B256
};

#[derive(Contract)]
struct PRBMATH<SDK> {
    sdk: SDK,
}

impl<SDK: SharedAPI> PRBMATH<SDK> {
    #[function_id("rustString()")]
    fn rust_string(&self) -> String {
        let string_test = "Hello".to_string();
        return string_test;
    }

    #[function_id("rustUint256()")]
    fn rust_uint256(&self) -> U256 {
        let uint256_test = U256::from(10);
        return uint256_test;
    }

    #[function_id("rustInt256()")]
    fn rust_int256(&self) -> I256 {
        let int256_test = I256::unchecked_from(-10);
        return int256_test;
    }

    #[function_id("rustAddress()")]
    fn rust_address(&self) -> Address {
        let address_test: Address = address!("d8da6bf26964af9d7eed9e03e53415d37aa96045");
        return address_test;
    }
    
    #[function_id("rustBytes()")]
    fn rust_bytes(&self) -> Bytes {
        let bytes_test = Bytes::from("FLUENT");
        return bytes_test;
    }

    #[function_id("rustBytes32()")]
    fn rust_bytes32(&self) -> B256 {
        let bytes256_test = b256!("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        return bytes256_test;
    }

    #[function_id("rustBool()")]
    fn rust_bool(&self) -> bool {
        let bool_test = true;
        return bool_test;
    }
    
    fn deploy(&self) {
        // any custom deployment logic here
    }
    
    fn main(&self) {
        // Main function required by basic_entrypoint
        let _ = self.rust_string();
    }
}

basic_entrypoint!(PRBMATH); 