const ethers = require("ethers");

// Configuration
const RPC_URL = "https://rpc.dev.gblend.xyz/";
const PRIVATE_KEY = "0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed";
const RUST_CONTRACT_ADDRESS = "0x447cc72447d69cf9e0622756ff447725a8ee5fa6";

// Solidity contract bytecode and ABI (you'll need to compile this in Remix)
const SOLIDITY_CONTRACT_BYTECODE = ""; // Will be filled after compilation
const SOLIDITY_CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "PrbMathRustAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "prbMathRust",
        "outputs": [
            {
                "internalType": "contract IPrbMathRust",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "sqrt",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "x",
                "type": "int256"
            }
        ],
        "name": "exp",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "ln",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "log2",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "log10",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function deploySolidityContract() {
    try {
        console.log("🚀 Starting Solidity Contract Deployment");
        console.log("=====================================");
        
        // Create provider and wallet
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log(`📍 Deployer address: ${wallet.address}`);
        console.log(`🔗 Network: Fluent Testnet`);
        console.log(`📄 Rust contract address: ${RUST_CONTRACT_ADDRESS}`);
        
        // Check balance
        const balance = await wallet.getBalance();
        console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ETH`);
        
        if (balance.eq(0)) {
            console.log("❌ Insufficient balance. Please fund your wallet.");
            return;
        }
        
        // Note: You need to compile the contract in Remix and get the bytecode
        console.log("⚠️  To deploy the Solidity contract:");
        console.log("1. Go to Remix IDE: https://remix.ethereum.org/");
        console.log("2. Create a new file and paste the Solidity contract code");
        console.log("3. Compile the contract");
        console.log("4. Deploy it with the Rust contract address as constructor parameter");
        console.log(`   Constructor parameter: ${RUST_CONTRACT_ADDRESS}`);
        console.log("5. Connect to Fluent testnet in MetaMask");
        console.log("6. Deploy using the wallet with the private key provided");
        
    } catch (error) {
        console.error("❌ Deployment failed:", error);
    }
}

// Test function to interact with deployed contracts
async function testContracts(solidityContractAddress) {
    try {
        console.log("\n🧪 Testing Contract Interactions");
        console.log("===============================");
        
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        // Connect to contracts
        const solidityContract = new ethers.Contract(solidityContractAddress, SOLIDITY_CONTRACT_ABI, wallet);
        
        // Test value: 2.0 (with 18 decimal places)
        const testValue = ethers.utils.parseEther("2.0");
        
        console.log(`📊 Testing with value: ${testValue.toString()} (2.0)`);
        
        // Test each function
        const functions = ['sqrt', 'exp', 'ln', 'log2', 'log10'];
        
        for (const func of functions) {
            try {
                console.log(`\n🔄 Testing ${func}...`);
                let result;
                
                if (func === 'exp') {
                    // exp function takes int256, others take uint256
                    result = await solidityContract[func](testValue);
                } else {
                    result = await solidityContract[func](testValue);
                }
                
                const formatted = ethers.utils.formatEther(result.abs());
                const sign = result.lt(0) ? '-' : '';
                
                console.log(`✅ ${func}(2.0) = ${sign}${formatted}`);
                
            } catch (error) {
                console.log(`❌ ${func} failed: ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

// Run deployment info
deploySolidityContract();

// Export for use
module.exports = {
    deploySolidityContract,
    testContracts,
    RUST_CONTRACT_ADDRESS,
    SOLIDITY_CONTRACT_ABI
};
