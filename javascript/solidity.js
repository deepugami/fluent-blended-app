const { ethers } = require('ethers');

// Contract addresses
const RUST_CONTRACT_ADDRESS = '0x447cc72447d69cf9e0622756ff447725a8ee5fa6';
const SOLIDITY_CONTRACT_ADDRESS = '0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f';

// RPC URL
const RPC_URL = 'https://rpc.dev.gblend.xyz/';

// Private key (replace with your own)
const PRIVATE_KEY = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';

// ABI for the Solidity contract
const SOLIDITY_ABI = [
    "function sqrt(uint256 x) external view returns (int256)",
    "function exp(int256 x) external view returns (int256)",
    "function ln(uint256 x) external view returns (int256)",
    "function log2(uint256 x) external view returns (int256)",
    "function log10(uint256 x) external view returns (int256)",
    "function prbMathRust() external view returns (address)"
];

async function testSolidityContract() {
    console.log('🧮 Testing Solidity Contract (calling Rust contract)...\n');
    
    try {
        // Setup provider and wallet
        console.log('Setting up provider...');
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        console.log('Setting up wallet...');
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        // Connect to the Solidity contract
        const contract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, SOLIDITY_ABI, wallet);
        
        console.log('📋 Contract Details:');
        console.log(`Solidity Contract: ${SOLIDITY_CONTRACT_ADDRESS}`);
        
        // Get the Rust contract address from Solidity contract
        const rustAddress = await contract.prbMathRust();
        console.log(`Rust Contract: ${rustAddress}`);
        console.log('');
        
        // Test mathematical functions
        console.log('🔢 Testing Mathematical Functions:\n');
        
        // Test sqrt
        const sqrtInput = 16n;
        const sqrtResult = await contract.sqrt(sqrtInput);
        console.log(`sqrt(${sqrtInput}) = ${sqrtResult}`);
        
        // Test exp (small value to avoid overflow)
        const expInput = 2n;
        const expResult = await contract.exp(expInput);
        console.log(`exp(${expInput}) = ${expResult}`);
        
        // Test ln
        const lnInput = 100n;
        const lnResult = await contract.ln(lnInput);
        console.log(`ln(${lnInput}) = ${lnResult}`);
        
        // Test log2
        const log2Input = 8n;
        const log2Result = await contract.log2(log2Input);
        console.log(`log2(${log2Input}) = ${log2Result}`);
        
        // Test log10
        const log10Input = 1000n;
        const log10Result = await contract.log10(log10Input);
        console.log(`log10(${log10Input}) = ${log10Result}`);
        
        console.log('\n✅ All Solidity contract tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Error testing Solidity contract:', error.message);
    }
}

// Run the test
testSolidityContract();
