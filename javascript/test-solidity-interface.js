const { ethers } = require('ethers');

// Configuration
const RPC_URL = "https://rpc.dev.gblend.xyz/";
const SOLIDITY_CONTRACT_ADDRESS = "0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f";

// Solidity contract ABI - This is the proper interface
const SOLIDITY_CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "PrbMathRustAddress", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "prbMathRust",
        "outputs": [{"internalType": "contract IPrbMathRust", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
        "name": "sqrt",
        "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
        "stateMutability": "view",
        "type": "function"
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
        "name": "log2",
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
    }
];

async function testSolidityInterface() {
    try {
        console.log('Testing Solidity Interface Contract...');
        console.log('Contract Address:', SOLIDITY_CONTRACT_ADDRESS);
        console.log('RPC URL:', RPC_URL);
        
        // Create provider
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        
        // Test network connection
        const network = await provider.getNetwork();
        console.log('Connected to network:', network.name, 'Chain ID:', network.chainId);
        
        // Create contract instance
        const contract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, SOLIDITY_CONTRACT_ABI, provider);
        
        // First, check what Rust contract address the Solidity contract is pointing to
        console.log('\nChecking Rust contract address in Solidity contract...');
        const rustAddress = await contract.prbMathRust();
        console.log('Rust contract address from Solidity:', rustAddress);
        
        // Test with different input values
        const testValues = [
            { value: "1000000000000000000", description: "1.0" },  // 1.0
            { value: "2000000000000000000", description: "2.0" },  // 2.0
            { value: "4000000000000000000", description: "4.0" },  // 4.0
        ];
        
        for (const testCase of testValues) {
            console.log(`\n--- Testing with ${testCase.description} (${testCase.value}) ---`);
            
            // Test each function
            const functions = [
                { name: 'sqrt', param: testCase.value, type: 'uint256' },
                { name: 'ln', param: testCase.value, type: 'uint256' },
                { name: 'log2', param: testCase.value, type: 'uint256' },
                { name: 'log10', param: testCase.value, type: 'uint256' },
                { name: 'exp', param: testCase.value, type: 'int256' }
            ];
            
            for (const func of functions) {
                try {
                    console.log(`Testing ${func.name}...`);
                    const result = await contract[func.name](func.param);
                    const formatted = ethers.formatEther(result.toString());
                    console.log(`${func.name}(${testCase.description}) = ${result.toString()} (${formatted})`);
                } catch (error) {
                    console.error(`${func.name} failed:`, error.message);
                    
                    // Try to get more details about the error
                    if (error.data) {
                        console.error('Error data:', error.data);
                    }
                    if (error.transaction) {
                        console.error('Transaction that failed:', error.transaction);
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testSolidityInterface();
