const { ethers } = require("ethers");

// Contract addresses
const RUST_CONTRACT_ADDRESS = "0x87b99c706e17211f313e21f1ed98782e19e91fb2";
const SOLIDITY_CONTRACT_ADDRESS = "0xAFc63F12b732701526f48E8256Ad35c888336E54";

// Network configuration
const FLUENT_NETWORK = {
    name: 'Fluent DevNet',
    chainId: 20993,
    rpcUrl: 'https://rpc.dev.gblend.xyz/',
    blockExplorer: 'https://blockscout.dev.gblend.xyz/'
};

// Solidity contract ABI
const SOLIDITY_ABI = [
    "function getRustString() external view returns (string memory)",
    "function getRustUint256() external view returns (uint256)",
    "function getRustInt256() external view returns (int256)",
    "function getRustAddress() external view returns (address)",
    "function getRustBytes() external view returns (bytes memory)",
    "function getRustBytes32() external view returns (bytes32)",
    "function getRustBool() external view returns (bool)"
];

async function testSolidityContract() {
    console.log('=== Testing Solidity Contract Calling Rust Functions ===\n');
    
    // Setup provider
    const provider = new ethers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
    
    // Create contract instance
    const contract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, SOLIDITY_ABI, provider);
    
    try {
        console.log('Testing getRustString()...');
        const stringResult = await contract.getRustString();
        console.log(`✅ String result: "${stringResult}"`);
        
        console.log('\nTesting getRustUint256()...');
        const uint256Result = await contract.getRustUint256();
        console.log(`✅ Uint256 result: ${uint256Result.toString()}`);
        
        console.log('\nTesting getRustInt256()...');
        const int256Result = await contract.getRustInt256();
        console.log(`✅ Int256 result: ${int256Result.toString()}`);
        
        console.log('\nTesting getRustAddress()...');
        const addressResult = await contract.getRustAddress();
        console.log(`✅ Address result: ${addressResult}`);
        
        console.log('\nTesting getRustBytes()...');
        const bytesResult = await contract.getRustBytes();
        console.log(`✅ Bytes result: ${bytesResult}`);
        
        console.log('\nTesting getRustBytes32()...');
        const bytes32Result = await contract.getRustBytes32();
        console.log(`✅ Bytes32 result: ${bytes32Result}`);
        
        console.log('\nTesting getRustBool()...');
        const boolResult = await contract.getRustBool();
        console.log(`✅ Bool result: ${boolResult}`);
        
        console.log('\n🎉 All Solidity -> Rust function calls successful!');
        
    } catch (error) {
        console.error('❌ Error calling Solidity contract:', error.message);
        if (error.data) {
            console.error('Error data:', error.data);
        }
    }
}

// Run the test
testSolidityContract().catch(console.error); 