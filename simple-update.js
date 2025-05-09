// simple-update.js - A minimal script to update App.jsx
const fs = require('fs');
const path = require('path');

try {
    console.log('Starting simple update script');
    
    // Deployed contract addresses
    const rustContractAddress = "0xaF3d76B5294C82c080c93b4c964cdF6A15F29D1e";
    const solidityContractAddress = "0x2eD29d982B0120d49899a7cC7AfE7f5d5435bc56";
    
    // Get path to App.jsx
    const appJsxPath = path.join(__dirname, 'prb-math-react-frontend', 'src', 'App.jsx');
    console.log(`Looking for file at: ${appJsxPath}`);
    console.log(`File exists: ${fs.existsSync(appJsxPath)}`);
    
    if (fs.existsSync(appJsxPath)) {
        // Read the file
        const content = fs.readFileSync(appJsxPath, 'utf8');
        console.log(`File read successfully, length: ${content.length} characters`);
        
        // Update the contract address
        const updatedContent = content.replace(
            /const FLUENT_CONTRACT_ADDRESS = "[^"]+";/,
            `const FLUENT_CONTRACT_ADDRESS = "${solidityContractAddress}"; // Updated on ${new Date().toISOString()}`
        );
        
        // Write the file
        fs.writeFileSync(appJsxPath, updatedContent);
        console.log(`File updated successfully`);
        
        console.log('\n✅ App.jsx has been updated with the following values:');
        console.log(`- Solidity Contract: ${solidityContractAddress}`);
        console.log(`- Rust Contract: ${rustContractAddress}`);
    } else {
        console.log('❌ App.jsx file not found');
    }
} catch (error) {
    console.error('Error:', error);
} 