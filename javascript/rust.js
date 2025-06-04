const { ethers } = require('ethers');

// Contract addresses
const RUST_CONTRACT_ADDRESS = '0x447cc72447d69cf9e0622756ff447725a8ee5fa6';

// RPC URL
const RPC_URL = 'https://rpc.dev.gblend.xyz/';

// Private key (replace with your own)
const PRIVATE_KEY = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';

// ABI for the Rust contract (same interface as Solidity)
const RUST_ABI = [
    "function sqrt(uint256 x) external view returns (int256)",
    "function exp(int256 x) external view returns (int256)",
    "function ln(uint256 x) external view returns (int256)",
    "function log2(uint256 x) external view returns (int256)",
    "function log10(uint256 x) external view returns (int256)"
];

async function testRustContract() {
    console.log('🦀 Testing Rust Contract (direct calls)...\n');
    
    try {
        // Setup provider and wallet
        console.log('Setting up provider...');
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        console.log('Setting up wallet...');
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        // Connect to the Rust contract
        const contract = new ethers.Contract(RUST_CONTRACT_ADDRESS, RUST_ABI, wallet);
        
        console.log('📋 Contract Details:');
        console.log(`Rust Contract: ${RUST_CONTRACT_ADDRESS}`);
        console.log('');
        
        // Test mathematical functions
        console.log('🔢 Testing Mathematical Functions (Direct Rust Calls):\n');
        
        // Test sqrt
        const sqrtInput = 25n;
        const sqrtResult = await contract.sqrt(sqrtInput);
        console.log(`sqrt(${sqrtInput}) = ${sqrtResult}`);
        
        // Test exp (small value to avoid overflow)
        const expInput = 1n;
        const expResult = await contract.exp(expInput);
        console.log(`exp(${expInput}) = ${expResult}`);
        
        // Test ln
        const lnInput = 1000n;
        const lnResult = await contract.ln(lnInput);
        console.log(`ln(${lnInput}) = ${lnResult}`);
        
        // Test log2
        const log2Input = 16n;
        const log2Result = await contract.log2(log2Input);
        console.log(`log2(${log2Input}) = ${log2Result}`);
        
        // Test log10
        const log10Input = 10000n;
        const log10Result = await contract.log10(log10Input);
        console.log(`log10(${log10Input}) = ${log10Result}`);
        
        console.log('\n✅ All Rust contract tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Error testing Rust contract:', error.message);
    }
}

// Run the test
testRustContract();
