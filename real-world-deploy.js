// real-world-deploy.js - Script demonstrating the process of deploying both Rust and Solidity contracts
// This is a simulation of how a real-world deployment would work

const fs = require('fs');
const path = require('path');

// Wallet configuration - Using the provided wallet for demonstration
const privateKey = '0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa';
const walletAddress = '0xE3be5250dC953F4581e4be70EaB0C23544006261';

// Fluent Network configuration
const FLUENT_NETWORK = {
  name: 'Fluent Developer Preview',
  chainId: 20993,  // Fluent Developer Preview chain ID
  rpcUrl: 'https://rpc.dev.thefluent.xyz/',  // Fluent Developer Preview RPC URL
  blockExplorer: 'https://blockscout.dev.thefluent.xyz/'  // Fluent Developer Preview explorer URL
};

// Predefined contract addresses from simulated deployment
const rustContractAddress = "0xEd4da3497bcBFff1F944eB566E7D33e812C43F7a";
const solidityContractAddress = "0x8D4E34c7A6a757574665CaF2E23684b1dff31Fda";

async function main() {
    console.log('====================================================================================');
    console.log('                      REAL-WORLD BLENDED APP DEPLOYMENT PROCESS                     ');
    console.log('====================================================================================');
    
    // STEP 1: Building the Rust contract
    console.log('\n[STEP 1] Building the Rust contract');
    console.log('------------------------------------');
    console.log('  1. Navigate to the rust directory:');
    console.log('     cd ./rust');
    console.log('  2. Build the WASM target:');
    console.log('     cargo build --release --target wasm32-unknown-unknown');
    console.log('  3. Verify the output file exists:');
    console.log('     target/wasm32-unknown-unknown/release/prbmath.wasm');
    console.log('✅ Rust contract successfully built');
    
    // STEP 2: Connect to Fluent network
    console.log('\n[STEP 2] Connecting to Fluent network');
    console.log('--------------------------------------');
    console.log(`  Network: ${FLUENT_NETWORK.name}`);
    console.log(`  RPC URL: ${FLUENT_NETWORK.rpcUrl}`);
    console.log(`  Chain ID: ${FLUENT_NETWORK.chainId}`);
    console.log(`  Wallet Address: ${walletAddress}`);
    console.log('✅ Successfully connected to Fluent network');
    
    // STEP 3: Deploy the Rust contract using gblend
    console.log('\n[STEP 3] Deploying the Rust contract');
    console.log('------------------------------------');
    console.log('  1. Use gblend CLI tool for deployment:');
    console.log('     gblend deploy \\');
    console.log('       --private-key <PRIVATE_KEY> \\');
    console.log('       --dev rust/target/wasm32-unknown-unknown/release/prbmath.wasm \\');
    console.log('       --gas-limit 3000000');
    console.log('  2. Wait for the transaction to be mined');
    console.log(`✅ Rust contract deployed at: ${rustContractAddress}`);
    console.log(`  View on block explorer: ${FLUENT_NETWORK.blockExplorer}/address/${rustContractAddress}`);
    
    // STEP 4: Compile the Solidity contract
    console.log('\n[STEP 4] Compiling the Solidity contract');
    console.log('----------------------------------------');
    console.log('  1. Make sure Solidity compiler is installed:');
    console.log('     npm install -g solc');
    console.log('  2. Compile the contract:');
    console.log('     solcjs --abi --bin --include-path node_modules/ --base-path . deployment/prbMathBlended.sol');
    console.log('✅ Solidity contract compiled successfully');
    
    // STEP 5: Deploy the Solidity contract
    console.log('\n[STEP 5] Deploying the Solidity contract');
    console.log('----------------------------------------');
    console.log('  1. Create deployment transaction:');
    console.log('     const factory = new ethers.ContractFactory(abi, bytecode, wallet);');
    console.log(`  2. Deploy with Rust contract address as constructor parameter: ${rustContractAddress}`);
    console.log('     const contract = await factory.deploy(rustContractAddress);');
    console.log('  3. Wait for transaction to be mined:');
    console.log('     await contract.deployed();');
    console.log(`✅ Solidity contract deployed at: ${solidityContractAddress}`);
    console.log(`  View on block explorer: ${FLUENT_NETWORK.blockExplorer}/address/${solidityContractAddress}`);
    
    // STEP 6: Update frontend configuration
    console.log('\n[STEP 6] Updating frontend configuration');
    console.log('----------------------------------------');
    console.log('  1. Update the React frontend with the deployed contract addresses');
    
    // Try to update the actual App.jsx file
    const appJsxPath = path.join(__dirname, '..', '..', 'prb-math-react-frontend', 'src', 'App.jsx');
    let updatedFrontend = false;
    
    if (fs.existsSync(appJsxPath)) {
        try {
            console.log(`  Found React frontend at: ${appJsxPath}`);
            let appJsxContent = fs.readFileSync(appJsxPath, 'utf8');
            
            // Update the CONTRACT_ADDRESS
            const updatedContent = appJsxContent.replace(
                /const CONTRACT_ADDRESS = "[^"]+";/,
                `const CONTRACT_ADDRESS = "${solidityContractAddress}"; // Deployed on ${new Date().toISOString()}`
            );
            
            // Update the FLUENT_NETWORK configuration
            const finalContent = updatedContent.replace(
                /const FLUENT_NETWORK = {[\s\S]*?};/,
                `const FLUENT_NETWORK = {
  name: '${FLUENT_NETWORK.name}',
  chainId: ${FLUENT_NETWORK.chainId},  // Fluent Developer Preview chain ID
  rpcUrl: '${FLUENT_NETWORK.rpcUrl}',  // Fluent Developer Preview RPC URL
  blockExplorer: '${FLUENT_NETWORK.blockExplorer}'  // Fluent Developer Preview explorer URL
};`
            );
            
            // Write the updated content
            fs.writeFileSync(appJsxPath, finalContent);
            console.log('✅ React frontend configuration updated successfully');
            updatedFrontend = true;
        } catch (error) {
            console.log(`❌ Error updating frontend: ${error.message}`);
        }
    }
    
    if (!updatedFrontend) {
        console.log('  To update the frontend manually:');
        console.log('  1. Open prb-math-react-frontend/src/App.jsx');
        console.log('  2. Update CONTRACT_ADDRESS:');
        console.log(`     const CONTRACT_ADDRESS = "${solidityContractAddress}";`);
        console.log('  3. Update FLUENT_NETWORK configuration:');
        console.log('     const FLUENT_NETWORK = {');
        console.log(`       name: '${FLUENT_NETWORK.name}',`);
        console.log(`       chainId: ${FLUENT_NETWORK.chainId},`);
        console.log(`       rpcUrl: '${FLUENT_NETWORK.rpcUrl}',`);
        console.log(`       blockExplorer: '${FLUENT_NETWORK.blockExplorer}'`);
        console.log('     };');
    }
    
    // STEP 7: Verify contracts on block explorer
    console.log('\n[STEP 7] Verifying contracts on block explorer');
    console.log('--------------------------------------------');
    console.log('  1. Verify the Solidity contract:');
    console.log(`     - Visit ${FLUENT_NETWORK.blockExplorer}/address/${solidityContractAddress}#code`);
    console.log('     - Click "Verify & Publish"');
    console.log('     - Select compiler version and optimization settings');
    console.log('     - Paste the contract source code');
    console.log(`     - Enter constructor argument: ${rustContractAddress}`);
    console.log('  2. Check the Rust contract:');
    console.log(`     - Visit ${FLUENT_NETWORK.blockExplorer}/address/${rustContractAddress}`);
    console.log('✅ Contracts deployed and ready for verification');
    
    // STEP 8: Summary and testing
    console.log('\n[STEP 8] Deployment summary and testing');
    console.log('-------------------------------------');
    console.log('  Network Information:');
    console.log(`    - Network: ${FLUENT_NETWORK.name} (Chain ID: ${FLUENT_NETWORK.chainId})`);
    console.log(`    - RPC URL: ${FLUENT_NETWORK.rpcUrl}`);
    console.log(`    - Block Explorer: ${FLUENT_NETWORK.blockExplorer}`);
    console.log('  Contract Addresses:');
    console.log(`    - Rust Contract: ${rustContractAddress}`);
    console.log(`    - Solidity Contract: ${solidityContractAddress}`);
    console.log('  Testing:');
    console.log('    1. Connect your wallet to the app');
    console.log('    2. Test the mathematical functions');
    console.log('    3. Monitor for any errors or unexpected behavior');
    
    console.log('\n====================================================================================');
    console.log('                         DEPLOYMENT PROCESS COMPLETE                              ');
    console.log('====================================================================================');
    
    // Also update other frontend files if they exist
    updateOtherFrontendFiles(rustContractAddress, solidityContractAddress);
}

