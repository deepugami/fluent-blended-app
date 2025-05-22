import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file URL and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Wallet configuration from the user
const privateKey = '0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa';
const walletAddress = '0xE3be5250dC953F4581e4be70EaB0C23544006261';

// Fluent Network configuration
const FLUENT_NETWORK = {
  name: 'Fluent Developer Preview',
  chainId: 20993,
  rpcUrl: 'https://rpc.dev.gblend.xyz',
  blockExplorer: 'https://explorer.dev.gblend.xyz/',
};

// Contract addresses - use lowercase to avoid checksum issues
const EXPECTED_SOLIDITY_CONTRACT = '0x8d4e34c7a6a757574665caf2e23684b1dff31fda'.toLowerCase();
const EXPECTED_RUST_CONTRACT = '0xed4da3497bcbfff1f944eb566e7d33e812c43f7a'.toLowerCase();

// Solidity contract ABI - this should match what's in App.jsx
const contractABI = [
  {
    "inputs": [{"internalType": "address", "name": "_rustContract", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "int256", "name": "x", "type": "int256"}],
    "name": "exp",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "ln",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "log10",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "log2",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rustContract",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "sqrt",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "toFixed",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "fromFixed",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  }
];

// Simple contract bytecode for a test deployment - this would normally come from the compilation process
// This is a minimal PRBMathBlended contract implementation for testing
const contractBytecode = '0x608060405234801561001057600080fd5b5060405161051f38038061051f83398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b61048c806100936000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063a2a6335f1161005b578063a2a6335f146101035780635dec49311461012d578063d824ccf31461014d578063e3daea5e1461016d57600080fd5b806304d0a9001461008d57806350844c4a146100a3578063881e2a39146100c357806394e8767d146100e3575b600080fd5b6100a161009b366004610339565b61018d565b005b6100b66100b1366004610339565b6101e6565b6040519081526020015b60405180910390f35b6100d66100d1366004610339565b610213565b6040516100ba9190610353565b6100f66100f1366004610339565b61023d565b6040516100ba91906103ae565b61011661011136600461036c565b610265565b6040516001600160a01b0390911681526020016100ba565b6100b661013b366004610339565b61028f565b6100b661015b366004610339565b6102b9565b6100b661017b366004610339565b6102e3565b6000546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa1580156101d5573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061018d919061030d565b6000546001600160a01b031661020f576101ff610385565b61020c6001600160a01b0316610385565b90505b919050565b6000546001600160a01b031661020f5761022b610385565b61023861ffff60029190910b16610385565b90505b919050565b6000546001600160a01b031661020f57610255610385565b610235906002610408565b90505b919050565b6000546001600160a01b03165b6001600160a01b0316919050565b6000546001600160a01b031661020f576102a7610385565b61023590600a610408565b6000546001600160a01b031661020f576102d1610385565b6102356127106001600160e01b03610385565b6000806102ee610385565b9050600061020c8361042b565b60006020828403121561031f57600080fd5b505191905090565b803561020f8161043f565b60006020828403121561034b57600080fd5b813561023581610454565b602081526000825160206020830152801561036e5781604084015250600091506101e6565b5092915050565b60006020828403121561037e57600080fd5b5035919050565b6000606473ffffffffffffffffffffffffffffffffffffffff8082165b60ff8316156103bc578260ff16600a8302925061039c565b50919050565b634e487b7160e01b600052601160045260246000fd5b600060ff821660ff84168060ff0382111561040057634e487b7160e01b600052601160045260246000fd5b019392505050565b600060ff8316600883600a84020490600a84066000190160010114905092915050565b600061020f826001600160a01b03165b919050565b6001600160a01b038116610238565b8082610238565b801561020f8161046756';

// Path to App.jsx
const appJsxPath = path.join(__dirname, '..', 'src', 'App.jsx');

async function main() {
    console.log('================================');
    console.log('   Contract Deployment Checker   ');
    console.log('================================');
    
    // Connect to Fluent network
    console.log(`\nConnecting to ${FLUENT_NETWORK.name}...`);
    const provider = new ethers.providers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    try {
        // Get network information
        const network = await provider.getNetwork();
        console.log(`Connected to network with chain ID: ${network.chainId}`);
        
        // Check wallet balance
        const balance = await wallet.getBalance();
        console.log(`Wallet (${walletAddress}) balance: ${ethers.utils.formatEther(balance)} ETH`);
        
        if (balance.eq(0)) {
            console.error("Error: Wallet has no ETH for gas. Please fund the wallet first.");
            return;
        }
        
        // Check for existing contracts
        console.log('\nChecking contract deployment status...');
        
        // Check Solidity Contract
        const solidityContractCode = await provider.getCode(EXPECTED_SOLIDITY_CONTRACT);
        const solidityContractExists = solidityContractCode !== '0x';
        console.log(`Solidity contract at ${EXPECTED_SOLIDITY_CONTRACT}: ${solidityContractExists ? 'EXISTS' : 'NOT FOUND'}`);
        
        // Check Rust Contract
        const rustContractCode = await provider.getCode(EXPECTED_RUST_CONTRACT);
        const rustContractExists = rustContractCode !== '0x';
        console.log(`Rust contract at ${EXPECTED_RUST_CONTRACT}: ${rustContractExists ? 'EXISTS' : 'NOT FOUND'}`);
        
        let solidityContractAddress = EXPECTED_SOLIDITY_CONTRACT;
        
        // If the Solidity contract doesn't exist, deploy it
        if (!solidityContractExists) {
            console.log('\nSolidity contract not found. Deploying new contract...');
            
            // Create contract factory
            const factory = new ethers.ContractFactory(
                contractABI,
                contractBytecode,
                wallet
            );
            
            try {
                // Deploy with Rust contract address as constructor arg
                console.log(`Deploying with Rust contract address: ${EXPECTED_RUST_CONTRACT}`);
                const contract = await factory.deploy(EXPECTED_RUST_CONTRACT);
                console.log(`Transaction hash: ${contract.deployTransaction.hash}`);
                console.log('Waiting for confirmation...');
                
                await contract.deployed();
                solidityContractAddress = contract.address;
                console.log(`✅ Contract deployed successfully at: ${solidityContractAddress}`);
                
                // Update App.jsx with the new contract address
                console.log('\nUpdating frontend configuration...');
                if (fs.existsSync(appJsxPath)) {
                    let appJsxContent = fs.readFileSync(appJsxPath, 'utf8');
                    
                    // Replace FLUENT_CONTRACT_ADDRESS with the new address
                    appJsxContent = appJsxContent.replace(
                        /const FLUENT_CONTRACT_ADDRESS = "[^"]+";/,
                        `const FLUENT_CONTRACT_ADDRESS = "${solidityContractAddress}";`
                    );
                    
                    fs.writeFileSync(appJsxPath, appJsxContent);
                    console.log('✅ App.jsx updated with new contract address');
                } else {
                    console.error(`❌ Could not find App.jsx at: ${appJsxPath}`);
                }
            } catch (error) {
                console.error('❌ Failed to deploy contract:', error.message);
                return;
            }
        }
        
        // Verify contract functionality
        console.log('\nVerifying contract functionality...');
        const contract = new ethers.Contract(solidityContractAddress, contractABI, wallet);
        
        try {
            // Try to call rustContract() method
            const rustContractFromSolidity = await contract.rustContract();
            console.log(`Contract's Rust contract reference: ${rustContractFromSolidity}`);
            
            if (rustContractFromSolidity.toLowerCase() === EXPECTED_RUST_CONTRACT.toLowerCase()) {
                console.log('✅ Contract verification successful: rustContract() returns the expected address');
            } else {
                console.warn(`⚠️ Contract returns different Rust contract address: ${rustContractFromSolidity}`);
                console.warn(`   Expected: ${EXPECTED_RUST_CONTRACT}`);
            }
        } catch (error) {
            console.error('❌ Failed to verify contract functionality:', error.message);
            console.log('This may indicate issues with the contract implementation or that the Rust contract is missing.');
        }
        
        console.log('\nDeployment check completed!');
        console.log('================================');
        console.log('Contract Summary:');
        console.log(`Solidity Contract: ${solidityContractAddress}`);
        console.log(`Rust Contract: ${EXPECTED_RUST_CONTRACT}`);
        console.log(`Network: ${FLUENT_NETWORK.name} (Chain ID: ${network.chainId})`);
        console.log(`RPC URL: ${FLUENT_NETWORK.rpcUrl}`);
        console.log('================================');
        
        console.log('\nNext steps:');
        console.log('1. Update src/App.jsx to use this contract address if changed');
        console.log('2. Restart your application');
        console.log('3. Try connecting to Fluent network again');
        
    } catch (error) {
        console.error('\n❌ Error in deployment check process:', error.message);
    }
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Unhandled error:', error);
        process.exit(1);
    }); 