const { ethers } = require('ethers');

const NEW_RUST_ADDRESS = '0x210c583479f3cfece4080e39496000bc0d9bf568';
const RPC_URL = 'https://rpc.dev.gblend.xyz/';

async function main() {
    console.log('Testing new Rust contract...');
    
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    console.log('Connected to provider');
    
    const rustABI = [
        'function sqrt(uint256 x) external view returns (int256)'
    ];
    
    const contract = new ethers.Contract(NEW_RUST_ADDRESS, rustABI, provider);
    console.log('Contract instance created');
    
    const testValue = '4000000000000000000'; // 4.0
    console.log('Testing sqrt(4.0)...');
    
    try {
        const result = await contract.sqrt(testValue);
        console.log('✅ Success! Result:', result.toString());
        console.log('Formatted:', ethers.utils.formatEther(result));
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main().catch(console.error);
