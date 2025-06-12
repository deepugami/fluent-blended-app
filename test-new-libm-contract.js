const { ethers } = require('ethers');

async function testNewLibmContract() {
    try {
        console.log('🧪 Testing the new libm contract...');
        
        // Configuration
        const RPC_URL = 'https://rpc.dev.gblend.xyz/';
        const CONTRACT_ADDRESS = '0x017b333704183aE7D79f66643589b2dE19e984ed';
        const PRIVATE_KEY = '0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed';
        
        // Setup provider and wallet (ethers v5)
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log('📝 Tester address:', wallet.address);
        console.log('📍 Contract address:', CONTRACT_ADDRESS);
        
        // Try different ABI configurations
        const abiVariants = [
            // Original ABI
            [
                "function sqrt(uint256 x) external view returns (int256)",
                "function exp(int256 x) external view returns (int256)", 
                "function ln(uint256 x) external view returns (int256)",
                "function log2(uint256 x) external view returns (int256)",
                "function log10(uint256 x) external view returns (int256)"
            ],
            // Try with different parameter types
            [
                "function sqrt(uint256) external view returns (int256)",
                "function exp(uint256) external view returns (int256)",
                "function ln(uint256) external view returns (int256)", 
                "function log2(uint256) external view returns (int256)",
                "function log10(uint256) external view returns (int256)"
            ]
        ];
        
        for (let i = 0; i < abiVariants.length; i++) {
            console.log(`\n🔍 Trying ABI variant ${i + 1}...`);
            
            try {
                const contract = new ethers.Contract(CONTRACT_ADDRESS, abiVariants[i], wallet);
                
                // Test with 4.0 (4000000000000000000 in 18 decimals)
                const testValue = ethers.utils.parseEther('4');
                console.log(`📊 Testing with input: ${testValue} (4.0)`);
                
                // Try sqrt first (usually the simplest)
                console.log('Testing sqrt(4)...');
                const sqrtResult = await contract.sqrt(testValue);
                const sqrtDecimal = Number(sqrtResult) / 1e18;
                console.log(`✅ sqrt(4) = ${sqrtResult} (${sqrtDecimal.toFixed(6)})`);
                console.log(`Expected: 2.0`);
                
                // If sqrt works, try the others
                console.log('Testing exp(4)...');
                const expResult = await contract.exp(testValue);
                const expDecimal = Number(expResult) / 1e18;
                console.log(`✅ exp(4) = ${expResult} (${expDecimal.toFixed(6)})`);
                console.log(`Expected: ~54.598150`);
                
                console.log('Testing ln(4)...');
                const lnResult = await contract.ln(testValue);
                const lnDecimal = Number(lnResult) / 1e18;
                console.log(`✅ ln(4) = ${lnResult} (${lnDecimal.toFixed(6)})`);
                console.log(`Expected: ~1.386294`);
                
                console.log('Testing log2(4)...');
                const log2Result = await contract.log2(testValue);
                const log2Decimal = Number(log2Result) / 1e18;
                console.log(`✅ log2(4) = ${log2Result} (${log2Decimal.toFixed(6)})`);
                console.log(`Expected: 2.0`);
                
                console.log('Testing log10(4)...');
                const log10Result = await contract.log10(testValue);
                const log10Decimal = Number(log10Result) / 1e18;
                console.log(`✅ log10(4) = ${log10Result} (${log10Decimal.toFixed(6)})`);
                console.log(`Expected: ~0.602060`);
                
                console.log(`\n🎉 ABI variant ${i + 1} works!`);
                break;
                
            } catch (error) {
                console.log(`❌ ABI variant ${i + 1} failed:`, error.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the test
testNewLibmContract();
