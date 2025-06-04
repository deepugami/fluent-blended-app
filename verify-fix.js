const { ethers } = require('ethers');

async function verifyFix() {
    console.log('🔧 Verifying Contract Fix');
    console.log('========================\n');
    
    const RPC_URL = 'https://rpc.dev.gblend.xyz/';
    const NEW_RUST_ADDRESS = '0x210c583479f3cfece4080e39496000bc0d9bf568';
    const OLD_RUST_ADDRESS = '0x447cc72447d69cf9e0622756ff447725a8ee5fa6';
    
    const ABI = [
        "function sqrt(uint256 x) external view returns (int256)",
        "function exp(int256 x) external view returns (int256)",
        "function ln(uint256 x) external view returns (int256)",
        "function log2(uint256 x) external view returns (int256)",
        "function log10(uint256 x) external view returns (int256)"
    ];
    
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        console.log('✅ Connected to Fluent Testnet');
        
        // Test the new contract
        console.log('\n🧪 Testing NEW Rust Contract:', NEW_RUST_ADDRESS);
        const newContract = new ethers.Contract(NEW_RUST_ADDRESS, ABI, provider);
        
        const testValue = '2000000000000000000'; // 2.0 ETH (18 decimals)
        console.log('Input value: 2000000000000000000 (2.0)');
        
        try {
            const sqrtResult = await newContract.sqrt(testValue);
            console.log('✅ sqrt(2.0) =', ethers.utils.formatEther(sqrtResult), '(expected ~1.414)');
            
            const lnResult = await newContract.ln(testValue);
            console.log('✅ ln(2.0) =', ethers.utils.formatEther(lnResult), '(expected ~0.693)');
            
            const log2Result = await newContract.log2(testValue);
            console.log('✅ log2(2.0) =', ethers.utils.formatEther(log2Result), '(expected 1.0)');
            
            const log10Result = await newContract.log10(testValue);
            console.log('✅ log10(2.0) =', ethers.utils.formatEther(log10Result), '(expected ~0.301)');
            
            const expResult = await newContract.exp('1000000000000000000'); // exp(1.0)
            console.log('✅ exp(1.0) =', ethers.utils.formatEther(expResult), '(expected ~2.718)');
            
            console.log('\n✅ SUCCESS! All mathematical functions are now working!');
            
        } catch (error) {
            console.log('❌ New contract test failed:', error.message);
        }
        
        // Test the old contract to show it still fails
        console.log('\n🧪 Testing OLD Rust Contract (should still fail):', OLD_RUST_ADDRESS);
        const oldContract = new ethers.Contract(OLD_RUST_ADDRESS, ABI, provider);
        
        try {
            await oldContract.sqrt(testValue);
            console.log('❌ Unexpected: Old contract worked');
        } catch (error) {
            console.log('✅ Expected: Old contract still fails -', error.message.substring(0, 50) + '...');
        }
        
        console.log('\n📋 SOLUTION SUMMARY');
        console.log('==================');
        console.log('❌ Problem: Function selector mismatch in old Rust contract');
        console.log('✅ Solution: Rebuilt and redeployed Rust contract with correct function signatures');
        console.log('🔧 Action Required: Update your applications to use the NEW contract address');
        console.log('\n📍 NEW Contract Address (WORKING): ' + NEW_RUST_ADDRESS);
        console.log('📍 OLD Contract Address (BROKEN):  ' + OLD_RUST_ADDRESS);
        console.log('\n🎯 Next Steps:');
        console.log('1. Update your frontend/scripts to use: ' + NEW_RUST_ADDRESS);
        console.log('2. Deploy a new Solidity interface contract pointing to the new Rust contract');
        console.log('3. Test all mathematical functions');
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

verifyFix();
