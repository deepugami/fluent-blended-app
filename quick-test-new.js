const { ethers } = require('ethers');

async function quickTest() {
    console.log('🔍 Quick Test of New Contract');
    
    try {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.dev.gblend.xyz/');
        const contractAddress = '0x5e44930a479f34fbc1c9657c68f5b7f761363769';
        
        // Check if contract exists
        const code = await provider.getCode(contractAddress);
        console.log('Contract code length:', code.length);
        
        if (code === '0x') {
            console.log('❌ No contract found');
            return;
        }
        
        console.log('✅ Contract exists!');
        
        // Simple function call
        const abi = ["function sqrt(uint256 x) external view returns (int256)"];
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        console.log('Testing sqrt(4)...');
        const result = await contract.sqrt('4000000000000000000');
        console.log('Result:', result.toString());
        console.log('✅ SUCCESS! No missing revert data error!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

quickTest();
