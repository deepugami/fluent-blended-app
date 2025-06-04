const ethers = require("ethers");

// Configuration
const RPC_URL = "https://rpc.dev.gblend.xyz/";
const RUST_CONTRACT_ADDRESS = "0x447cc72447d69cf9e0622756ff447725a8ee5fa6";

// Rust contract ABI
const RUST_CONTRACT_ABI = [
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

async function testRustContract() {
    try {
        console.log("🧪 Testing Rust Mathematical Functions Contract");
        console.log("==============================================");
        
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const rustContract = new ethers.Contract(RUST_CONTRACT_ADDRESS, RUST_CONTRACT_ABI, provider);
        
        // Test with different values
        const testValues = [
            { value: "1000000000000000000", description: "1.0" },  // 1.0
            { value: "2000000000000000000", description: "2.0" },  // 2.0
            { value: "4000000000000000000", description: "4.0" },  // 4.0
            { value: "500000000000000000", description: "0.5" },   // 0.5
        ];
        
        for (const testCase of testValues) {
            console.log(`\n📊 Testing with value: ${testCase.value} (${testCase.description})`);
            console.log("─".repeat(50));
            
            const inputBN = ethers.BigNumber.from(testCase.value);
            
            // Test sqrt
            try {
                const sqrtResult = await rustContract.sqrt(inputBN);
                const sqrtFormatted = formatResult(sqrtResult);
                console.log(`√(${testCase.description}) = ${sqrtFormatted}`);
            } catch (error) {
                console.log(`√(${testCase.description}) = ERROR: ${error.message}`);
            }
            
            // Test exp (be careful with large inputs)
            if (parseFloat(testCase.description) <= 2.0) {
                try {
                    const expResult = await rustContract.exp(inputBN);
                    const expFormatted = formatResult(expResult);
                    console.log(`e^(${testCase.description}) = ${expFormatted}`);
                } catch (error) {
                    console.log(`e^(${testCase.description}) = ERROR: ${error.message}`);
                }
            }
            
            // Test ln
            try {
                const lnResult = await rustContract.ln(inputBN);
                const lnFormatted = formatResult(lnResult);
                console.log(`ln(${testCase.description}) = ${lnFormatted}`);
            } catch (error) {
                console.log(`ln(${testCase.description}) = ERROR: ${error.message}`);
            }
            
            // Test log2
            try {
                const log2Result = await rustContract.log2(inputBN);
                const log2Formatted = formatResult(log2Result);
                console.log(`log₂(${testCase.description}) = ${log2Formatted}`);
            } catch (error) {
                console.log(`log₂(${testCase.description}) = ERROR: ${error.message}`);
            }
            
            // Test log10
            try {
                const log10Result = await rustContract.log10(inputBN);
                const log10Formatted = formatResult(log10Result);
                console.log(`log₁₀(${testCase.description}) = ${log10Formatted}`);
            } catch (error) {
                console.log(`log₁₀(${testCase.description}) = ERROR: ${error.message}`);
            }
        }
        
        console.log("\n✅ Rust contract testing completed!");
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

function formatResult(value) {
    try {
        const bn = ethers.BigNumber.from(value);
        const isNegative = bn.lt(0);
        const abs = isNegative ? bn.mul(-1) : bn;
        
        const formatted = ethers.utils.formatEther(abs);
        return isNegative ? `-${formatted}` : formatted;
    } catch {
        return value.toString();
    }
}

// Run the test
testRustContract();
