const { ethers } = require('ethers');

async function debugContractCalls() {
    console.log('🔍 Debugging Contract Calls...\n');
    
    try {
        // Setup provider
        const provider = new ethers.providers.JsonRpcProvider("https://rpc.dev.gblend.xyz/");
        const network = await provider.getNetwork();
        console.log(`✅ Connected to network: Chain ID ${network.chainId}`);
        
        // Contract addresses
        const RUST_ADDRESS = "0x447cc72447d69cf9e0622756ff447725a8ee5fa6";
        const SOLIDITY_ADDRESS = "0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f";
        
        // Check contract existence
        const rustCode = await provider.getCode(RUST_ADDRESS);
        const solidityCode = await provider.getCode(SOLIDITY_ADDRESS);
        
        console.log(`📋 Rust contract code length: ${rustCode.length} characters`);
        console.log(`📋 Solidity contract code length: ${solidityCode.length} characters`);
        
        if (rustCode === '0x') {
            console.log('❌ No Rust contract found');
            return;
        }
        
        if (solidityCode === '0x') {
            console.log('❌ No Solidity contract found');
            return;
        }
        
        // Try simple contract call with minimal ABI
        console.log('\n🧪 Testing with minimal ABI...');
        
        // Minimal Rust contract ABI - just sqrt function
        const minimalRustABI = [
            "function sqrt(uint256) view returns (int256)"
        ];
        
        const rustContract = new ethers.Contract(RUST_ADDRESS, minimalRustABI, provider);
        
        // Test with a simple value: 1.0 (1 * 10^18)
        const testValue = ethers.utils.parseEther("1.0");
        console.log(`📥 Testing sqrt with input: ${testValue.toString()} (1.0)`);
        
        try {
            const result = await rustContract.sqrt(testValue);
            console.log(`✅ sqrt result: ${result.toString()}`);
            console.log(`✅ Formatted: ${ethers.utils.formatEther(result)} (should be ~1.0)`);
        } catch (error) {
            console.log(`❌ Direct Rust call failed: ${error.message}`);
            
            // Try different value formats
            console.log('\n🔄 Trying different input formats...');
            
            const testValues = [
                { name: "4 * 10^18", value: "4000000000000000000" },
                { name: "1 * 10^18", value: "1000000000000000000" },
                { name: "100", value: "100" },
                { name: "4", value: "4" }
            ];
            
            for (const test of testValues) {
                try {
                    console.log(`Testing ${test.name}: ${test.value}`);
                    const result = await rustContract.sqrt(test.value);
                    console.log(`✅ Success: ${result.toString()}`);
                    break;
                } catch (err) {
                    console.log(`❌ Failed: ${err.message.substring(0, 100)}...`);
                }
            }
        }
        
        // Test Solidity contract
        console.log('\n🧪 Testing Solidity contract...');
        const minimalSolidityABI = [
            "function sqrt(uint256) view returns (int256)"
        ];
        
        const solidityContract = new ethers.Contract(SOLIDITY_ADDRESS, minimalSolidityABI, provider);
        
        try {
            const result = await solidityContract.sqrt(testValue);
            console.log(`✅ Solidity sqrt result: ${result.toString()}`);
        } catch (error) {
            console.log(`❌ Solidity call failed: ${error.message}`);
        }
        
    } catch (error) {
        console.error(`❌ Debug failed: ${error.message}`);
    }
}

debugContractCalls();
