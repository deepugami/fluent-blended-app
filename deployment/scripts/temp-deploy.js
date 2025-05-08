// temp-deploy.js - Modified script to deploy prbMathBlended contract with direct private key
// This script will deploy the Solidity contract with the Rust contract address as a parameter

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Path to contract files
const prbMathBlendedPath = path.join(__dirname, '..', 'prbMathBlended.sol');

// Read contract source
const prbMathBlendedSource = fs.readFileSync(prbMathBlendedPath, 'utf8');

async function main() {
    console.log('Starting deployment process...');
    
    // Direct private key (for educational purposes only)
    const privateKey = '0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa';
    
    // RPC URL for Fluent network
    const rpcUrl = 'https://testnet.fluent.xyz'; 
    
    console.log(`Connecting to Fluent network at ${rpcUrl}`);
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const walletAddress = await wallet.getAddress();
    
    console.log(`Connected with wallet: ${walletAddress}`);
    console.log(`Wallet balance: ${ethers.utils.formatEther(await wallet.getBalance())} ETH`);
    
    // Compile the Solidity contract
    console.log('Compiling Solidity contract...');
    
    // Set up solc input
    const input = {
        language: 'Solidity',
        sources: {
            'prbMathBlended.sol': {
                content: prbMathBlendedSource
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

    // Compile the contract
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
    
    // Get the contract ABI and bytecode
    const prbMathBlendedAbi = output.contracts['prbMathBlended.sol']['prbMathBlended'].abi;
    const prbMathBlendedBytecode = output.contracts['prbMathBlended.sol']['prbMathBlended'].evm.bytecode.object;
    
    console.log('Contract compilation successful!');
    
    // Rust contract address
    // =============================================================
    // IMPORTANT: Replace this with your deployed Rust contract address
    // =============================================================
    const rustContractAddress = "0xE3be5250dC953F4581e4be70EaB0C23544006261";
    console.log(`Using Rust contract at: ${rustContractAddress}`);
    
    // Deploy the Solidity contract
    console.log('Deploying prbMathBlended contract...');
    
    // Deploy with Rust contract address as constructor parameter
    const prbMathBlendedFactory = new ethers.ContractFactory(
        prbMathBlendedAbi,
        "0x" + prbMathBlendedBytecode, // Add 0x prefix if not already present
        wallet
    );
    
    // Deploy the contract with the Rust contract address as a parameter
    const prbMathBlendedContract = await prbMathBlendedFactory.deploy(rustContractAddress);
    console.log(`Waiting for transaction: ${prbMathBlendedContract.deployTransaction.hash}`);
    
    await prbMathBlendedContract.deployed();
    console.log(`prbMathBlended contract deployed at: ${prbMathBlendedContract.address}`);
    
    // Update the app.js file with the deployed contract address
    const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
    
    if (fs.existsSync(appJsPath)) {
        console.log(`Updating ${appJsPath} with deployed contract address...`);
        let appJsContent = fs.readFileSync(appJsPath, 'utf8');
        
        // Replace the placeholder contract address
        appJsContent = appJsContent.replace(
            'const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";',
            `const CONTRACT_ADDRESS = "${prbMathBlendedContract.address}"; // Deployed on ${new Date().toISOString()}`
        );
        
        // Update the file
        fs.writeFileSync(appJsPath, appJsContent);
        console.log('Contract address updated in app.js');
    } else {
        console.error(`Could not find ${appJsPath} to update the contract address`);
    }
    
    console.log('\nDeployment Summary:');
    console.log('-------------------');
    console.log(`Rust Contract: ${rustContractAddress}`);
    console.log(`prbMathBlended Contract: ${prbMathBlendedContract.address}`);
    console.log('\nUpdate your app.js file with this contract address if it wasn\'t automatically updated.');
}

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });
