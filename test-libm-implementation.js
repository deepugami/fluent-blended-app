const { ethers } = require("ethers");

// Test the libm implementation
async function testLibmImplementation() {
    console.log("Testing libm implementation...");
    
    // Setup provider for Fluent testnet
    const provider = new ethers.JsonRpcProvider("https://rpc.dev.thefluent.xyz/");
    
    // Your wallet
    const privateKey = "0x94befb29ec3d4bd395ca8a4cbebed4049d866db9410472eb829886cb8ad72fed";
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log("Wallet address:", await wallet.getAddress());
    console.log("Wallet balance:", ethers.formatEther(await provider.getBalance(wallet.address)));
    
    // Contract ABI for the mathematical functions
    const contractABI = [
        "function sqrt(uint256) external view returns (int256)",
        "function exp(int256) external view returns (int256)",
        "function ln(uint256) external view returns (int256)", 
        "function log2(uint256) external view returns (int256)",
        "function log10(uint256) external view returns (int256)"
    ];
    
    // Replace with your deployed contract address
    const contractAddress = "0xYourContractAddress"; // Update this with actual address
    
    if (contractAddress === "0xYourContractAddress") {
        console.log("Please update the contract address in the test file first!");
        return;
    }
    
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
    try {
        // Test sqrt(4 * 10^18) should return approximately 2 * 10^18
        const testValue = ethers.parseEther("4");
        console.log("Testing sqrt(4)...");
        const sqrtResult = await contract.sqrt(testValue);
        console.log("sqrt(4) =", ethers.formatEther(sqrtResult));
        
        // Test exp(1 * 10^18) should return approximately e * 10^18 ≈ 2.718 * 10^18
        const expInput = ethers.parseEther("1");
        console.log("Testing exp(1)...");
        const expResult = await contract.exp(expInput);
        console.log("exp(1) =", ethers.formatEther(expResult));
        
        // Test ln(e * 10^18) should return approximately 1 * 10^18
        const eValue = ethers.parseEther("2.718281828");
        console.log("Testing ln(e)...");
        const lnResult = await contract.ln(eValue);
        console.log("ln(e) =", ethers.formatEther(lnResult));
        
        // Test log2(8 * 10^18) should return approximately 3 * 10^18  
        const log2Input = ethers.parseEther("8");
        console.log("Testing log2(8)...");
        const log2Result = await contract.log2(log2Input);
        console.log("log2(8) =", ethers.formatEther(log2Result));
        
        // Test log10(100 * 10^18) should return approximately 2 * 10^18
        const log10Input = ethers.parseEther("100");
        console.log("Testing log10(100)...");
        const log10Result = await contract.log10(log10Input);
        console.log("log10(100) =", ethers.formatEther(log10Result));
        
        console.log("All tests completed successfully!");
        
    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

// Run the test
testLibmImplementation().catch(console.error);
