const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://rpc.dev.gblend.xyz/';
const PRIVATE_KEY = '0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed';
const SOLIDITY_CONTRACT_ADDRESS = '0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f';

// Test the specific function that was failing
const ABI = [
    "function sqrt(uint256 x) external view returns (int256)",
    "function prbMathRust() external view returns (address)"
];

async function testFix() {
    console.log('🧪 Testing the fix for "missing revert data" error...\n');
    
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        const contract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, ABI, provider);
        
        console.log('📍 Contract address:', SOLIDITY_CONTRACT_ADDRESS);
        
        // Check what Rust contract it points to
        const rustAddress = await contract.prbMathRust();
        console.log('📍 Rust contract address:', rustAddress);
        
        // Test the exact call that was failing: sqrt(1)
        console.log('\n🔄 Testing sqrt(1)...');
        const testInput = '1'; // The exact input from the error: 0x677342ce0000000000000000000000000000000000000000000000000000000000000001
        
        const result = await contract.sqrt(testInput);
        console.log('✅ SUCCESS! sqrt(1) =', result.toString());
        
        // Test with properly formatted input
        console.log('\n🔄 Testing sqrt(4.0) with proper decimals...');
        const testInput2 = ethers.utils.parseEther('4'); // 4.0 with 18 decimals
        
        const result2 = await contract.sqrt(testInput2);
        const formatted = ethers.utils.formatEther(result2.toString());
        console.log('✅ SUCCESS! sqrt(4.0) =', formatted, '(expected ~2.0)');
        
        console.log('\n🎉 ALL TESTS PASSED! The "missing revert data" error has been fixed!');
        
    } catch (error) {
        console.error('❌ Error still exists:', error.message);
        if (error.data) {
            console.error('Error data:', error.data);
        }
    }
}

testFix();
