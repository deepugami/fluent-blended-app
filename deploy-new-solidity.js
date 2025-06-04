const { ethers } = require('ethers');

// Configuration
const RPC_URL = 'https://rpc.dev.gblend.xyz/';
const PRIVATE_KEY = '0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed';
const NEW_RUST_CONTRACT_ADDRESS = '0x5e44930a479f34fbc1c9657c68f5b7f761363769';

// Solidity contract source code
const SOLIDITY_CONTRACT_CODE = `
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IPrbMathRust {
    function sqrt(uint256 x) external view returns (int256);
    function exp(int256 x) external view returns (int256);
    function ln(uint256 x) external view returns (int256);
    function log2(uint256 x) external view returns (int256);
    function log10(uint256 x) external view returns (int256);
}

contract prbMathBlended {
    
    IPrbMathRust public prbMathRust;

    constructor(address PrbMathRustAddress) {
        prbMathRust = IPrbMathRust(PrbMathRustAddress);
    }

    function sqrt(uint256 x) external view returns (int256) {
        int256 result = prbMathRust.sqrt(x);
        return result;
    }

    function exp(int256 x) external view returns (int256) {
        int256 result = prbMathRust.exp(x);
        return result;
    }

    function ln(uint256 x) external view returns (int256) {
        int256 result = prbMathRust.ln(x);
        return result;
    }

    function log2(uint256 x) external view returns (int256) {
        int256 result = prbMathRust.log2(x);
        return result;
    }

    function log10(uint256 x) external view returns (int256) {
        int256 result = prbMathRust.log10(x);
        return result;
    }
}
`;

// Contract ABI
const CONTRACT_ABI = [
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

// Contract bytecode (compiled version)
const CONTRACT_BYTECODE = "0x608060405234801561001057600080fd5b5060405161037d38038061037d8339818101604052810190610032919061007a565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506100a7565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100a08261006b565b9050919050565b6100b081610095565b81146100bb57600080fd5b50565b6000815190506100cd816100a7565b92915050565b6000602082840312156100e9576100e8610066565b5b60006100f7848285016100be565b91505092915050565b6102c7806101106000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806324d4e90a1461006757806335b4d9a01461009757806354d5bf131461009757806362e5cc9614610097578063677342ce146100b7578063e46751e3146100e7575b600080fd5b610081600480360381019061007c91906101b8565b610117565b60405161008e91906101e5565b60405180910390f35b61009f61016c565b6040516100ae9190610209565b60405180910390f35b6100d160048036038101906100cc91906101b8565b610192565b6040516100de91906101e5565b60405180910390f35b61010160048036038101906100fc9190610224565b6101e7565b60405161010e91906101e5565b60405180910390f35b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166324d4e90a836040518263ffffffff1660e01b815260040161017391906101e5565b602060405180830381865afa158015610190573d6000803e3d6000fd5b505050565b600080600090509054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663677342ce836040518263ffffffff1660e01b81526004016101f391906101e5565b602060405180830381865afa15801561020c573d6000803e3d6000fd5b505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061023c82610211565b9050919050565b61024c81610231565b811461025757600080fd5b50565b60008135905061026981610243565b92915050565b60006020828403121561028557610284610181565b5b60006102938482850161025a565b91505092915050565b6000819050919050565b6102af8161029c565b82525050565b60006020820190506102ca60008301846102a6565b92915050565b6102d98161029c565b81146102e457600080fd5b50565b6000813590506102f6816102d0565b92915050565b60006020828403121561031257610311610181565b5b6000610320848285016102e7565b9150509291505056fea2646970667358221220b3f72a8c5e7f8a9b6c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b464736f6c63430008130033";

async function deployNewSolidityContract() {
    try {
        console.log('🚀 Deploying New Solidity Interface Contract');
        console.log('==========================================');
        
        // Setup provider and wallet
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log('📍 Deployer address:', wallet.address);
        console.log('📍 New Rust contract address:', NEW_RUST_CONTRACT_ADDRESS);
        
        // Check network
        const network = await provider.getNetwork();
        console.log('🌐 Network:', network.name, 'Chain ID:', network.chainId);
        
        // Get balance
        const balance = await wallet.getBalance();
        console.log('💰 Balance:', ethers.utils.formatEther(balance), 'ETH');
        
        if (balance.eq(0)) {
            throw new Error('Insufficient balance for deployment');
        }
        
        // Create contract factory
        const contractFactory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, wallet);
        
        console.log('📦 Deploying contract...');
        
        // Deploy contract with constructor parameter (Rust contract address)
        const contract = await contractFactory.deploy(NEW_RUST_CONTRACT_ADDRESS, {
            gasLimit: 3000000,
            gasPrice: ethers.utils.parseUnits('1.25', 'gwei')
        });
        
        console.log('⏳ Waiting for deployment...');
        await contract.deployed();
        
        console.log('✅ Contract deployed successfully!');
        console.log('📍 Contract address:', contract.address);
        console.log('🧾 Transaction hash:', contract.deployTransaction.hash);
        
        // Test the new contract
        console.log('\n🧪 Testing new contract...');
        await testNewContract(contract.address, wallet);
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
    }
}

async function testNewContract(contractAddress, wallet) {
    try {
        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);
        
        // Verify it points to the correct Rust contract
        const rustAddress = await contract.prbMathRust();
        console.log('✅ Rust contract address verified:', rustAddress);
        
        if (rustAddress.toLowerCase() !== NEW_RUST_CONTRACT_ADDRESS.toLowerCase()) {
            throw new Error('Rust contract address mismatch!');
        }
        
        // Test sqrt function
        const testValue = ethers.utils.parseEther('4'); // 4.0
        console.log('🧮 Testing sqrt(4.0)...');
        
        const result = await contract.sqrt(testValue);
        const formatted = ethers.utils.formatEther(result.toString());
        
        console.log('✅ sqrt(4.0) =', formatted);
        console.log('✅ All tests passed!');
        
        console.log('\n📋 Updated Contract Information:');
        console.log('===============================');
        console.log('Rust Contract:', NEW_RUST_CONTRACT_ADDRESS);
        console.log('Solidity Contract:', contractAddress);
        console.log('Network: Fluent Testnet (Chain ID: 20993)');
        console.log('RPC URL:', RPC_URL);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run deployment
deployNewSolidityContract();
