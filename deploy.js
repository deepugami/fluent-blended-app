// deploy.js - Script to deploy both Rust and Solidity contracts to Fluent Devnet
const { execSync } = require('child_process');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuration
const PRIVATE_KEY = '0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed';
const PUBLIC_ADDRESS = '0xa774bf3d9085596ebdea6d9a93763b78cf9686f2';
const RPC_URL = 'https://rpc.dev.gblend.xyz/';
const GAS_LIMIT = 3000000;

// Paths
const RUST_CONTRACT_DIR = './rust';
const RUST_WASM_PATH = path.join(RUST_CONTRACT_DIR, 'target/wasm32-unknown-unknown/release/rustsimplesc.wasm');
const SOLIDITY_CONTRACT_DIR = './solidity';
const CONSTRUCTOR_ARGS_PATH = path.join(SOLIDITY_CONTRACT_DIR, 'constructor-args.txt');
const DEPLOYMENT_RESULT_PATH = './deployment-result.json';

async function main() {
    console.log('==== Fluent Blended App Deployment ====');
    console.log(`Using wallet address: ${PUBLIC_ADDRESS}`);

    try {
        // Step 1: Build Rust contract
        console.log('\n[STEP 1] Building Rust contract...');
        const buildCmd = `cd ${RUST_CONTRACT_DIR} && gblend build rust -r`;
        console.log(`Running: ${buildCmd}`);
        execSync(buildCmd, { stdio: 'inherit' });
        console.log('✅ Rust contract built successfully');

        // Step 2: Deploy Rust contract
        console.log('\n[STEP 2] Deploying Rust contract...');
        const deployRustCmd = `cd ${RUST_CONTRACT_DIR} && gblend deploy --private-key ${PRIVATE_KEY} --dev target/wasm32-unknown-unknown/release/rustsimplesc.wasm --gas-limit ${GAS_LIMIT}`;
        console.log('Deploying Rust contract...');
        
        try {
            const rustDeployOutput = execSync(deployRustCmd).toString();
            console.log(rustDeployOutput);
            
            // Extract the deployed contract address from the output
            // This regex pattern might need adjustment based on the actual output format
            const rustAddressMatch = rustDeployOutput.match(/Contract deployed at: (0x[a-fA-F0-9]{40})/);
            if (!rustAddressMatch) {
                throw new Error('Could not extract Rust contract address from deployment output');
            }
            
            const rustContractAddress = rustAddressMatch[1];
            console.log(`✅ Rust contract deployed at: ${rustContractAddress}`);
            
            // Update constructor args file with the Rust contract address
            fs.writeFileSync(CONSTRUCTOR_ARGS_PATH, rustContractAddress);
            console.log(`✅ Updated constructor args file with Rust contract address: ${rustContractAddress}`);
            
            // Step 3: Deploy Solidity contract
            console.log('\n[STEP 3] Deploying Solidity contract...');
            const deploySolidityCmd = `cd ${SOLIDITY_CONTRACT_DIR} && forge create FluentSdkRustTypesTest.sol:FluentSdkRustTypesTest --constructor-args-path constructor-args.txt --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} --broadcast`;
            console.log('Deploying Solidity contract...');
            const solidityDeployOutput = execSync(deploySolidityCmd).toString();
            console.log(solidityDeployOutput);
            
            // Extract the Solidity contract address
            // This regex pattern might need adjustment based on the actual output format
            const solidityAddressMatch = solidityDeployOutput.match(/Deployed to: (0x[a-fA-F0-9]{40})/);
            if (!solidityAddressMatch) {
                throw new Error('Could not extract Solidity contract address from deployment output');
            }
            
            const solidityContractAddress = solidityAddressMatch[1];
            console.log(`✅ Solidity contract deployed at: ${solidityContractAddress}`);
            
            // Save deployment results to a file
            const deploymentResult = {
                rustContractAddress,
                solidityContractAddress,
                timestamp: new Date().toISOString(),
                network: 'fluent-devnet'
            };
            
            fs.writeFileSync(DEPLOYMENT_RESULT_PATH, JSON.stringify(deploymentResult, null, 2));
            console.log(`✅ Saved deployment results to ${DEPLOYMENT_RESULT_PATH}`);
            
            console.log('\n==== Deployment Summary ====');
            console.log(`Rust Contract: ${rustContractAddress}`);
            console.log(`Solidity Contract: ${solidityContractAddress}`);
            console.log('Deployment completed successfully!');
            
            console.log('\n==== Next Steps ====');
            console.log(`To test the contracts, run: node test.js ${rustContractAddress} ${solidityContractAddress}`);
            
        } catch (error) {
            console.error('Error during deployment:', error);
            process.exit(1);
        }
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main(); 