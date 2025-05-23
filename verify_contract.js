const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Network configuration
const FLUENT_NETWORK = {
  name: 'Fluent Developer Preview',
  chainId: 20993,
  rpcUrl: 'https://rpc.dev.gblend.xyz/',
  blockExplorer: 'https://blockscout.dev.gblend.xyz/',
};

// Contract addresses
const RUST_CONTRACT_ADDRESS = '0x87b99c706e17211f313e21f1ed98782e19e91fb2';
const SOLIDITY_CONTRACT_ADDRESS = '0xAFc63F12b732701526f48E8256Ad35c888336E54';

async function verifyContractStatus() {
  console.log('=== Fluent Contract Verification Status ===\n');
  
  try {
    const provider = new ethers.providers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
    
    // Check Rust contract
    console.log('Checking Rust Contract:');
    console.log(`Address: ${RUST_CONTRACT_ADDRESS}`);
    const rustCode = await provider.getCode(RUST_CONTRACT_ADDRESS);
    console.log(`Code length: ${(rustCode.length - 2) / 2} bytes`);
    console.log(`Explorer: ${FLUENT_NETWORK.blockExplorer}address/${RUST_CONTRACT_ADDRESS}`);
    
    // Check Solidity contract
    console.log('\nChecking Solidity Contract:');
    console.log(`Address: ${SOLIDITY_CONTRACT_ADDRESS}`);
    const solCode = await provider.getCode(SOLIDITY_CONTRACT_ADDRESS);
    console.log(`Code length: ${(solCode.length - 2) / 2} bytes`);
    console.log(`Explorer: ${FLUENT_NETWORK.blockExplorer}address/${SOLIDITY_CONTRACT_ADDRESS}`);
    
    // Read contract source for verification
    const contractPath = path.join(__dirname, 'solidity', 'FluentSdkRustTypesTest.sol');
    if (fs.existsSync(contractPath)) {
      console.log('\n=== Contract Source Found ===');
      console.log(`Source file: ${contractPath}`);
      
      const contractSource = fs.readFileSync(contractPath, 'utf8');
      console.log('Contract source preview:');
      console.log(contractSource.substring(0, 300) + '...');
      
      console.log('\n=== Verification Command ===');
      console.log('To verify the Solidity contract, use:');
      console.log(`forge verify-contract \\`);
      console.log(`  ${SOLIDITY_CONTRACT_ADDRESS} \\`);
      console.log(`  FluentSdkRustTypesTest \\`);
      console.log(`  --constructor-args $(cast abi-encode "constructor(address)" ${RUST_CONTRACT_ADDRESS}) \\`);
      console.log(`  --rpc-url ${FLUENT_NETWORK.rpcUrl} \\`);
      console.log(`  --verifier blockscout \\`);
      console.log(`  --verifier-url ${FLUENT_NETWORK.blockExplorer}api/`);
    } else {
      console.log('\n❌ Contract source file not found at expected location');
    }
    
    console.log('\n=== Recommendations ===');
    console.log('1. Verify the Solidity contract using the command above');
    console.log('2. Check if both contracts are properly deployed');
    console.log('3. Test contract interactions after verification');
    
  } catch (error) {
    console.error('Error checking contracts:', error.message);
  }
}

// Function to attempt contract verification using forge
async function attemptVerification() {
  console.log('\n=== Attempting Contract Verification ===');
  
  const contractPath = path.join(__dirname, 'solidity', 'FluentSdkRustTypesTest.sol');
  
  if (!fs.existsSync(contractPath)) {
    console.log('❌ Contract source file not found. Please ensure the Solidity file exists.');
    return;
  }
  
  // Check if forge is available
  const { execSync } = require('child_process');
  try {
    execSync('forge --version', { stdio: 'pipe' });
    console.log('✅ Forge is available');
    
    // Construct verification command
    const verifyCmd = [
      'forge verify-contract',
      SOLIDITY_CONTRACT_ADDRESS,
      'FluentSdkRustTypesTest',
      `--constructor-args $(cast abi-encode "constructor(address)" ${RUST_CONTRACT_ADDRESS})`,
      `--rpc-url ${FLUENT_NETWORK.rpcUrl}`,
      '--verifier blockscout',
      `--verifier-url ${FLUENT_NETWORK.blockExplorer}api/`,
      '--show-standard-json-input'
    ].join(' \\\n  ');
    
    console.log('Verification command:');
    console.log(verifyCmd);
    console.log('\nExecuting verification...');
    
    // Note: This may require proper environment setup and private key
    console.log('⚠️  Manual verification required - please run the command above');
    
  } catch (error) {
    console.log('❌ Forge not found. Please install Foundry to verify contracts.');
    console.log('Installation: curl -L https://foundry.paradigm.xyz | bash');
  }
}

// Main execution
async function main() {
  await verifyContractStatus();
  await attemptVerification();
  
  console.log('\n=== Next Steps ===');
  console.log('1. Verify the Solidity contract using the provided command');
  console.log('2. Check the updated frontend with the new function interface');
  console.log('3. Test if contract interactions work after verification');
  console.log('4. Report results to the Fluent team');
}

main()
  .then(() => {
    console.log('\n✅ Contract verification check completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }); 