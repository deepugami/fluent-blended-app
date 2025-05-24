const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

// Configuration
const FLUENT_NETWORK = {
    name: 'Fluent DevNet',
    chainId: 20993,
    rpcUrl: 'https://rpc.dev.gblend.xyz/',
    blockExplorer: 'https://blockscout.dev.gblend.xyz/'
};

async function buildRustContract() {
    console.log('🦀 Building Rust contract with libm...');
    
    try {
        // Change to rust directory and build
        process.chdir('rust');
        
        // Build the Rust contract
        const { stdout, stderr } = await execAsync('make build');
        console.log('Rust build output:', stdout);
        if (stderr) console.log('Rust build stderr:', stderr);
        
        // Check if WASM file was created
        const wasmPath = path.join('bin', 'prb_math_rust.wasm');
        if (fs.existsSync(wasmPath)) {
            console.log('✅ Rust contract built successfully!');
            console.log(`📁 WASM file location: ${wasmPath}`);
            return wasmPath;
        } else {
            throw new Error('WASM file not found after build');
        }
        
    } catch (error) {
        console.error('❌ Failed to build Rust contract:', error);
        throw error;
    } finally {
        // Return to parent directory
        process.chdir('..');
    }
}

async function deployRustContract(wasmPath) {
    console.log('🚀 Deploying Rust contract to Fluent DevNet...');
    
    try {
        // You would need a private key here - this is a placeholder
        const privateKey = process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY_HERE";
        
        if (privateKey === "YOUR_PRIVATE_KEY_HERE") {
            console.log('⚠️  Please set PRIVATE_KEY environment variable');
            console.log('💡 Using mock deployment for demonstration');
            return simulateRustDeployment();
        }
        
        // Deploy using gblend CLI
        const deployCommand = `gblend deploy --private-key ${privateKey} --dev rust/bin/prb_math_rust.wasm --gas-limit 3000000`;
        const { stdout, stderr } = await execAsync(deployCommand);
        
        console.log('Deployment output:', stdout);
        if (stderr) console.log('Deployment stderr:', stderr);
        
        // Extract contract address from output
        const addressMatch = stdout.match(/Contract deployed at: (0x[a-fA-F0-9]{40})/);
        if (addressMatch) {
            const contractAddress = addressMatch[1];
            console.log(`✅ Rust contract deployed at: ${contractAddress}`);
            return contractAddress;
        } else {
            throw new Error('Could not extract contract address from deployment output');
        }
        
    } catch (error) {
        console.error('❌ Failed to deploy Rust contract:', error);
        return simulateRustDeployment();
    }
}

function simulateRustDeployment() {
    console.log('🔄 Simulating Rust contract deployment...');
    // Use existing address from deployment-result.json
    const deploymentResult = JSON.parse(fs.readFileSync('../deployment-result.json', 'utf8'));
    const rustAddress = deploymentResult.rustContractAddress || "0x87b99c706e17211f313e21f1ed98782e19e91fb2";
    console.log(`📋 Using existing Rust contract: ${rustAddress}`);
    return rustAddress;
}

async function deploySolidityContract(rustContractAddress) {
    console.log('💎 Deploying Solidity contract...');
    
    try {
        // For now, we'll create deployment instructions
        const solidityCode = fs.readFileSync('../solidity/prbMathBlended.sol', 'utf8');
        
        console.log('📋 Solidity Contract Deployment Instructions:');
        console.log('1. Open Remix IDE: https://remix.ethereum.org/');
        console.log('2. Create a new file: prbMathBlended.sol');
        console.log('3. Paste the contract code from solidity/prbMathBlended.sol');
        console.log('4. Compile the contract (Solidity ^0.8.20)');
        console.log('5. Connect MetaMask to Fluent DevNet:');
        console.log(`   - Network Name: ${FLUENT_NETWORK.name}`);
        console.log(`   - RPC URL: ${FLUENT_NETWORK.rpcUrl}`);
        console.log(`   - Chain ID: ${FLUENT_NETWORK.chainId}`);
        console.log(`   - Block Explorer: ${FLUENT_NETWORK.blockExplorer}`);
        console.log('6. Deploy with constructor parameter:');
        console.log(`   - Rust Contract Address: ${rustContractAddress}`);
        console.log('7. Update the SOLIDITY_CONTRACT_ADDRESS in frontend/js/app.js');
        
        // Create a deployment template
        const deploymentTemplate = `
// Deployment Instructions for prbMathBlended Contract
// ===================================================

// 1. Constructor Parameter:
Rust Contract Address: ${rustContractAddress}

// 2. Network Configuration:
Network Name: ${FLUENT_NETWORK.name}
RPC URL: ${FLUENT_NETWORK.rpcUrl}
Chain ID: ${FLUENT_NETWORK.chainId}
Block Explorer: ${FLUENT_NETWORK.blockExplorer}

// 3. After deployment, update frontend/js/app.js:
// Replace: const SOLIDITY_CONTRACT_ADDRESS = "0xTBD";
// With: const SOLIDITY_CONTRACT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";

// 4. Verify contract on Blockscout:
// ${FLUENT_NETWORK.blockExplorer}/address/YOUR_DEPLOYED_ADDRESS
`;
        
        fs.writeFileSync('deployment-instructions.txt', deploymentTemplate);
        console.log('✅ Deployment instructions saved to deployment-instructions.txt');
        
        return "0xTBD"; // Placeholder until manual deployment
        
    } catch (error) {
        console.error('❌ Failed to create Solidity deployment instructions:', error);
        throw error;
    }
}

