const { ethers } = require('ethers');

async function testContractInteraction() {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.dev.gblend.xyz/');
  
  const rustContractAddress = '0x87b99c706e17211f313e21f1ed98782e19e91fb2';
  const solidityContractAddress = '0xAFc63F12b732701526f48E8256Ad35c888336E54';
  
  // ABI for the Solidity contract
  const solidityABI = [
    {
      "inputs": [],
      "name": "getRustString",
      "outputs": [{"type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRustUint256",
      "outputs": [{"type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRustInt256",
      "outputs": [{"type": "int256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRustAddress",
      "outputs": [{"type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRustBytes",
      "outputs": [{"type": "bytes"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRustBytes32",
      "outputs": [{"type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRustBool",
      "outputs": [{"type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // ABI for the Rust contract (direct calls)
  const rustABI = [
    {
      "inputs": [],
      "name": "rustString",
      "outputs": [{"type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rustUint256",
      "outputs": [{"type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rustInt256",
      "outputs": [{"type": "int256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rustAddress",
      "outputs": [{"type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rustBytes",
      "outputs": [{"type": "bytes"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rustBytes32",
      "outputs": [{"type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rustBool",
      "outputs": [{"type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  console.log('Testing contract interactions...\n');

  // Test Rust contract directly
  console.log('=== Testing Rust Contract Directly ===');
  const rustContract = new ethers.Contract(rustContractAddress, rustABI, provider);
  
  try {
    console.log('Testing rustString()...');
    const rustString = await rustContract.rustString();
    console.log('✅ rustString():', rustString);
  } catch (error) {
    console.log('❌ rustString() failed:', error.message);
  }

  try {
    console.log('Testing rustUint256()...');
    const rustUint256 = await rustContract.rustUint256();
    console.log('✅ rustUint256():', rustUint256.toString());
  } catch (error) {
    console.log('❌ rustUint256() failed:', error.message);
  }

  try {
    console.log('Testing rustInt256()...');
    const rustInt256 = await rustContract.rustInt256();
    console.log('✅ rustInt256():', rustInt256.toString());
  } catch (error) {
    console.log('❌ rustInt256() failed:', error.message);
  }

  try {
    console.log('Testing rustAddress()...');
    const rustAddress = await rustContract.rustAddress();
    console.log('✅ rustAddress():', rustAddress);
  } catch (error) {
    console.log('❌ rustAddress() failed:', error.message);
  }

  try {
    console.log('Testing rustBytes()...');
    const rustBytes = await rustContract.rustBytes();
    console.log('✅ rustBytes():', rustBytes);
  } catch (error) {
    console.log('❌ rustBytes() failed:', error.message);
  }

  try {
    console.log('Testing rustBytes32()...');
    const rustBytes32 = await rustContract.rustBytes32();
    console.log('✅ rustBytes32():', rustBytes32);
  } catch (error) {
    console.log('❌ rustBytes32() failed:', error.message);
  }

  try {
    console.log('Testing rustBool()...');
    const rustBool = await rustContract.rustBool();
    console.log('✅ rustBool():', rustBool);
  } catch (error) {
    console.log('❌ rustBool() failed:', error.message);
  }

  console.log('\n=== Testing Solidity Contract (Cross-contract calls) ===');
  const solidityContract = new ethers.Contract(solidityContractAddress, solidityABI, provider);

  try {
    console.log('Testing getRustString()...');
    const getRustString = await solidityContract.getRustString();
    console.log('✅ getRustString():', getRustString);
  } catch (error) {
    console.log('❌ getRustString() failed:', error.message);
  }

  try {
    console.log('Testing getRustUint256()...');
    const getRustUint256 = await solidityContract.getRustUint256();
    console.log('✅ getRustUint256():', getRustUint256.toString());
  } catch (error) {
    console.log('❌ getRustUint256() failed:', error.message);
  }

  try {
    console.log('Testing getRustInt256()...');
    const getRustInt256 = await solidityContract.getRustInt256();
    console.log('✅ getRustInt256():', getRustInt256.toString());
  } catch (error) {
    console.log('❌ getRustInt256() failed:', error.message);
  }

  try {
    console.log('Testing getRustAddress()...');
    const getRustAddress = await solidityContract.getRustAddress();
    console.log('✅ getRustAddress():', getRustAddress);
  } catch (error) {
    console.log('❌ getRustAddress() failed:', error.message);
  }

  try {
    console.log('Testing getRustBytes()...');
    const getRustBytes = await solidityContract.getRustBytes();
    console.log('✅ getRustBytes():', getRustBytes);
  } catch (error) {
    console.log('❌ getRustBytes() failed:', error.message);
  }

  try {
    console.log('Testing getRustBytes32()...');
    const getRustBytes32 = await solidityContract.getRustBytes32();
    console.log('✅ getRustBytes32():', getRustBytes32);
  } catch (error) {
    console.log('❌ getRustBytes32() failed:', error.message);
  }

  try {
    console.log('Testing getRustBool()...');
    const getRustBool = await solidityContract.getRustBool();
    console.log('✅ getRustBool():', getRustBool);
  } catch (error) {
    console.log('❌ getRustBool() failed:', error.message);
  }
}

testContractInteraction()
  .then(() => {
    console.log('\n✅ Contract interaction test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }); 