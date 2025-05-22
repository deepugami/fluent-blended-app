// test.js - Script to test the deployed contracts
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuration - UPDATE THESE AFTER DEPLOYMENT
// These will be output by the deploy.js script
let RUST_CONTRACT_ADDRESS = ''; // Replace with actual address after deployment
let SOLIDITY_CONTRACT_ADDRESS = ''; // Replace with actual address after deployment

// RPC configuration
const RPC_URL = 'https://rpc.dev.gblend.xyz/';
const PRIVATE_KEY = '0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed';

// Solidity contract ABI
const CONTRACT_ABI = [
    "function getRustString() view returns (string)",
    "function getRustUint256() view returns (uint256)",
    "function getRustInt256() view returns (int256)",
    "function getRustAddress() view returns (address)",
    "function getRustBytes() view returns (bytes)",
    "function getRustBytes32() view returns (bytes32)",
    "function getRustBool() view returns (bool)"
];

async function main() {
    console.log('==== Fluent Blended App Testing ====');
    
    try {
        // Check if addresses are provided as command line arguments
        if (process.argv.length >= 4) {
            RUST_CONTRACT_ADDRESS = process.argv[2];
            SOLIDITY_CONTRACT_ADDRESS = process.argv[3];
        } else {
            // Try to read from deployment-result.json if it exists
            if (fs.existsSync('deployment-result.json')) {
                const deploymentResult = JSON.parse(fs.readFileSync('deployment-result.json', 'utf8'));
                RUST_CONTRACT_ADDRESS = deploymentResult.rustContractAddress;
                SOLIDITY_CONTRACT_ADDRESS = deploymentResult.solidityContractAddress;
            }
        }

        // Verify addresses are provided
        if (!RUST_CONTRACT_ADDRESS || !SOLIDITY_CONTRACT_ADDRESS) {
            throw new Error('Contract addresses not provided. Please run with: node test.js <rustContractAddress> <solidityContractAddress>');
        }

        console.log(`Using Rust Contract: ${RUST_CONTRACT_ADDRESS}`);
        console.log(`Using Solidity Contract: ${SOLIDITY_CONTRACT_ADDRESS}`);

        // Connect to provider
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        // Create contract instance
        const contract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
        
        // Test all functions
        console.log('\nTesting contract functions:');
        
        // Test getRustString
        console.log('\n1. Testing getRustString()...');
        const rustString = await contract.getRustString();
        console.log(`Result: ${rustString}`);
        
        // Test getRustUint256
        console.log('\n2. Testing getRustUint256()...');
        const rustUint256 = await contract.getRustUint256();
        console.log(`Result: ${rustUint256.toString()}`);
        
        // Test getRustInt256
        console.log('\n3. Testing getRustInt256()...');
        const rustInt256 = await contract.getRustInt256();
        console.log(`Result: ${rustInt256.toString()}`);
        
        // Test getRustAddress
        console.log('\n4. Testing getRustAddress()...');
        const rustAddress = await contract.getRustAddress();
        console.log(`Result: ${rustAddress}`);
        
        // Test getRustBytes
        console.log('\n5. Testing getRustBytes()...');
        const rustBytes = await contract.getRustBytes();
        console.log(`Result (hex): 0x${Buffer.from(rustBytes.slice(2), 'hex').toString('hex')}`);
        console.log(`Result (decoded): ${Buffer.from(rustBytes.slice(2), 'hex').toString('utf8')}`);
        
        // Test getRustBytes32
        console.log('\n6. Testing getRustBytes32()...');
        const rustBytes32 = await contract.getRustBytes32();
        console.log(`Result: ${rustBytes32}`);
        
        // Test getRustBool
        console.log('\n7. Testing getRustBool()...');
        const rustBool = await contract.getRustBool();
        console.log(`Result: ${rustBool}`);
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('Error during testing:', error);
        process.exit(1);
    }
}

main(); 