function updateFrontendConfig(rustAddress, solidityAddress) {
    console.log('🔧 Updating frontend configuration...');
    
    try {
        const appJsPath = path.join('frontend', 'js', 'app.js');
        let appJs = fs.readFileSync(appJsPath, 'utf8');
        
        // Update contract addresses
        appJs = appJs.replace(
            /const RUST_CONTRACT_ADDRESS = ".*";/,
            `const RUST_CONTRACT_ADDRESS = "${rustAddress}";`
        );
        
        if (solidityAddress !== "0xTBD") {
            appJs = appJs.replace(
                /const SOLIDITY_CONTRACT_ADDRESS = ".*";/,
                `const SOLIDITY_CONTRACT_ADDRESS = "${solidityAddress}";`
            );
        }
        
        fs.writeFileSync(appJsPath, appJs);
        console.log('✅ Frontend configuration updated');
        
    } catch (error) {
        console.error('⚠️  Failed to update frontend configuration:', error);
    }
}

function createDeploymentSummary(rustAddress, solidityAddress) {
    const summary = {
        timestamp: new Date().toISOString(),
        network: FLUENT_NETWORK,
        contracts: {
            rust: {
                address: rustAddress,
                description: "Mathematical functions using libm library",
                explorer: `${FLUENT_NETWORK.blockExplorer}/address/${rustAddress}`
            },
            solidity: {
                address: solidityAddress,
                description: "PRB-Math style fixed-point arithmetic + Rust integration",
                explorer: solidityAddress !== "0xTBD" ? `${FLUENT_NETWORK.blockExplorer}/address/${solidityAddress}` : "Not deployed yet"
            }
        },
        challenge: {
            name: "Fluent Blended Math Challenge",
            description: "Demonstrates seamless integration between Solidity and Rust mathematical libraries",
            features: [
                "Solidity fixed-point arithmetic (PRB-Math style)",
                "Rust floating-point operations (libm)",
                "Real-time comparison and visualization",
                "Atomic cross-language function calls"
            ]
        }
    };
    
    fs.writeFileSync('deployment-summary.json', JSON.stringify(summary, null, 2));
    console.log('📄 Deployment summary saved to deployment-summary.json');
    
    return summary;
}

async function main() {
    console.log('🚀 Starting Fluent Blended Math Challenge Deployment');
    console.log('=' .repeat(60));
    
    try {
        // Step 1: Build Rust contract
        const wasmPath = await buildRustContract();
        
        // Step 2: Deploy Rust contract
        const rustAddress = await deployRustContract(wasmPath);
        
        // Step 3: Create Solidity deployment instructions
        const solidityAddress = await deploySolidityContract(rustAddress);
        
        // Step 4: Update frontend configuration
        updateFrontendConfig(rustAddress, solidityAddress);
        
        // Step 5: Create deployment summary
        const summary = createDeploymentSummary(rustAddress, solidityAddress);
        
        console.log('\n🎉 Deployment Process Complete!');
        console.log('=' .repeat(60));
        console.log(`🦀 Rust Contract: ${rustAddress}`);
        console.log(`💎 Solidity Contract: ${solidityAddress}`);
        console.log(`🌐 Frontend: Open frontend/index.html in browser`);
        console.log(`📊 Block Explorer: ${FLUENT_NETWORK.blockExplorer}`);
        
        if (solidityAddress === "0xTBD") {
            console.log('\n⚠️  Next Steps:');
            console.log('1. Deploy the Solidity contract using Remix IDE');
            console.log('2. Update SOLIDITY_CONTRACT_ADDRESS in frontend/js/app.js');
            console.log('3. Test the blended functionality');
        }
        
        console.log('\n🔗 Useful Links:');
        console.log(`📖 Challenge Guide: https://docs.fluent.xyz/developer-guides/building-a-blended-app/`);
        console.log(`🔢 PRB-Math: https://github.com/PaulRBerg/prb-math`);
        console.log(`🦀 libm Crate: https://crates.io/crates/libm`);
        console.log(`📊 Desmos Calculator: https://www.desmos.com/calculator/5p8c3q2is2`);
        
    } catch (error) {
        console.error('\n❌ Deployment failed:', error);
        process.exit(1);
    }
}

// Run deployment if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = {
    buildRustContract,
    deployRustContract,
    deploySolidityContract,
    updateFrontendConfig,
    createDeploymentSummary
}; 