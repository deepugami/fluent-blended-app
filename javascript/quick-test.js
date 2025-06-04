const { ethers } = require('ethers');

async function quickTest() {
    console.log('Starting quick test...');
    
    try {
        const RPC_URL = "https://rpc.dev.gblend.xyz/";
        console.log('Connecting to:', RPC_URL);
        
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const network = await provider.getNetwork();
        console.log('Network:', network);
        
        // Test basic network connectivity
        const blockNumber = await provider.getBlockNumber();
        console.log('Latest block:', blockNumber);
        
        console.log('Basic connectivity test passed!');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

quickTest();