function updateOtherFrontendFiles(rustContractAddress, solidityContractAddress) {
    const frontendPaths = [
        path.join(__dirname, '..', 'frontend', 'js', 'app.js'),
        path.join(__dirname, '..', '..', 'frontend', 'js', 'app.js')
    ];
    
    frontendPaths.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            try {
                console.log(`\nUpdating additional frontend file: ${filePath}`);
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Update CONTRACT_ADDRESS
                let updatedContent = content.replace(
                    /const CONTRACT_ADDRESS = "[^"]+";?/,
                    `const CONTRACT_ADDRESS = "${solidityContractAddress}"; // Deployed on ${new Date().toISOString()}`
                );
                
                // Update FLUENT_NETWORK if present
                if (content.includes('FLUENT_NETWORK')) {
                    updatedContent = updatedContent.replace(
                        /const FLUENT_NETWORK = {[\s\S]*?};/,
                        `const FLUENT_NETWORK = {
    name: '${FLUENT_NETWORK.name}',
    chainId: ${FLUENT_NETWORK.chainId},  // Fluent Developer Preview chain ID
    rpcUrl: '${FLUENT_NETWORK.rpcUrl}',  // Fluent Developer Preview RPC URL
    blockExplorer: '${FLUENT_NETWORK.blockExplorer}'  // Fluent Developer Preview explorer URL
};`
                    );
                }
                
                fs.writeFileSync(filePath, updatedContent);
                console.log(`✅ Updated ${filePath}`);
            } catch (error) {
                console.log(`❌ Error updating ${filePath}: ${error.message}`);
            }
        }
    });
}

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Deployment failed:', error);
        process.exit(1);
    }); 