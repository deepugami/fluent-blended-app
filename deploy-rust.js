const { exec } = require('child_process');
const path = require('path');

// Configuration
const PRIVATE_KEY = "0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed";
const RPC_URL = "https://rpc.dev.gblend.xyz/";

async function deployRustContract() {
    console.log('🚀 Deploying Fixed Rust Contract');
    console.log('===============================');
    
    try {
        // Change to rust directory
        const rustDir = path.join(__dirname, 'rust');
        process.chdir(rustDir);
        console.log('📁 Changed to directory:', rustDir);
        
        // Check if WASM file exists
        const wasmPath = path.join(rustDir, 'target', 'wasm32-unknown-unknown', 'release', 'prb_math_blended.wasm');
        console.log('📦 Looking for WASM file at:', wasmPath);
        
        // Deploy the contract using gblend CLI
        const deployCommand = `gblend deploy --private-key ${PRIVATE_KEY} --dev target/wasm32-unknown-unknown/release/prb_math_blended.wasm --gas-limit 3000000 --rpc-url ${RPC_URL}`;
        
        console.log('🔧 Executing deployment command...');
        console.log('Command:', deployCommand.replace(PRIVATE_KEY, 'PRIVATE_KEY_HIDDEN'));
        
        exec(deployCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Deployment failed:', error.message);
                return;
            }
            
            if (stderr) {
                console.error('⚠️ Deployment warnings:', stderr);
            }
            
            console.log('✅ Deployment output:');
            console.log(stdout);
            
            // Extract contract address from output (gblend usually outputs it)
            const addressMatch = stdout.match(/0x[a-fA-F0-9]{40}/);
            if (addressMatch) {
                const contractAddress = addressMatch[0];
                console.log('\n🎉 CONTRACT DEPLOYED SUCCESSFULLY!');
                console.log('==================================');
                console.log('📍 New Rust Contract Address:', contractAddress);
                console.log('🌐 Network: Fluent Testnet (Chain ID: 20993)');
                console.log('🔗 RPC URL:', RPC_URL);
                console.log('');
                console.log('🔧 Next Steps:');
                console.log('1. Test the new contract with test-rust-contract.js');
                console.log('2. Update your frontend and applications to use this address');
                console.log('3. Deploy a new Solidity interface contract pointing to this Rust contract');
                console.log('');
                console.log('🧪 Test Command:');
                console.log(`node test-new-rust.js`);
            }
        });
        
    } catch (error) {
        console.error('❌ Error during deployment:', error.message);
    }
}

// Alternative method using direct command execution
async function checkDeploymentPrerequisites() {
    console.log('🔍 Checking deployment prerequisites...');
    
    // Check if gblend is installed
    exec('gblend --version', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ gblend CLI not found. Installing...');
            console.log('📥 Run: cargo install gblend');
            console.log('');
            
            // Try installing gblend
            exec('cargo install gblend', (installError, installStdout, installStderr) => {
                if (installError) {
                    console.error('❌ Failed to install gblend:', installError.message);
                    console.log('');
                    console.log('🔧 Manual installation required:');
                    console.log('1. Install Rust if not already installed');
                    console.log('2. Run: cargo install gblend');
                    console.log('3. Try deployment again');
                } else {
                    console.log('✅ gblend installed successfully');
                    console.log(installStdout);
                    deployRustContract();
                }
            });
        } else {
            console.log('✅ gblend CLI found:', stdout.trim());
            deployRustContract();
        }
    });
}

// Manual deployment instructions
function showManualDeploymentInstructions() {
    console.log('📖 Manual Deployment Instructions');
    console.log('================================');
    console.log('');
    console.log('If automatic deployment fails, follow these steps:');
    console.log('');
    console.log('1. Install gblend CLI:');
    console.log('   cargo install gblend');
    console.log('');
    console.log('2. Build the Rust contract:');
    console.log('   cd rust');
    console.log('   cargo build --target wasm32-unknown-unknown --release');
    console.log('');
    console.log('3. Deploy the contract:');
    console.log(`   gblend deploy \\`);
    console.log(`     --private-key ${PRIVATE_KEY} \\`);
    console.log(`     --dev target/wasm32-unknown-unknown/release/prb_math_blended.wasm \\`);
    console.log(`     --gas-limit 3000000 \\`);
    console.log(`     --rpc-url ${RPC_URL}`);
    console.log('');
    console.log('4. Note the deployed contract address for testing');
}

// Run the deployment
console.log('🚀 Starting Rust Contract Deployment Process');
console.log('===========================================');

// First check prerequisites
checkDeploymentPrerequisites();

// Show manual instructions as backup
setTimeout(() => {
    console.log('');
    showManualDeploymentInstructions();
}, 5000);
