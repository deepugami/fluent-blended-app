# Fluent Blended App Debug Information

This document provides comprehensive information about our deployed Fluent Blended App (Rust + Solidity) and the issues we're facing with contract interactions.

## Environment

- **OS**: Windows 10
- **Rust Version**: rustc 1.87.0 (17067e9ac 2025-05-09)
- **Node.js Version**: v22.15.0  
- **Foundry Version**: forge 1.1.0-stable (d484a00089 2025-04-30T13:50:32.958322000Z)
- **gblend Version**: gblend 0.2.11

## Contract Addresses

- **Rust Contract**: `0x87b99c706e17211f313e21f1ed98782e19e91fb2`
- **Solidity Contract**: `0xAFc63F12b732701526f48E8256Ad35c888336E54`

## SDK Version

We updated the SDK as per Devnet Regenesis instructions:
```toml
fluentbase-sdk = { git = "https://github.com/fluentlabs-xyz/fluentbase", tag = "v0.1.0-dev", default-features = false }
```

## Issue Description

Both contracts are successfully deployed on the Fluent Devnet (as confirmed by checking their code length), but when trying to call functions on the Solidity contract that interact with the Rust contract, we get execution reverts.

## Code Verification

We've verified both contracts have code deployed on-chain:
- Rust Contract: 14398 bytes
- Solidity Contract: 3424 bytes

## Error Message

When calling `getRustString()`, we receive this error:

```
Error: missing revert data in call exception; Transaction reverted without a reason string
(data="0x", transaction={"from":"0xA774BF3D9085596ebDeA6d9a93763b78cF9686f2","to":"0xAFc63F12b732701526f48E8256Ad35c888336E54","data":"0xb932773c","accessList":null}, error={"reason":"processing response error","code":"SERVER_ERROR","body":"{\"jsonrpc\":\"2.0\",\"id\":44,\"error\":{\"code\":3,\"message\":\"execution reverted\"}}","error":{"code":3},"requestBody":"{\"method\":\"eth_call\",\"params\":[{\"from\":\"0xa774bf3d9085596ebdea6d9a93763b78cf9686f2\",\"to\":\"0xafc63f12b732701526f48e8256ad35c888336e54\",\"data\":\"0xb932773c\"},\"latest\"],\"id\":44,\"jsonrpc\":\"2.0\"}","requestMethod":"POST","url":"https://rpc.dev.gblend.xyz/"}, code=CALL_EXCEPTION, version=providers/5.7.2)
```

## Contract Source Code

### Rust Contract (rust/src/lib.rs)

```rust
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
```

### Solidity Contract (solidity/FluentSdkRustTypesTest.sol)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IFluentRust {
    // Make sure type interfaces are defined here or else there will be a compiler error.
    function rustString() external view returns (string memory);
    function rustUint256() external view returns (uint256);    
    function rustInt256() external view returns (int256);
    function rustAddress() external view returns (address);
    function rustBytes() external view returns (bytes memory);
    function rustBytes32() external view returns (bytes32);
    function rustBool() external view returns (bool);
}

contract FluentSdkRustTypesTest {
    
    IFluentRust public fluentRust;

    constructor(address FluentRustAddress) {
        fluentRust = IFluentRust(FluentRustAddress);
    }

    function getRustString() external view returns (string memory) {
        string memory rustString = fluentRust.rustString();
        return string(abi.encodePacked(rustString, " World"));
    }

    function getRustUint256() external view returns (uint256) {
        uint256 rustUint256 = fluentRust.rustUint256();
        return rustUint256;
    }

    function getRustInt256() external view returns (int256) {
        int256 rustInt256 = fluentRust.rustInt256();
        return rustInt256;
    }

    function getRustAddress() external view returns (address) {
        address rustAddress = fluentRust.rustAddress();
        return rustAddress;
    }

    function getRustBytes() external view returns (bytes memory) {
        bytes memory rustBytes = fluentRust.rustBytes();
        return rustBytes;
    }

    function getRustBytes32() external view returns (bytes32) {
        bytes32 rustBytes32 = fluentRust.rustBytes32();
        return rustBytes32;
    }

    function getRustBool() external view returns (bool) {
        bool rustBool = fluentRust.rustBool();
        return rustBool;
    }
}
```

## Deployment Process

1. Updated the Fluent SDK version to `v0.1.0-dev` as specified in the Devnet Regenesis announcement.

2. Built the Rust contract:
   ```bash
   cd rust
   gblend build rust -r
   ```

3. Deployed the Rust contract:
   ```bash
   gblend deploy --private-key [REDACTED] --dev lib.wasm --gas-limit 3000000
   ```

4. Updated the constructor arguments file with the Rust contract address.

5. Deployed the Solidity contract:
   ```bash
   forge create src/FluentSdkRustTypesTest.sol:FluentSdkRustTypesTest --constructor-args-path constructor-args.txt --private-key [REDACTED] --rpc-url https://rpc.dev.gblend.xyz/ --broadcast
   ```

6. Attempted to call functions using ethers.js:
   ```javascript
   const contract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, ABI, wallet);
   const rustString = await contract.getRustString();
   ```

## Questions for the Fluent Team

1. Is there a specific format requirement for function IDs in the Rust contract when using the v0.1.0-dev SDK?

2. Are there any known issues with the new SDK version that could cause function call failures?

3. Is there a recommended way to debug cross-language contract calls on the Fluent Devnet?

4. Do you have any sample repositories showing working Rust-Solidity integration with the v0.1.0-dev SDK?

5. Are there any specific configurations or patterns we should follow when deploying blended contracts?

Thank you for your assistance! 