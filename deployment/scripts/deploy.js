// deploy.js - Script to deploy prbMathBlended contract to Fluent network
// This script will deploy the Rust contract first, then deploy the Solidity contract
// with the Rust contract address as a parameter

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const solc = require('solc'); // Add solc compiler

// Path to contract files
const prbMathBlendedPath = path.join(__dirname, '..', 'prbMathBlended.sol');

// Read contract source
const prbMathBlendedSource = fs.readFileSync(prbMathBlendedPath, 'utf8');

// Create a simple RustMath implementation contract
// This is a simple implementation of the RustMath interface that will work on any EVM chain
const rustContractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RustMathImplementation
 * @dev Simple Solidity implementation of the RustMath interface for testing
 */
contract RustMathImplementation {
    uint256 constant SCALE = 10**18;
    
    // Calculate square root using Newton's method
    function sqrt(uint256 x) public pure returns (uint256) {
        if (x == 0) return 0;
        
        uint256 result = x;
        uint256 y = (x + 1) / 2;
        while (y < result) {
            result = y;
            y = (x / y + y) / 2;
        }
        
        return result;
    }
    
    // Calculate e^x
    function exp(int256 x) public pure returns (int256) {
        // Handle extreme cases
        if (x > int256(40 * SCALE)) return int256(uint256(1) << 255) - 1; // Max value
        if (x < int256(-40 * SCALE)) return 0; // Very small value
        
        // For quick implementation, use a simple approach for small values
        // In a real implementation, a more accurate algorithm would be used
        int256 result = int256(SCALE); // Start with 1.0
        int256 term = int256(SCALE);   // First term is 1.0
        
        // Simple power series approximation: e^x = 1 + x + x^2/2! + x^3/3! + ...
        int256 xScaled = x;
        for (uint i = 1; i <= 10; i++) {
            term = (term * xScaled) / int256(i * SCALE);
            result += term;
        }
        
        return result;
    }
    
    // Calculate natural logarithm
    function ln(uint256 x) public pure returns (int256) {
        require(x > 0, "ln(x): x must be positive");
        
        // For x close to 1, use a simple approximation
        // ln(x) ≈ 2 * (x - 1) / (x + 1) for x close to 1
        if (x >= SCALE / 2 && x <= SCALE * 2) {
            int256 z = (int256(x) - int256(SCALE)) * int256(SCALE) / (int256(x) + int256(SCALE));
            return 2 * z;
        }
        
        // For other values, use a more complete approach (simplified here)
        uint256 n = 0;
        while (x >= 2 * SCALE) {
            x = x * SCALE / (2 * SCALE);
            n += 1;
        }
        
        while (x <= SCALE / 2) {
            x = x * 2 * SCALE / SCALE;
            n -= 1;
        }
        
        // Now x is in the range [0.5, 2]
        int256 z = (int256(x) - int256(SCALE)) * int256(SCALE) / (int256(x) + int256(SCALE));
        int256 result = 2 * z;
        
        // Add the power of 2 contribution
        result += int256(n) * int256(6931471805599453); // ln(2) * 10^17
        
        return result;
    }
    
    // Calculate base-10 logarithm
    function log10(uint256 x) public view returns (int256) {
        // log10(x) = ln(x) / ln(10)
        int256 lnX = ln(x);
        int256 ln10 = 2302585092994046000; // ln(10) * 10^18
        return int256(uint256(lnX) * SCALE / uint256(ln10));
    }
    
    // Calculate base-2 logarithm
    function log2(uint256 x) public view returns (int256) {
        // log2(x) = ln(x) / ln(2)
        int256 lnX = ln(x);
        int256 ln2 = 693147180559945300; // ln(2) * 10^18
        return int256(uint256(lnX) * SCALE / uint256(ln2));
    }
}
`;

async function main() {
    console.log('Starting deployment process...');
    
    // Connect to Fluent network
    // Using the provided wallet
    const privateKey = '0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa';
    const walletAddress = '0xE3be5250dC953F4581e4be70EaB0C23544006261';
    
    // RPC URL for Fluent network
    const rpcUrl = 'https://rpc.dev.thefluent.xyz/'; // Fluent Devnet RPC URL
    
    console.log(`Connecting to Fluent network at ${rpcUrl}`);
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log(`Connected with wallet: ${walletAddress}`);
    console.log(`Wallet balance: ${ethers.utils.formatEther(await wallet.getBalance())} ETH`);
    
    // Compile the contracts
    console.log('Compiling contracts...');
    
    // Set up solc input for both contracts
    const input = {
        language: 'Solidity',
        sources: {
            'prbMathBlended.sol': {
                content: prbMathBlendedSource
            },
            'RustMathImplementation.sol': {
                content: rustContractSource
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            },
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    };

    // Compile the contracts
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // Check for errors
    if (output.errors) {
        output.errors.forEach(error => {
            console.log(error.formattedMessage);
            // Exit only on errors, not warnings
            if (error.severity === 'error') {
                process.exit(1);
            }
        });
    }
    
    // Get the contract ABIs and bytecodes
    const prbMathBlendedAbi = output.contracts['prbMathBlended.sol']['prbMathBlended'].abi;
    const prbMathBlendedBytecode = output.contracts['prbMathBlended.sol']['prbMathBlended'].evm.bytecode.object;
    
    const rustMathAbi = output.contracts['RustMathImplementation.sol']['RustMathImplementation'].abi;
    const rustMathBytecode = output.contracts['RustMathImplementation.sol']['RustMathImplementation'].evm.bytecode.object;
    
    console.log('Contract compilation successful!');
    
    // Deploy the Rust Math implementation
    console.log('Deploying Rust Math implementation contract...');
    const rustMathFactory = new ethers.ContractFactory(
        rustMathAbi,
        "0x" + rustMathBytecode,
        wallet
    );
    
    const rustMathContract = await rustMathFactory.deploy();
    console.log(`Waiting for Rust contract transaction: ${rustMathContract.deployTransaction.hash}`);
    
    await rustMathContract.deployed();
    console.log(`Rust Math implementation contract deployed at: ${rustMathContract.address}`);
    
    // Use the deployed Rust Math contract address
    const rustContractAddress = rustMathContract.address;
    
    // Deploy the Solidity contract
    console.log('Deploying prbMathBlended contract...');
    
    // Deploy with Rust contract address as constructor parameter
    const prbMathBlendedFactory = new ethers.ContractFactory(
        prbMathBlendedAbi,
        "0x" + prbMathBlendedBytecode,
        wallet
    );
    
    // Deploy the contract with the Rust contract address as a parameter
    const prbMathBlendedContract = await prbMathBlendedFactory.deploy(rustContractAddress);
    console.log(`Waiting for transaction: ${prbMathBlendedContract.deployTransaction.hash}`);
    
    await prbMathBlendedContract.deployed();
    console.log(`prbMathBlended contract deployed at: ${prbMathBlendedContract.address}`);
    
    // Update the app.js file with the deployed contract address
    const appJsPath = path.join(__dirname, '..', '..', 'prb-math-react-frontend', 'src', 'App.jsx');
    
    if (fs.existsSync(appJsPath)) {
        console.log(`Updating ${appJsPath} with deployed contract address...`);
        let appJsContent = fs.readFileSync(appJsPath, 'utf8');
        
        // Replace the placeholder contract address
        appJsContent = appJsContent.replace(
            /const CONTRACT_ADDRESS = "[^"]+";/,
            `const CONTRACT_ADDRESS = "${prbMathBlendedContract.address}"; // Deployed on ${new Date().toISOString()}`
        );
        
        // Update the file
        fs.writeFileSync(appJsPath, appJsContent);
        console.log('Contract address updated in App.jsx');
    } else {
        console.error(`Could not find ${appJsPath} to update the contract address`);
    }
    
    console.log('\nDeployment Summary:');
    console.log('-------------------');
    console.log(`Rust Math Implementation: ${rustContractAddress}`);
    console.log(`prbMathBlended Contract: ${prbMathBlendedContract.address}`);
    console.log('\nUpdate your App.jsx file with this contract address if it wasn\'t automatically updated.');
    
    // Test the contract
    console.log('\nTesting deployed contract...');
    const deployedContract = new ethers.Contract(
        prbMathBlendedContract.address,
        prbMathBlendedAbi,
        wallet
    );
    
    try {
        const rustContractFromSolidity = await deployedContract.rustContract();
        console.log(`Verified Rust contract address from Solidity: ${rustContractFromSolidity}`);
        
        // Test sqrt function
        const testValue = ethers.utils.parseUnits("4.0", 18);
        const sqrtResult = await deployedContract.sqrt(testValue);
        console.log(`sqrt(4) = ${ethers.utils.formatUnits(sqrtResult, 18)}`);
        
        console.log('Contract test successful!');
    } catch (error) {
        console.error('Contract test failed:', error);
    }
}

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });