const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.dev.gblend.xyz/';
const RUST_CONTRACT_ADDRESS = '0x447cc72447d69cf9e0622756ff447725a8ee5fa6';

async function checkNetwork() {
    console.log('🌐 Checking network connectivity...');
    
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        
        // Get network info
        const network = await provider.getNetwork();
        console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
        
        // Get latest block
        const blockNumber = await provider.getBlockNumber();
        console.log(`✅ Latest block: ${blockNumber}`);
        
        // Check if contract exists
        const code = await provider.getCode(RUST_CONTRACT_ADDRESS);
        console.log(`✅ Contract code length: ${code.length} characters`);
        console.log(`Contract exists: ${code !== '0x' ? 'YES' : 'NO'}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Network error:', error.message);
        return false;
    }
}

checkNetwork();
