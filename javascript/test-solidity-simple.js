const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.dev.gblend.xyz/';
const SOLIDITY_CONTRACT_ADDRESS = '0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f';

// Solidity contract ABI
const SOLIDITY_ABI = [
    "function sqrt(uint256 x) view returns (int256)",
    "function exp(int256 x) view returns (int256)", 
    "function ln(uint256 x) view returns (int256)",
    "function log2(uint256 x) view returns (int256)",
    "function log10(uint256 x) view returns (int256)",
    "function prbMathRust() view returns (address)"
];

async function testSolidityContract() {
    console.log('🔧 Testing Solidity Interface Contract...');
    
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, SOLIDITY_ABI, provider);
        
        // First check what Rust address it's pointing to
        console.log('📍 Checking Rust contract address...');
        const rustAddress = await contract.prbMathRust();
        console.log(`Rust contract address: ${rustAddress}`);
        
        // Test value: 2.0 in 18 decimal places
        const testValue = '2000000000000000000';
        console.log(`\n🧮 Testing mathematical functions with input: ${testValue} (2.0)`);
        
        // Test sqrt
        console.log('\n📐 Testing sqrt...');
        try {
            const sqrtResult = await contract.sqrt(testValue);
            const formatted = ethers.formatEther(sqrtResult.toString());
            console.log(`✅ sqrt(2.0) = ${sqrtResult.toString()} (${formatted})`);
        } catch (error) {
            console.log(`❌ sqrt failed: ${error.shortMessage || error.message}`);
        }
        
        // Test ln  
        console.log('\n📊 Testing ln...');
        try {
            const lnResult = await contract.ln(testValue);
            const formatted = ethers.formatEther(lnResult.toString());
            console.log(`✅ ln(2.0) = ${lnResult.toString()} (${formatted})`);
        } catch (error) {
            console.log(`❌ ln failed: ${error.shortMessage || error.message}`);
        }
        
        // Test log2
        console.log('\n📈 Testing log2...');
        try {
            const log2Result = await contract.log2(testValue);
            const formatted = ethers.formatEther(log2Result.toString());
            console.log(`✅ log2(2.0) = ${log2Result.toString()} (${formatted})`);
        } catch (error) {
            console.log(`❌ log2 failed: ${error.shortMessage || error.message}`);
        }
        
        // Test log10
        console.log('\n📉 Testing log10...');
        try {
            const log10Result = await contract.log10(testValue);
            const formatted = ethers.formatEther(log10Result.toString());
            console.log(`✅ log10(2.0) = ${log10Result.toString()} (${formatted})`);
        } catch (error) {
            console.log(`❌ log10 failed: ${error.shortMessage || error.message}`);
        }
        
        // Test exp (this takes int256, so it can handle negative numbers)
        console.log('\n📊 Testing exp...');
        try {
            const expResult = await contract.exp(testValue);
            const formatted = ethers.formatEther(expResult.toString());
            console.log(`✅ exp(2.0) = ${expResult.toString()} (${formatted})`);
        } catch (error) {
            console.log(`❌ exp failed: ${error.shortMessage || error.message}`);
        }
        
        console.log('\n🎉 Testing completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testSolidityContract();
