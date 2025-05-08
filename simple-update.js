// simple-update.js - A minimal script to update App.jsx
const fs = require('fs');
const path = require('path');

try {
    console.log('Starting simple update script');
    
    // Contract addresses
    const rustContractAddress = "0xEd4da3497bcBFff1F944eB566E7D33e812C43F7a";
    const solidityContractAddress = "0x8D4E34c7A6a757574665CaF2E23684b1dff31Fda";
    
    // Get path to App.jsx
    const appJsxPath = path.join(__dirname, '..', '..', 'prb-math-react-frontend', 'src', 'App.jsx');
    console.log(`Looking for file at: ${appJsxPath}`);
    console.log(`File exists: ${fs.existsSync(appJsxPath)}`);
    
    if (fs.existsSync(appJsxPath)) {
        // Read the file
        const content = fs.readFileSync(appJsxPath, 'utf8');
        console.log(`File read successfully, length: ${content.length} characters`);
        
        // Update the contract address
        const updatedContent = content.replace(
            /const CONTRACT_ADDRESS = "[^"]+";/,
            `const CONTRACT_ADDRESS = "${solidityContractAddress}"; // Updated on ${new Date().toISOString()}`
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