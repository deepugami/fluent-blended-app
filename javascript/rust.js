const { ethers } = require("ethers");

// Contract addresses
const RUST_CONTRACT_ADDRESS = "0x87b99c706e17211f313e21f1ed98782e19e91fb2";

// Network configuration
const FLUENT_NETWORK = {
    name: 'Fluent DevNet',
    chainId: 20993,
    rpcUrl: 'https://rpc.dev.gblend.xyz/',
    blockExplorer: 'https://blockscout.dev.gblend.xyz/'
};

// Rust contract ABI (using Solidity interface)
const RUST_ABI = [
    "function rustString() external view returns (string memory)",
    "function rustUint256() external view returns (uint256)",
    "function rustInt256() external view returns (int256)",
    "function rustAddress() external view returns (address)",
    "function rustBytes() external view returns (bytes memory)",
    "function rustBytes32() external view returns (bytes32)",
    "function rustBool() external view returns (bool)"
];

async function testRustContract() {
    console.log('=== Testing Rust Contract Directly ===\n');
    
    // Setup provider
    const provider = new ethers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
    
    // Create contract instance
    const contract = new ethers.Contract(RUST_CONTRACT_ADDRESS, RUST_ABI, provider);
    
    try {
        console.log('Testing rustString()...');
        const stringResult = await contract.rustString();
        console.log(`✅ String result: "${stringResult}"`);
        
        console.log('\nTesting rustUint256()...');
        const uint256Result = await contract.rustUint256();
        console.log(`✅ Uint256 result: ${uint256Result.toString()}`);
        
        console.log('\nTesting rustInt256()...');
        const int256Result = await contract.rustInt256();
        console.log(`✅ Int256 result: ${int256Result.toString()}`);
        
        console.log('\nTesting rustAddress()...');
        const addressResult = await contract.rustAddress();
        console.log(`✅ Address result: ${addressResult}`);
        
        console.log('\nTesting rustBytes()...');
        const bytesResult = await contract.rustBytes();
        console.log(`✅ Bytes result: ${bytesResult}`);
        
        console.log('\nTesting rustBytes32()...');
        const bytes32Result = await contract.rustBytes32();
        console.log(`✅ Bytes32 result: ${bytes32Result}`);
        
        console.log('\nTesting rustBool()...');
        const boolResult = await contract.rustBool();
        console.log(`✅ Bool result: ${boolResult}`);
        
        console.log('\n🎉 All direct Rust function calls successful!');
        
    } catch (error) {
        console.error('❌ Error calling Rust contract:', error.message);
        if (error.data) {
            console.error('Error data:', error.data);
        }
    }
}

// Run the test
testRustContract().catch(console.error); 