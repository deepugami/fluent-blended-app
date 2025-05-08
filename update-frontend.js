// update-frontend.js - Script to update frontend app with deployed contract addresses
const fs = require('fs');
const path = require('path');

try {
    // Deployed contract addresses
    const rustContractAddress = "0xEd4da3497bcBFff1F944eB566E7D33e812C43F7a";
    const solidityContractAddress = "0x8D4E34c7A6a757574665CaF2E23684b1dff31Fda";
    
    // Fluent Network configuration
    const FLUENT_NETWORK = {
      name: 'Fluent Developer Preview',
      chainId: 20993,  // Fluent Developer Preview chain ID
      rpcUrl: 'https://rpc.dev.thefluent.xyz/',  // Fluent Developer Preview RPC URL
      blockExplorer: 'https://blockscout.dev.thefluent.xyz/'  // Fluent Developer Preview explorer URL
    };
    
    // Summary of deployment process
    console.log('====================================================================================');
    console.log('                              DEPLOYMENT SUMMARY                                    ');
    console.log('====================================================================================');
    console.log('Deployment of Fluent Blended App contracts has been completed.');
    console.log('\nDeployed Contracts:');
    console.log(`- Rust Contract: ${rustContractAddress}`);
    console.log(`- Solidity Contract: ${solidityContractAddress}`);
    console.log('\nNetwork Information:');
    console.log(`- Network Name: ${FLUENT_NETWORK.name}`);
    console.log(`- Chain ID: ${FLUENT_NETWORK.chainId}`);
    console.log(`- RPC URL: ${FLUENT_NETWORK.rpcUrl}`);
    console.log(`- Block Explorer: ${FLUENT_NETWORK.blockExplorer}`);
    console.log('\nUpdating frontend configuration...');
    
    // List of files to update
    const frontendFiles = [
        path.join(__dirname, '..', '..', 'prb-math-react-frontend', 'src', 'App.jsx'),
        path.join(__dirname, '..', 'frontend', 'js', 'app.js'),
        path.join(__dirname, '..', '..', 'frontend', 'js', 'app.js')
    ];
    
    console.log('Files to check:');
    frontendFiles.forEach(file => {
        console.log(`- ${file} (exists: ${fs.existsSync(file)})`);
    });
    
    // Update each file
    let updatedCount = 0;
    for (const filePath of frontendFiles) {
        if (fs.existsSync(filePath)) {
            try {
                console.log(`\nUpdating: ${filePath}`);
                const content = fs.readFileSync(filePath, 'utf8');
                console.log(`- File read successfully, length: ${content.length} characters`);
                
                // Update CONTRACT_ADDRESS
                let updatedContent = content.replace(
                    /const CONTRACT_ADDRESS = "[^"]+";/,
                    `const CONTRACT_ADDRESS = "${solidityContractAddress}"; // Deployed on ${new Date().toISOString()}`
                );
                console.log('- CONTRACT_ADDRESS replacement completed');
                
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
                    console.log('- FLUENT_NETWORK replacement completed');
                }
                
                fs.writeFileSync(filePath, updatedContent);
                console.log(`✅ Successfully updated ${filePath}`);
                updatedCount++;
            } catch (error) {
                console.log(`❌ Error updating ${filePath}: ${error.message}`);
                console.log(error.stack);
            }
        } else {
            console.log(`File does not exist: ${filePath}`);
        }
    }
    
    if (updatedCount > 0) {
        console.log(`\n✅ Updated ${updatedCount} frontend file(s)`);
    } else {
        console.log('\n❌ No frontend files were updated. Please update them manually with the following values:');
        console.log('\nIn your React frontend (App.jsx or similar):');
        console.log(`const CONTRACT_ADDRESS = "${solidityContractAddress}";`);
        console.log('\nFLUENT_NETWORK configuration:');
        console.log(`const FLUENT_NETWORK = {
  name: '${FLUENT_NETWORK.name}',
  chainId: ${FLUENT_NETWORK.chainId},
  rpcUrl: '${FLUENT_NETWORK.rpcUrl}', 
  blockExplorer: '${FLUENT_NETWORK.blockExplorer}'
};`);
    }
    
    console.log('\n====================================================================================');
    console.log('            YOUR BLENDED APP IS NOW CONFIGURED WITH DEPLOYED CONTRACTS             ');
    console.log('====================================================================================');
} catch (error) {
    console.error('Critical error in script execution:');
    console.error(error);
} 