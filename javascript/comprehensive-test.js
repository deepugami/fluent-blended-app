const { ethers } = require('ethers');

// Contract addresses
const RUST_CONTRACT_ADDRESS = '0x447cc72447d69cf9e0622756ff447725a8ee5fa6';
const SOLIDITY_CONTRACT_ADDRESS = '0x8438Ad1C834623CfF278AB6829a248E37C2D7E3f';

// RPC URL
const RPC_URL = 'https://rpc.dev.gblend.xyz/';

// Private key
const PRIVATE_KEY = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';

// ABI for both contracts
const CONTRACT_ABI = [
    "function sqrt(uint256 x) external view returns (int256)",
    "function exp(int256 x) external view returns (int256)",
    "function ln(uint256 x) external view returns (int256)",
    "function log2(uint256 x) external view returns (int256)",
    "function log10(uint256 x) external view returns (int256)",
    "function prbMathRust() external view returns (address)"
];

// Helper function to scale numbers (18 decimal places)
function toFixedPoint(num) {
    return ethers.parseEther(num.toString());
}

function fromFixedPoint(bigNum) {
    return ethers.formatEther(bigNum);
}

async function testContract(contractAddress, contractName) {
    console.log(`🧮 Testing ${contractName}...\n`);
    
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);
        
        console.log(`📋 ${contractName} Address: ${contractAddress}\n`);
        
        // Test with properly scaled inputs
        const tests = [
            {
                func: 'sqrt',
                input: toFixedPoint('4'),  // sqrt(4) should be 2
                expected: '2.0'
            },
            {
                func: 'exp',
                input: ethers.parseEther('1'),  // exp(1) should be ~2.718
                expected: '~2.718'
            },
            {
                func: 'ln',
                input: toFixedPoint('2.718281828'),  // ln(e) should be ~1
                expected: '~1.0'
            },
            {
                func: 'log2',
                input: toFixedPoint('8'),  // log2(8) should be 3
                expected: '3.0'
            },
            {
                func: 'log10',
                input: toFixedPoint('100'),  // log10(100) should be 2
                expected: '2.0'
            }
        ];
        
        for (const test of tests) {
            try {
                console.log(`Testing ${test.func}(${fromFixedPoint(test.input)}) [Expected: ${test.expected}]`);
                
                const result = await contract[test.func](test.input);
                const formattedResult = fromFixedPoint(result);
                
                console.log(`✅ Result: ${formattedResult}`);
                console.log('');
                
            } catch (error) {
                console.log(`❌ Error calling ${test.func}: ${error.message}`);
                console.log('');
            }
        }
        
        console.log(`✅ ${contractName} testing completed!\n`);
        
    } catch (error) {
        console.error(`❌ Error testing ${contractName}:`, error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting comprehensive contract tests...\n');
    
    // Test Rust contract directly
    await testContract(RUST_CONTRACT_ADDRESS, 'Rust Contract (Direct)');
    
    console.log('='.repeat(60));
    console.log('');
    
    // Test Solidity contract (which calls Rust)
    await testContract(SOLIDITY_CONTRACT_ADDRESS, 'Solidity Contract (via Rust)');
    
    console.log('🎉 All tests completed!');
}

runTests();
