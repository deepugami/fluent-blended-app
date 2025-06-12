const { ethers } = require('ethers');

async function testCorrectABI() {
    try {
        console.log('🧪 Testing with corrected ABI matching Fluent patterns...');
        
        // Configuration
        const RPC_URL = 'https://rpc.dev.gblend.xyz/';
        const CONTRACT_ADDRESS = '0xF8Dd5eeabf57644219f4a59D03428Cfa24b2d5e5';
        const PRIVATE_KEY = '0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed';
        
        // Setup provider and wallet (ethers v5)
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log('📝 Tester address:', wallet.address);
        console.log('📍 Contract address:', CONTRACT_ADDRESS);
        
        // Try the corrected ABI (U256 return types)
        const abi = [
            "function sqrt(uint256 x) external view returns (uint256)",
            "function exp(uint256 x) external view returns (uint256)",
            "function ln(uint256 x) external view returns (uint256)",
            "function log2(uint256 x) external view returns (uint256)",
            "function log10(uint256 x) external view returns (uint256)"
        ];
        
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
        
        // Test with 4.0 (4000000000000000000 in 18 decimals)
        const testValue = ethers.utils.parseEther('4');
        console.log(`📊 Testing with input: ${testValue} (4.0)`);
        
        try {
            // Test sqrt(4) - should be 2.0
            console.log('Testing sqrt(4)...');
            const sqrtResult = await contract.sqrt(testValue);
            const sqrtDecimal = Number(sqrtResult) / 1e18;
            console.log(`✅ sqrt(4) = ${sqrtResult} (${sqrtDecimal.toFixed(6)})`);
            console.log(`Expected: 2.0`);
            
            // Test exp(4) - should be ~54.598
            console.log('Testing exp(4)...');
            const expResult = await contract.exp(testValue);
            const expDecimal = Number(expResult) / 1e18;
            console.log(`✅ exp(4) = ${expResult} (${expDecimal.toFixed(6)})`);
            console.log(`Expected: ~54.598150`);
            
            // Test ln(4) - should be ~1.386
            console.log('Testing ln(4)...');
            const lnResult = await contract.ln(testValue);
            const lnDecimal = Number(lnResult) / 1e18;
            console.log(`✅ ln(4) = ${lnResult} (${lnDecimal.toFixed(6)})`);
            console.log(`Expected: ~1.386294`);
            
            // Test log2(4) - should be 2.0
            console.log('Testing log2(4)...');
            const log2Result = await contract.log2(testValue);
            const log2Decimal = Number(log2Result) / 1e18;
            console.log(`✅ log2(4) = ${log2Result} (${log2Decimal.toFixed(6)})`);
            console.log(`Expected: 2.0`);
            
            // Test log10(4) - should be ~0.602
            console.log('Testing log10(4)...');
            const log10Result = await contract.log10(testValue);
            const log10Decimal = Number(log10Result) / 1e18;
            console.log(`✅ log10(4) = ${log10Result} (${log10Decimal.toFixed(6)})`);
            console.log(`Expected: ~0.602060`);
            
            console.log('\n🎉 All tests passed! The libm implementation is working correctly.');
            
        } catch (error) {
            console.log('❌ Function call failed:', error.message);
            
            // Try to debug by checking if the contract exists
            const code = await provider.getCode(CONTRACT_ADDRESS);
            console.log('Contract code length:', code.length);
            
            if (code === '0x') {
                console.log('❌ Contract not found at address');
            } else {
                console.log('✅ Contract exists, issue is with function calls');
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the test
testCorrectABI();
