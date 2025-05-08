const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Read contract source
const contractPath = path.join(__dirname, '..', 'deployment', 'prbMathBlended.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');

async function main() {
    console.log('Starting deployment process...');
    
    // Your private key (for educational purposes only)
    const privateKey = '0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa';
    
    // Fluent testnet configuration
    const rpcUrl = 'https://testnet.fluent.xyz';
    const chainId = 424242;
    
    console.log(`Connecting to Fluent testnet at ${rpcUrl}`);
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log('Compiling contract...');
    const input = {
        language: 'Solidity',
        sources: {
            'prbMathBlended.sol': {
                content: contractSource
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    if (output.errors) {
        output.errors.forEach(error => {
            console.log(error.formattedMessage);
            if (error.severity === 'error') {
                process.exit(1);
            }
        });
    }

    const contract = output.contracts['prbMathBlended.sol']['prbMathBlended'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    // Replace with your deployed Rust contract address
    const rustContractAddress = '0xE3be5250dC953F4581e4be70EaB0C23544006261';
    
    console.log('Deploying contract...');
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const deployedContract = await factory.deploy(rustContractAddress);
    await deployedContract.deployed();
    
    console.log(`Contract deployed at: ${deployedContract.address}`);
    
    // Update the frontend contract address
    const appJsPath = path.join(__dirname, '..', 'frontend', 'js', 'app.js');
    if (fs.existsSync(appJsPath)) {
        let content = fs.readFileSync(appJsPath, 'utf8');
        content = content.replace(
            /const CONTRACT_ADDRESS = "[^"]+"/,
            `const CONTRACT_ADDRESS = "${deployedContract.address}"`
        );
        fs.writeFileSync(appJsPath, content);
        console.log('Updated frontend contract address');
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });