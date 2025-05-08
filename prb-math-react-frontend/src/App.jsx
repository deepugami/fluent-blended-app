import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import WalletConnection from './components/WalletConnection';
import MathFunctions from './components/MathFunctions';
import GraphVisualization from './components/GraphVisualization';
import AboutSection from './components/AboutSection';
import './styles/App.css';

// Contract ABI
const contractABI = [
  {
    "inputs": [{"internalType": "address", "name": "_rustContract", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
    "name": "log10",
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
    "inputs": [],
    "name": "rustContract",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "sqrt",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "toFixed",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "fromFixed",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  }
];

// =====================================================
// IMPORTANT: Update these values after deployment
// =====================================================
// Contract address - Deployed Solidity contract address
const CONTRACT_ADDRESS = "0x8d4e34c7a6a757574665caf2e23684b1dff31fda";

// Wallet information for deployment
const WALLET_INFO = {
  address: "0xE3be5250dC953F4581e4be70EaB0C23544006261",
  privateKey: "0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa"
};

// Fluent Network configuration
const FLUENT_NETWORK = {
  name: 'Fluent Developer Preview',
  chainId: 20993,  // Fluent Developer Preview chain ID
  rpcUrl: 'https://rpc.dev.thefluent.xyz/',  // Fluent Developer Preview RPC URL
  blockExplorer: 'https://blockscout.dev.thefluent.xyz/',  // Fluent Developer Preview explorer URL
  nativeCurrency: {
    name: 'Fluent',
    symbol: 'FLT',
    decimals: 18
  }
};
// =====================================================

// Fixed-point scale factor (10^18)
const SCALE_FACTOR = 10n ** 18n;

// Create a mock contract implementation
const createMockContract = () => {
  return {
    // Square Root implementation using Newton's method
    sqrt: async (x) => {
      // Convert to number for calculation
      const value = Number(ethers.utils.formatUnits(x, 18));
      if (value < 0) throw new Error("Cannot calculate square root of negative number");
      if (value === 0) return ethers.BigNumber.from(0);
      
      // Calculate square root
      const result = Math.sqrt(value);
      return ethers.utils.parseUnits(result.toString(), 18);
    },
    
    // Exponential function implementation
    exp: async (x) => {
      const value = Number(ethers.utils.formatUnits(x, 18));
      const result = Math.exp(value);
      return ethers.utils.parseUnits(result.toString(), 18);
    },
    
    // Natural logarithm implementation
    ln: async (x) => {
      const value = Number(ethers.utils.formatUnits(x, 18));
      if (value <= 0) throw new Error("Cannot calculate logarithm of non-positive number");
      const result = Math.log(value);
      return ethers.utils.parseUnits(result.toString(), 18);
    },
    
    // Base-10 logarithm implementation
    log10: async (x) => {
      const value = Number(ethers.utils.formatUnits(x, 18));
      if (value <= 0) throw new Error("Cannot calculate logarithm of non-positive number");
      const result = Math.log10(value);
      return ethers.utils.parseUnits(result.toString(), 18);
    },
    
    // Base-2 logarithm implementation
    log2: async (x) => {
      const value = Number(ethers.utils.formatUnits(x, 18));
      if (value <= 0) throw new Error("Cannot calculate logarithm of non-positive number");
      const result = Math.log2(value);
      return ethers.utils.parseUnits(result.toString(), 18);
    },
    
    // Mock rust contract address
    rustContract: async () => {
      return "0x0000000000000000000000000000000000000000";
    },
    
    // Convert to/from fixed-point representation
    toFixed: async (x) => x,
    fromFixed: async (x) => x
  };
};

// Function to check if Fluent network is accessible
const checkFluentNetwork = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
    await provider.getBlockNumber();
    return { isAccessible: true, message: "Fluent network is accessible" };
  } catch (error) {
    console.error("Fluent network check failed:", error);
    return { 
      isAccessible: false, 
      message: `Fluent network is currently not accessible: ${error.message || "Unknown error"}` 
    };
  }
};

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [selectedFunction, setSelectedFunction] = useState('sqrt');
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [useMock, setUseMock] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [networkConfigured, setNetworkConfigured] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({ isAccessible: false, message: "Checking Fluent network status..." });

  // Check Fluent network status on load
  useEffect(() => {
    const checkNetwork = async () => {
      const status = await checkFluentNetwork();
      setNetworkStatus(status);
      
      // If network is not accessible, use mock by default
      if (!status.isAccessible) {
        setErrorMessage(`${status.message}. Using mock implementation instead.`);
        useFallbackMock(status.message);
      }
    };
    
    checkNetwork();
    
    // Check if Fluent network is already added to MetaMask
    const checkNetworkConfiguration = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Try to switch to the Fluent network to see if it's configured
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${FLUENT_NETWORK.chainId.toString(16)}` }],
          });
          setNetworkConfigured(true);
        } catch (switchError) {
          // This error code means the chain is not added to MetaMask
          if (switchError.code === 4902) {
            setNetworkConfigured(false);
          } else {
            // Other errors mean the network is configured but not switched
            setNetworkConfigured(true);
          }
        }
      }
    };
    
    checkNetworkConfiguration();
  }, []);

  // Function to add Fluent Network to MetaMask
  const addFluentNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is not installed. Please install MetaMask first.");
      return;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${FLUENT_NETWORK.chainId.toString(16)}`,
            chainName: FLUENT_NETWORK.name,
            nativeCurrency: FLUENT_NETWORK.nativeCurrency,
            rpcUrls: [FLUENT_NETWORK.rpcUrl],
            blockExplorerUrls: [FLUENT_NETWORK.blockExplorer]
          }
        ]
      });
      
      setNetworkConfigured(true);
      alert(`${FLUENT_NETWORK.name} has been added to your MetaMask!`);
    } catch (error) {
      console.error("Error adding Fluent network to MetaMask:", error);
      alert(`Failed to add network: ${error.message}`);
    }
  };

  // Function to switch to Fluent Network in MetaMask
  const switchToFluentNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is not installed. Please install MetaMask first.");
      return;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${FLUENT_NETWORK.chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      // This error code means the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await addFluentNetwork();
          return true;
        } catch (addError) {
          console.error("Error adding chain:", addError);
          return false;
        }
      } else {
        console.error("Error switching chain:", switchError);
        return false;
      }
    }
  };

  // Function to refresh network status
  const refreshNetworkStatus = async () => {
    setErrorMessage("Checking Fluent network status...");
    const status = await checkFluentNetwork();
    setNetworkStatus(status);
    
    if (status.isAccessible) {
      setErrorMessage(`${status.message}. You can now try connecting to the Fluent network.`);
    } else {
      setErrorMessage(`${status.message}. Using mock implementation instead.`);
    }
  };

  const connectWallet = async (forceMock = false) => {
    try {
      // Clear any previous error messages
      setErrorMessage('');
      
      // Prevent multiple connection attempts
      if (connecting) return;
      
      setConnecting(true);
      setConnectionStatus('connecting');
      
      // If mock mode is explicitly requested or network is not accessible, use mock
      if (forceMock || !networkStatus.isAccessible) {
        const reason = forceMock ? "Mock mode explicitly requested" : networkStatus.message;
        useFallbackMock(reason);
        setConnecting(false);
        return;
      }
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setErrorMessage("MetaMask not installed. Please install MetaMask to connect to Fluent network.");
        useFallbackMock("MetaMask not installed");
        setConnecting(false);
        return;
      }

      // Try to switch to the Fluent network
      const networkSwitched = await switchToFluentNetwork();
      if (!networkSwitched) {
        setErrorMessage("Failed to switch to Fluent network. Please try again or switch manually in MetaMask.");
        setConnecting(false);
        return;
      }

      // Try real blockchain connection
      try {
        console.log("Attempting to connect to MetaMask and Fluent network...");
        
        // Request account access with a timeout
        const accounts = await Promise.race([
          window.ethereum.request({ method: 'eth_requestAccounts' }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 10000))
        ]);
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts returned from MetaMask");
        }
        
        const newAccount = accounts[0];
        console.log("Connected to account:", newAccount);
        setAccount(newAccount);

        // Setup ethers provider and contract
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);

        // Test contract connection with a simple call
        console.log("Testing contract connection...");
        try {
          // Wait at most 5 seconds for contract call
          await Promise.race([
            newContract.rustContract(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Contract call timeout")), 5000))
          ]);
          console.log("Contract connection successful!");
        } catch (contractError) {
          console.error("Contract connection failed:", contractError);
          setErrorMessage(`Contract connection failed: The contract at address ${CONTRACT_ADDRESS} is not responding or doesn't exist on the Fluent network. Please verify the contract is deployed correctly.`);
          throw new Error("Contract connection failed: " + contractError.message);
        }

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        setConnectionStatus('connected');
        setUseMock(false);
        console.log("Successfully connected to Fluent network");

        // Setup event listeners for wallet changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            // User disconnected wallet
            setAccount(null);
            setConnectionStatus('disconnected');
          } else {
            setAccount(accounts[0]);
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        // Check if connected to the right network
        try {
          const network = await newProvider.getNetwork();
          console.log("Connected to network with chainId:", network.chainId);
          if (network.chainId !== FLUENT_NETWORK.chainId) {
            console.warn(`Wrong network detected. Expected ${FLUENT_NETWORK.chainId}, got ${network.chainId}`);
            setErrorMessage(`Please connect to the ${FLUENT_NETWORK.name} network (ChainID: ${FLUENT_NETWORK.chainId})`);
            alert(`Please connect to the ${FLUENT_NETWORK.name} network (ChainID: ${FLUENT_NETWORK.chainId})`);
          }
        } catch (networkError) {
          console.error("Failed to check network:", networkError);
        }
      } catch (error) {
        console.warn('Error connecting to blockchain:', error.message);
        setErrorMessage(`Failed to connect to Fluent network: ${error.message}. Verify your MetaMask is connected to Fluent network and the contract is deployed.`);
        useFallbackMock(error.message);
      }
    } catch (error) {
      console.error('Error in connect process:', error);
      setErrorMessage(`Connection error: ${error.message}`);
      setConnectionStatus('error');
    } finally {
      setConnecting(false);
    }
  };

  // Toggle between real and mock modes
  const toggleMockMode = () => {
    if (useMock) {
      if (!networkStatus.isAccessible) {
        alert("Cannot connect to Fluent network. Please try refreshing the network status first.");
        return;
      }
      // Switch to real blockchain
      connectWallet(false);
    } else {
      // Switch to mock mode
      connectWallet(true);
    }
  };

  // Helper function to use mock implementation as fallback
  const useFallbackMock = (reason) => {
    console.log(`Using mock implementation. Reason: ${reason}`);
    const mockContract = createMockContract();
    setAccount("0xMockWalletAddress");
    setContract(mockContract);
    setConnectionStatus('connected');
    setUseMock(true);
  };

  const updateCalculationHistory = (functionName, input, result, duration) => {
    const newHistoryItem = {
      id: Date.now(),
      functionName,
      input,
      result,
      duration,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setCalculationHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, 9)]);
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <WalletConnection 
          connectWallet={() => connectWallet(false)}
          account={account}
          connectionStatus={connectionStatus}
          networkName={useMock ? "Mock Implementation" : FLUENT_NETWORK.name}
        />
        
        {/* Network configuration and wallet controls */}
        <div style={{
          margin: '15px auto',
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          {/* Network status banner */}
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: networkStatus.isAccessible ? '#d4edda' : '#f8d7da',
            color: networkStatus.isAccessible ? '#155724' : '#721c24'
          }}>
            <strong>Network Status:</strong> {networkStatus.message}
            <button 
              onClick={refreshNetworkStatus}
              style={{
                marginLeft: '10px',
                padding: '3px 8px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#6c757d',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>
          
          {/* Deployment Information */}
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#e2f3fc',
            color: '#0c5460',
            textAlign: 'left',
            fontSize: '14px'
          }}>
            <p style={{ margin: '0 0 5px 0' }}><strong>Deployment Info:</strong></p>
            <p style={{ margin: '0 0 5px 0' }}>Wallet Address: {WALLET_INFO.address}</p>
            <p style={{ margin: '0 0 5px 0' }}>Contract Address: {CONTRACT_ADDRESS}</p>
            <p style={{ margin: '0' }}>Network: {FLUENT_NETWORK.name} (ChainID: {FLUENT_NETWORK.chainId})</p>
          </div>
          
          {!networkConfigured && !useMock && networkStatus.isAccessible && (
            <div style={{ marginBottom: '10px' }}>
              <button 
                onClick={addFluentNetwork}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c5ce7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📡 Add Fluent Network to MetaMask
              </button>
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#666' }}>
                Click to configure MetaMask with the Fluent network settings
              </p>
            </div>
          )}
          
          {errorMessage && (
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              textAlign: 'left'
            }}>
              <strong>Connection Issue:</strong> {errorMessage}
            </div>
          )}
          
          {/* Mock mode toggle button */}
          <button 
            onClick={toggleMockMode}
            style={{
              padding: '8px 16px',
              backgroundColor: useMock ? '#f8d7da' : '#d4edda',
              color: useMock ? '#721c24' : '#155724',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {useMock 
              ? '🌐 Try Connecting to Fluent Network' 
              : '🧪 Switch to Mock Mode'}
          </button>
        </div>
        
        <MathFunctions 
          contract={contract}
          isConnected={connectionStatus === 'connected'}
          scaleFactor={SCALE_FACTOR}
          updateCalculationHistory={updateCalculationHistory}
        />
        
        {calculationHistory.length > 0 && (
          <section className="calculation-history">
            <h2>Calculation History</h2>
            <div className="history-list">
              {calculationHistory.map(item => (
                <div key={item.id} className="history-item">
                  <span className="history-function">{item.functionName}({item.input})</span>
                  <span className="history-result">{item.result}</span>
                  <span className="history-time">{item.timestamp} ({item.duration}ms)</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        <GraphVisualization 
          contract={contract}
          selectedFunction={selectedFunction}
          setSelectedFunction={setSelectedFunction}
          isConnected={connectionStatus === 'connected'}
          scaleFactor={SCALE_FACTOR}
        />
        
        <AboutSection />
      </main>
      
      <footer>
        <p>Created with Fluent Blended App technology</p>
        <p className="copyright">© 2023 PRB Math Blended</p>
        {useMock && (
          <p className="mock-notice" style={{
            color: '#856404', 
            backgroundColor: '#fff3cd',
            padding: '8px',
            borderRadius: '4px',
            margin: '10px 0'
          }}>
            Running with mock implementation (no blockchain)
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
