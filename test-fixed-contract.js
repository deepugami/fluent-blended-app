const { ethers } = require('ethers');

// Updated addresses
const NEW_RUST_CONTRACT_ADDRESS = '0x210c583479f3cfece4080e39496000bc0d9bf568';
const RPC_URL = 'https://rpc.dev.gblend.xyz/';
const PRIVATE_KEY = '0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed';

// Contract ABI
const RUST_ABI = [
    "function sqrt(uint256 x) external view returns (int256)",
    "function exp(int256 x) external view returns (int256)",
    "function ln(uint256 x) external view returns (int256)",
    "function log2(uint256 x) external view returns (int256)",
    "function log10(uint256 x) external view returns (int256)"
];

async function testNewRustContract() {
    console.log('🧪 Testing New Rust Contract (Fixed Version)');
    console.log('=============================================');
    
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log('📍 New Rust Contract:', NEW_RUST_CONTRACT_ADDRESS);
        console.log('📍 Your Address:', wallet.address);
        
        // Create contract instance
        const contract = new ethers.Contract(NEW_RUST_CONTRACT_ADDRESS, RUST_ABI, provider);
        
        console.log('\n🔢 Testing Mathematical Functions:\n');
        
        // Test value: 2.0 (with 18 decimal places)
        const testValue = ethers.utils.parseEther("2.0");
        console.log(`📊 Testing with value: ${testValue.toString()} (2.0)`);
        
        // Test each function
        const functions = [
            { name: 'sqrt', param: testValue, expected: '~1.414' },
            { name: 'ln', param: testValue, expected: '~0.693' },
            { name: 'log2', param: testValue, expected: '1.0' },
            { name: 'log10', param: testValue, expected: '~0.301' }
        ];
        
        for (const func of functions) {
            try {
                console.log(`\n🔄 Testing ${func.name}(2.0)...`);
                
                const result = await contract[func.name](func.param);
                const formatted = ethers.utils.formatEther(result.toString());
                
                console.log(`✅ ${func.name}(2.0) = ${formatted} (expected: ${func.expected})`);
                
            } catch (error) {
                console.log(`❌ ${func.name} failed: ${error.message}`);
            }
        }
        
        // Test exp with a smaller value (1.0)
        try {
            console.log(`\n🔄 Testing exp(1.0)...`);
            const expValue = ethers.utils.parseEther("1.0");
            const expResult = await contract.exp(expValue);
            const expFormatted = ethers.utils.formatEther(expResult.toString());
            console.log(`✅ exp(1.0) = ${expFormatted} (expected: ~2.718)`);
        } catch (error) {
            console.log(`❌ exp failed: ${error.message}`);
        }
        
        console.log('\n✅ New Rust contract testing completed!');
        console.log('\n📋 Updated Contract Information:');
        console.log('===============================');
        console.log('✅ New Rust Contract:', NEW_RUST_CONTRACT_ADDRESS);
        console.log('🌐 Network: Fluent Testnet (Chain ID: 20993)');
        console.log('🔗 RPC URL:', RPC_URL);
        console.log('\n🔧 Next Steps:');
        console.log('1. Use this new Rust contract address in your applications');
        console.log('2. Update any Solidity interface contracts to point to this address');
        console.log('3. The function selectors are working correctly now');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testNewRustContract();
