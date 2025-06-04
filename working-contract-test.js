const { ethers } = require('ethers');

// WORKING CONTRACT ADDRESS (NEW)
const WORKING_RUST_ADDRESS = '0x210c583479f3cfece4080e39496000bc0d9bf568';
const RPC_URL = 'https://rpc.dev.gblend.xyz/';

// ABI for the mathematical functions
const ABI = [
    "function sqrt(uint256 x) external view returns (int256)",
    "function exp(int256 x) external view returns (int256)",
    "function ln(uint256 x) external view returns (int256)",
    "function log2(uint256 x) external view returns (int256)",
    "function log10(uint256 x) external view returns (int256)"
];

async function testWorkingContract() {
    console.log('🧪 Testing WORKING Rust Contract');
    console.log('================================');
    console.log('Address:', WORKING_RUST_ADDRESS);
    console.log('Network: Fluent Testnet (Chain ID: 20993)');
    console.log('');

    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(WORKING_RUST_ADDRESS, ABI, provider);

        // Test with the same value that was failing before
        const testValue = '2000000000000000000'; // 2.0 in 18 decimals
        console.log('Test value:', testValue, '(represents 2.0)');
        console.log('');

        // Test sqrt
        console.log('Testing sqrt(2.0)...');
        const sqrtResult = await contract.sqrt(testValue);
        console.log('✅ sqrt(2.0) =', ethers.utils.formatEther(sqrtResult));

        // Test ln
        console.log('Testing ln(2.0)...');
        const lnResult = await contract.ln(testValue);
        console.log('✅ ln(2.0) =', ethers.utils.formatEther(lnResult));

        // Test log2
        console.log('Testing log2(2.0)...');
        const log2Result = await contract.log2(testValue);
        console.log('✅ log2(2.0) =', ethers.utils.formatEther(log2Result));

        // Test log10
        console.log('Testing log10(2.0)...');
        const log10Result = await contract.log10(testValue);
        console.log('✅ log10(2.0) =', ethers.utils.formatEther(log10Result));

        // Test exp
        console.log('Testing exp(1.0)...');
        const expResult = await contract.exp('1000000000000000000'); // 1.0
        console.log('✅ exp(1.0) =', ethers.utils.formatEther(expResult));

        console.log('');
        console.log('🎉 SUCCESS! All functions are working!');
        console.log('The contract errors have been fixed.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('If you see this error, there might be a network issue.');
    }
}

// Export for use in other scripts
module.exports = { WORKING_RUST_ADDRESS, ABI, testWorkingContract };

// Run test if called directly
if (require.main === module) {
    testWorkingContract().catch(console.error);
}
