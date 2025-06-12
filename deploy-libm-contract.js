const { ethers } = require('ethers');
const fs = require('fs');

async function deployLibmContract() {
    try {
        console.log('🚀 Deploying updated Rust contract with libm...');
        
        // Configuration
        const RPC_URL = 'https://rpc.dev.gblend.xyz/';
        const CHAIN_ID = 20993;
        const PRIVATE_KEY = '0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed';
        
        // Setup provider and wallet (ethers v5)
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log('📝 Deployer address:', wallet.address);
        
        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log('💰 Balance:', ethers.utils.formatEther(balance), 'ETH');
        
        if (balance.lt(ethers.utils.parseEther('0.01'))) {
            throw new Error('Insufficient balance for deployment');
        }
        
        // Read the compiled WASM file
        const wasmPath = './lib.wasm';
        if (!fs.existsSync(wasmPath)) {
            throw new Error('WASM file not found. Please run: gblend build rust -r');
        }
        
        const wasmBytecode = fs.readFileSync(wasmPath);
        console.log('📦 WASM size:', wasmBytecode.length, 'bytes');
        
        // Deploy the contract
        console.log('🔧 Deploying contract...');
        const tx = await wallet.sendTransaction({
            data: '0x' + wasmBytecode.toString('hex'),
            gasLimit: 5000000,
        });
        
        console.log('⏳ Transaction hash:', tx.hash);
        console.log('⏳ Waiting for confirmation...');
        
        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log('✅ Contract deployed successfully!');
            console.log('📍 Contract address:', receipt.contractAddress);
            console.log('⛽ Gas used:', receipt.gasUsed.toString());
            console.log('🔗 Explorer:', `https://blockscout.dev.gblend.xyz/address/${receipt.contractAddress}`);
            
            // Test the new contract
            console.log('\n🧪 Testing mathematical functions...');
            await testMathFunctions(receipt.contractAddress, wallet);
            
        } else {
            console.log('❌ Contract deployment failed');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testMathFunctions(contractAddress, wallet) {
    try {
        // ABI for mathematical functions
        const abi = [
            "function sqrt(uint256 x) external view returns (int256)",
            "function exp(int256 x) external view returns (int256)",
            "function ln(uint256 x) external view returns (int256)",
            "function log2(uint256 x) external view returns (int256)",
            "function log10(uint256 x) external view returns (int256)"
        ];
        
        const contract = new ethers.Contract(contractAddress, abi, wallet);
        
        // Test with 4.0 (4000000000000000000 in 18 decimals)
        const testValue = ethers.utils.parseEther('4');
        console.log(`\n📊 Testing with input: ${testValue} (4.0)`);
        
        // Test exp(4)
        const expResult = await contract.exp(testValue);
        const expDecimal = Number(expResult) / 1e18;
        console.log(`exp(4) = ${expResult} (${expDecimal.toFixed(6)})`);
        console.log(`Expected: ~54.598150`);
        
        // Test ln(4)
        const lnResult = await contract.ln(testValue);
        const lnDecimal = Number(lnResult) / 1e18;
        console.log(`ln(4) = ${lnResult} (${lnDecimal.toFixed(6)})`);
        console.log(`Expected: ~1.386294`);
        
        // Test log10(4)
        const log10Result = await contract.log10(testValue);
        const log10Decimal = Number(log10Result) / 1e18;
        console.log(`log10(4) = ${log10Result} (${log10Decimal.toFixed(6)})`);
        console.log(`Expected: ~0.602060`);
        
        // Test sqrt(4)
        const sqrtResult = await contract.sqrt(testValue);
        const sqrtDecimal = Number(sqrtResult) / 1e18;
        console.log(`sqrt(4) = ${sqrtResult} (${sqrtDecimal.toFixed(6)})`);
        console.log(`Expected: 2.0`);
        
        // Test log2(4)
        const log2Result = await contract.log2(testValue);
        const log2Decimal = Number(log2Result) / 1e18;
        console.log(`log2(4) = ${log2Result} (${log2Decimal.toFixed(6)})`);
        console.log(`Expected: 2.0`);
        
    } catch (error) {
        console.error('❌ Testing error:', error.message);
    }
}

// Run the deployment
deployLibmContract();
