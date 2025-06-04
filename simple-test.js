const { ethers } = require('ethers');

async function simpleTest() {
    console.log('🔍 Simple Test of New Rust Contract');
    
    try {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.dev.gblend.xyz/');
        const contractAddress = '0x5e44930a479f34fbc1c9657c68f5b7f761363769';
        
        console.log('Checking contract existence...');
        const code = await provider.getCode(contractAddress);
        console.log('Contract code length:', code.length);
        
        if (code === '0x') {
            console.log('❌ No contract found');
            process.exit(1);
        }
        
        console.log('✅ Contract exists!');
        
        // Test a simple sqrt function
        console.log('Testing sqrt function...');
        const abi = ["function sqrt(uint256 x) external view returns (int256)"];
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        // Test sqrt(4) which should return 2 (scaled)
        const input = ethers.utils.parseUnits('4', 18); // 4 * 10^18
        console.log('Input:', input.toString());
        
        const result = await contract.sqrt(input);
        console.log('sqrt(4) result:', result.toString());
        console.log('✅ SUCCESS! Function call worked without missing revert data error!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.reason) {
            console.error('Reason:', error.reason);
        }
        if (error.data) {
            console.error('Data:', error.data);
        }
        process.exit(1);
    }
}

// Set timeout
setTimeout(() => {
    console.log('⏰ Test timed out after 30 seconds');
    process.exit(1);
}, 30000);

simpleTest();
