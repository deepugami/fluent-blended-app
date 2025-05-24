const { ethers } = require("ethers");

// Configuration
const FLUENT_NETWORK = {
    name: 'Fluent DevNet',
    chainId: 20993,
    rpcUrl: 'https://rpc.dev.gblend.xyz/',
    blockExplorer: 'https://blockscout.dev.gblend.xyz/'
};

// Contract addresses
const RUST_CONTRACT_ADDRESS = "0x87b99c706e17211f313e21f1ed98782e19e91fb2";
const SOLIDITY_CONTRACT_ADDRESS = "0xafc63f12b732701526f48e8256ad35c888336e54";

// Rust contract ABI (simple interface)
const RUST_ABI = [
    "function sqrt(uint256) external view returns (uint256)",
    "function exp(int256) external view returns (int256)",
    "function ln(uint256) external view returns (int256)",
    "function log10(uint256) external view returns (int256)",
    "function log2(uint256) external view returns (int256)"
];

// Solidity contract ABI (simplified)
const SOLIDITY_ABI = [
    "function sqrtSolidity(uint256 x) external pure returns (uint256)",
    "function sqrtRust(uint256 x) external view returns (uint256)",
    "function rustContract() external view returns (address)",
    "function toFixed(uint256 x) external pure returns (uint256)",
    "function sqrtComparison(uint256 x) external returns (uint256 solidityResult, uint256 rustResult)"
];

async function verifyDeployment() {
    console.log('🔍 Verifying Fluent Blended Math Challenge Deployment');
    console.log('=' .repeat(60));
    
    try {
        // Setup provider (compatible with both ethers v5 and v6)
        let provider;
        if (ethers.providers && ethers.providers.JsonRpcProvider) {
            // Ethers v5
            provider = new ethers.providers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
        } else if (ethers.JsonRpcProvider) {
            // Ethers v6
            provider = new ethers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
        } else {
            // Fallback
            provider = new ethers.getDefaultProvider(FLUENT_NETWORK.rpcUrl);
        }
        
        // Test network connection
        console.log('📡 Testing network connection...');
        const blockNumber = await provider.getBlockNumber();
        console.log(`✅ Connected to ${FLUENT_NETWORK.name}, block: ${blockNumber}`);
        
        // Verify Rust contract
        console.log('\n🦀 Verifying Rust Contract...');
        const rustContract = new ethers.Contract(RUST_CONTRACT_ADDRESS, RUST_ABI, provider);
        
        try {
            // Test a simple function call
            const testValue = ethers.utils ? 
                ethers.utils.parseUnits("4.0", 18) : 
                ethers.parseUnits("4.0", 18); // Handle both v5 and v6
            
            const sqrtResult = await rustContract.sqrt(testValue);
            
            const sqrtFloat = ethers.utils ? 
                parseFloat(ethers.utils.formatUnits(sqrtResult, 18)) :
                parseFloat(ethers.formatUnits(sqrtResult, 18));
                
            console.log(`✅ Rust sqrt(4.0) = ${sqrtFloat.toFixed(6)} (expected: ~2.0)`);
        } catch (error) {
            console.log(`❌ Rust contract call failed: ${error.message}`);
        }
        
        // Verify Solidity contract
        console.log('\n💎 Verifying Solidity Contract...');
        const solidityContract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, SOLIDITY_ABI, provider);
        
        try {
            // Test Solidity function
            const testValue = ethers.utils ? 
                ethers.utils.parseUnits("4.0", 18) : 
                ethers.parseUnits("4.0", 18);
                
            const soliditySqrt = await solidityContract.sqrtSolidity(testValue);
            
            const soliditySqrtFloat = ethers.utils ? 
                parseFloat(ethers.utils.formatUnits(soliditySqrt, 18)) :
                parseFloat(ethers.formatUnits(soliditySqrt, 18));
                
            console.log(`✅ Solidity sqrt(4.0) = ${soliditySqrtFloat.toFixed(6)} (expected: ~2.0)`);
            
            // Test Rust integration
            const rustSqrt = await solidityContract.sqrtRust(testValue);
            
            const rustSqrtFloat = ethers.utils ? 
                parseFloat(ethers.utils.formatUnits(rustSqrt, 18)) :
                parseFloat(ethers.formatUnits(rustSqrt, 18));
                
            console.log(`✅ Solidity->Rust sqrt(4.0) = ${rustSqrtFloat.toFixed(6)} (expected: ~2.0)`);
            
            // Calculate difference
            const difference = Math.abs(soliditySqrtFloat - rustSqrtFloat);
            console.log(`📊 Difference: ${difference.toExponential(4)}`);
            
        } catch (error) {
            console.log(`❌ Solidity contract call failed: ${error.message}`);
        }
        
        // Contract information
        console.log('\n📋 Contract Information:');
        console.log(`🦀 Rust Contract: ${RUST_CONTRACT_ADDRESS}`);
        console.log(`   Explorer: ${FLUENT_NETWORK.blockExplorer}/address/${RUST_CONTRACT_ADDRESS}`);
        console.log(`💎 Solidity Contract: ${SOLIDITY_CONTRACT_ADDRESS}`);
        console.log(`   Explorer: ${FLUENT_NETWORK.blockExplorer}/address/${SOLIDITY_CONTRACT_ADDRESS}`);
        
        console.log('\n🎉 Verification Complete!');
        console.log('📱 Frontend: Open prb-math-blended/frontend/index.html');
        console.log('🧮 The blended execution is ready for testing!');
        
    } catch (error) {
        console.error('\n❌ Verification failed:', error);
    }
}

// Run verification
verifyDeployment().catch(console.error); 