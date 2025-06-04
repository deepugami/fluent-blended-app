// Simple debug script to test Solidity interface
const { ethers } = require('ethers');

async function debugSolidityInterface() {
    try {
        console.log('🔍 Debugging Solidity Interface...');
        
        const RPC_URL = 'https://rpc.dev.gblend.xyz/';
        const SOLIDITY_ADDRESS = '0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f';
        
        // Simple ABI for testing
        const SIMPLE_ABI = [
            "function sqrt(uint256 x) view returns (int256)",
            "function prbMathRust() view returns (address)"
        ];
        
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(SOLIDITY_ADDRESS, SIMPLE_ABI, provider);
        
        // Check network
        const network = await provider.getNetwork();
        console.log(`✅ Connected to chain ID: ${network.chainId}`);
        
        // Check what Rust address the Solidity contract points to
        console.log('📍 Checking Rust contract address...');
        const rustAddress = await contract.prbMathRust();
        console.log(`Rust contract address: ${rustAddress}`);
        
        // Try a simple sqrt calculation
        console.log('🧮 Testing sqrt(4.0)...');
        const input = '4000000000000000000'; // 4.0 in 18 decimals
        const result = await contract.sqrt(input);
        
        console.log(`Raw result: ${result.toString()}`);
        const formatted = ethers.formatEther(result.toString());
        console.log(`Formatted result: ${formatted}`);
        console.log(`Expected: ~2.0`);
        
        console.log('✅ Basic test completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.data) {
            console.error('Error data:', error.data);
        }
    }
}

// Run the debug
debugSolidityInterface();
