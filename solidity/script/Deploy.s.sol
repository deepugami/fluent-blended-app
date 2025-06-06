// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/prbMathBlended.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        
        // Deploy the contract with the Rust contract address
        address rustContractAddress = 0x5e44930A479f34fBC1C9657C68F5B7F761363769;
        prbMathBlended mathContract = new prbMathBlended(rustContractAddress);
        
        console.log("prbMathBlended deployed to:", address(mathContract));
        
        vm.stopBroadcast();
    }
}
