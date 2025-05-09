// fix-checksums.js - Script to fix Ethereum address format issues
const fs = require('fs');
const path = require('path');

try {
    console.log('Starting address format fix script');
    
    // Use lowercase addresses which are always valid in Ethereum
    const rustContractAddress = "0xaf3d76b5294c82c080c93b4c964cdf6a15f29d1e";
    const solidityContractAddress = "0x2ed29d982b0120d49899a7cc7afe7f5d5435bc56";
    
    console.log('Using lowercase addresses to avoid checksum issues:');
    console.log(`- Rust Contract: ${rustContractAddress}`);
    console.log(`- Solidity Contract: ${solidityContractAddress}`);
    
    // Get path to App.jsx
    const appJsxPath = path.join(__dirname, 'prb-math-react-frontend', 'src', 'App.jsx');
    console.log(`\nUpdating file: ${appJsxPath}`);
    
    if (fs.existsSync(appJsxPath)) {
        // Read the file
        const content = fs.readFileSync(appJsxPath, 'utf8');
        
        // Update the Solidity contract address
        let updatedContent = content.replace(
            /const FLUENT_CONTRACT_ADDRESS = "[^"]+";/,
            `const FLUENT_CONTRACT_ADDRESS = "${solidityContractAddress}";`
        );
        
        // Update the mock contract's rustContract function
        updatedContent = updatedContent.replace(
            /rustContract: async \(\) => {\s*return "[^"]+";/,
            `rustContract: async () => {\n      return "${rustContractAddress}";`
        );
        
        // Write the file
        fs.writeFileSync(appJsxPath, updatedContent);
        console.log(`✅ Successfully updated contract addresses in App.jsx`);
    } else {
        console.log(`❌ File not found: ${appJsxPath}`);
    }
    
    // Also update update-frontend.js
    const updateFrontendPath = path.join(__dirname, 'update-frontend.js');
    console.log(`\nUpdating file: ${updateFrontendPath}`);
    
    if (fs.existsSync(updateFrontendPath)) {
        const content = fs.readFileSync(updateFrontendPath, 'utf8');
        
        // Update both contract addresses
        let updatedContent = content.replace(
            /const rustContractAddress = "[^"]+";/,
            `const rustContractAddress = "${rustContractAddress}";`
        );
        
        updatedContent = updatedContent.replace(
            /const solidityContractAddress = "[^"]+";/,
            `const solidityContractAddress = "${solidityContractAddress}";`
        );
        
        fs.writeFileSync(updateFrontendPath, updatedContent);
        console.log(`✅ Successfully updated contract addresses in update-frontend.js`);
    } else {
        console.log(`❌ File not found: ${updateFrontendPath}`);
    }
    
    // Update real-world-deploy.js
    const realDeployPath = path.join(__dirname, 'real-world-deploy.js');
    console.log(`\nUpdating file: ${realDeployPath}`);
    
    if (fs.existsSync(realDeployPath)) {
        const content = fs.readFileSync(realDeployPath, 'utf8');
        
        // Update both contract addresses
        let updatedContent = content.replace(
            /const rustContractAddress = "[^"]+";/,
            `const rustContractAddress = "${rustContractAddress}";`
        );
        
        updatedContent = updatedContent.replace(
            /const solidityContractAddress = "[^"]+";/,
            `const solidityContractAddress = "${solidityContractAddress}";`
        );
        
        fs.writeFileSync(realDeployPath, updatedContent);
        console.log(`✅ Successfully updated contract addresses in real-world-deploy.js`);
    } else {
        console.log(`❌ File not found: ${realDeployPath}`);
    }
    
    // Update DEPLOYMENT_INSTRUCTIONS.md
    const deploymentInstructionsPath = path.join(__dirname, 'prb-math-react-frontend', 'DEPLOYMENT_INSTRUCTIONS.md');
    console.log(`\nUpdating file: ${deploymentInstructionsPath}`);
    
    if (fs.existsSync(deploymentInstructionsPath)) {
        const content = fs.readFileSync(deploymentInstructionsPath, 'utf8');
        
        // Update both contract addresses in the markdown file
        let updatedContent = content.replace(
            /- \*\*Solidity Contract\*\*: `[^`]+`/,
            `- **Solidity Contract**: \`${solidityContractAddress}\``
        );
        
        updatedContent = updatedContent.replace(
            /- \*\*Rust Contract\*\*: `[^`]+`/,
            `- **Rust Contract**: \`${rustContractAddress}\``
        );
        
        fs.writeFileSync(deploymentInstructionsPath, updatedContent);
        console.log(`✅ Successfully updated contract addresses in DEPLOYMENT_INSTRUCTIONS.md`);
    } else {
        console.log(`❌ File not found: ${deploymentInstructionsPath}`);
    }
    
    console.log('\n✅ All files have been updated with lowercase addresses');
} catch (error) {
    console.error('Error:', error);
} 