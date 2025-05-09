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
const FLUENT_CONTRACT_ADDRESS = "0x8D4E34c7A6a757574665CaF2E23684b1dff31Fda"; // Updated to match deployed contract
// For Sepolia - this is just a placeholder, replace with actual address when deployed
const SEPOLIA_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Wallet information for deployment
const WALLET_INFO = {
  address: "0xE3be5250dC953F4581e4be70EaB0C23544006261",
  privateKey: "0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa"
};

// Network configurations
const NETWORKS = {
  fluent: {
    name: 'Fluent Developer Preview',
    chainId: 20993,
    rpcUrl: 'https://rpc.dev.thefluent.xyz/',
    blockExplorer: 'https://blockscout.dev.thefluent.xyz/',
    contractAddress: FLUENT_CONTRACT_ADDRESS,
    nativeCurrency: {
      name: 'Fluent',
      symbol: 'FLT',
      decimals: 18
    }
  },
  sepolia: {
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    blockExplorer: 'https://sepolia.etherscan.io/',
    contractAddress: SEPOLIA_CONTRACT_ADDRESS,
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'ETH',
      decimals: 18
    }
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
      return "0xEd4da3497bcBFff1F944eB566E7D33e812C43F7a";
    },
    
    // Convert to/from fixed-point representation
    toFixed: async (x) => x,
    fromFixed: async (x) => x
  };
};

// Function to check if a network is accessible
const checkNetworkStatus = async (network) => {
  try {
    console.log(`Attempting to connect to ${network.name} using RPC: ${network.rpcUrl}`);
    
    // Use StaticJsonRpcProvider with explicit network info for better reliability
    const provider = new ethers.providers.StaticJsonRpcProvider(
      network.rpcUrl,
      {
        name: network.name,
        chainId: network.chainId
      }
    );
    
    // Set a timeout for the network request
    const blockNumberPromise = provider.getBlockNumber();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    );
    
    // Race between the actual request and the timeout
    const blockNumber = await Promise.race([blockNumberPromise, timeoutPromise]);
    console.log(`Successfully connected to ${network.name}, current block: ${blockNumber}`);
    
    return { 
      isAccessible: true, 
      message: `${network.name} is accessible (block #${blockNumber})` 
    };
  } catch (error) {
    console.error(`${network.name} check failed:`, error);
    
    // Try alternative connection method
    try {
      console.log(`Trying alternative connection method for ${network.name}`);
      // Use a different provider configuration
      const fallbackProvider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      fallbackProvider.pollingInterval = 2000; // Increase polling interval
      
      const network2 = await fallbackProvider.getNetwork();
      console.log(`Alternative connection to ${network.name} successful, chain ID: ${network2.chainId}`);
      
      return { 
        isAccessible: true, 
        message: `${network.name} is accessible via alternative connection` 
      };
    } catch (fallbackError) {
      console.error(`Alternative connection to ${network.name} also failed:`, fallbackError);
      
      // Provide a more user-friendly error message
      let errorMessage = `${network.name} is currently not accessible`;
      
      if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        errorMessage += `: Connection timed out. Network may be congested or unreachable.`;
      } else if (error.code === 'SERVER_ERROR') {
        if (error.status === 401) {
          errorMessage += `: Authentication failed. Using a public RPC URL instead.`;
        } else if (!error.response) {
          errorMessage += `: Server not responding. Please try again later.`;
        } else {
          errorMessage += `: ${error.message}`;
        }
      } else {
        errorMessage += `: ${error.message}`;
      }
      
      return { 
        isAccessible: false, 
        message: errorMessage 
      };
    }
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
  const [networkStatus, setNetworkStatus] = useState({
    fluent: { isAccessible: false, message: "Checking Fluent network status..." },
    sepolia: { isAccessible: false, message: "Checking Sepolia network status..." }
  });
  // Default to Fluent network
  const [selectedNetwork, setSelectedNetwork] = useState('fluent');

  // Check network status on load
  useEffect(() => {
    const checkNetworks = async () => {
      const fluentStatus = await checkNetworkStatus(NETWORKS.fluent);
      const sepoliaStatus = await checkNetworkStatus(NETWORKS.sepolia);
      
      setNetworkStatus({
        fluent: fluentStatus,
        sepolia: sepoliaStatus
      });
    };
    
    checkNetworks();
    
    // Check if networks are already configured in MetaMask
    const checkNetworkConfiguration = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Try to switch to the selected network to see if it's configured
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${NETWORKS[selectedNetwork].chainId.toString(16)}` }],
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
  }, [selectedNetwork]);

  // Function to add the selected network to MetaMask
  const addNetworkToMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is not installed. Please install MetaMask first.");
      return;
    }
    
    const network = NETWORKS[selectedNetwork];
    
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer]
          }
        ]
      });
      
      setNetworkConfigured(true);
      alert(`${network.name} has been added to your MetaMask!`);
    } catch (error) {
      console.error(`Error adding ${network.name} to MetaMask:`, error);
      alert(`Failed to add network: ${error.message}`);
    }
  };

  // Function to switch to the selected network in MetaMask
  const switchToSelectedNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is not installed. Please install MetaMask first.");
      return false;
    }
    
    const network = NETWORKS[selectedNetwork];
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      // This error code means the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await addNetworkToMetaMask();
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
    setErrorMessage("Checking network status...");
    
    const fluentStatus = await checkNetworkStatus(NETWORKS.fluent);
    const sepoliaStatus = await checkNetworkStatus(NETWORKS.sepolia);
    
    setNetworkStatus({
      fluent: fluentStatus,
      sepolia: sepoliaStatus
    });
    
    const currentNetworkStatus = selectedNetwork === 'fluent' ? fluentStatus : sepoliaStatus;
    
    if (currentNetworkStatus.isAccessible) {
      if (selectedNetwork === 'fluent') {
        setErrorMessage(`${currentNetworkStatus.message}. You can connect to the network with deployed contracts.`);
      } else {
        setErrorMessage(`${currentNetworkStatus.message}. You can now try connecting to the network.`);
      }
    } else {
      setErrorMessage(`${currentNetworkStatus.message}. You can try a different network or use mock mode.`);
    }
  };

  // Handle network selection change
  const handleNetworkChange = (networkKey) => {
    if (connectionStatus === 'connected') {
      // Disconnect current connection before changing network
      disconnectWallet();
    }
    
    setSelectedNetwork(networkKey);
    setErrorMessage(`Selected ${NETWORKS[networkKey].name}. Please connect your wallet to continue.`);
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setConnectionStatus('disconnected');
    setUseMock(false);
  };

  const connectWallet = async (forceMock = false) => {
    try {
      // Clear any previous error messages
      setErrorMessage('');
      
      // Prevent multiple connection attempts
      if (connecting) return;
      
      setConnecting(true);
      setConnectionStatus('connecting');
      
      // If mock mode is explicitly requested, use mock implementation
      if (forceMock) {
        useFallbackMock("Mock mode explicitly requested");
        setConnecting(false);
        return;
      }
      
      // Get current network status
      const currentNetworkStatus = networkStatus[selectedNetwork];
      
      // If on Fluent network, check if contract exists at the expected address
      if (selectedNetwork === 'fluent') {
        console.log("Checking for contract existence on Fluent network...");
        // We now have contract addresses for Fluent network, no need for automatic mock mode
      }
      
      // Check if the selected network is accessible
      if (!currentNetworkStatus.isAccessible) {
        setErrorMessage(`${currentNetworkStatus.message}. Please try refreshing the network status or select a different network.`);
        setConnectionStatus('disconnected');
        setConnecting(false);
        return;
      }
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setErrorMessage("MetaMask not installed. Please install MetaMask to connect to blockchain networks.");
        setConnectionStatus('error');
        setConnecting(false);
        return;
      }

      // Try to switch to the selected network
      const networkSwitched = await switchToSelectedNetwork();
      if (!networkSwitched) {
        setErrorMessage(`Failed to switch to ${NETWORKS[selectedNetwork].name}. Please try again or switch manually in MetaMask.`);
        setConnectionStatus('error');
        setConnecting(false);
        return;
      }

      // Try real blockchain connection
      try {
        console.log(`Attempting to connect to MetaMask and ${NETWORKS[selectedNetwork].name}...`);
        
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
        const currentNetwork = NETWORKS[selectedNetwork];

        // Set provider and signer first
        setProvider(newProvider);
        setSigner(newSigner);
        
        // Create contract instance
        const newContract = new ethers.Contract(currentNetwork.contractAddress, contractABI, newSigner);

        // Test contract connection with a simple call (only for networks where contract is deployed)
        console.log("Testing contract connection...");
        try {
          // Skip contract test for Sepolia if using placeholder address
          if (selectedNetwork === 'sepolia' && currentNetwork.contractAddress === "0x0000000000000000000000000000000000000000") {
            console.log("Skipping contract test for Sepolia as contract address is not set");
            
            // Use mock for Sepolia
            console.log("Using mock implementation for Sepolia since contract is not deployed");
            const mockContract = createMockContract();
            setContract(mockContract);
            setConnectionStatus('connected');
            setUseMock(true);
            setConnecting(false);
            return;
          } else {
            console.log(`Attempting to call rustContract() on address: ${currentNetwork.contractAddress}`);
            
            // Check if contract exists at the address first
            const code = await newProvider.getCode(currentNetwork.contractAddress);
            if (code === '0x') {
              console.error(`No contract found at address ${currentNetwork.contractAddress}`);
              throw new Error(`No contract code found at address ${currentNetwork.contractAddress}`);
            }
            
            console.log(`Contract exists at ${currentNetwork.contractAddress}, bytecode length: ${code.length}`);
            
            // Validate the contract by checking for expected functions
            let isValidContract = true;
            try {
              // Try to check for each function directly via the ABI
              for (const functionName of ['sqrt', 'exp', 'ln', 'log10', 'log2']) {
                if (!newContract.functions[functionName]) {
                  console.warn(`Function ${functionName} not found in contract`);
                  isValidContract = false;
                }
              }
            } catch (validationError) {
              console.warn("Contract validation error:", validationError);
              isValidContract = false;
            }
            
            if (!isValidContract) {
              throw new Error("Contract validation failed: Missing expected functions");
            }
            
            try {
              // Attempt to call rustContract() to verify if the function works
              // but don't make this a blocking call
              const rustContractPromise = newContract.rustContract();
              const rustContractResult = await Promise.race([
                rustContractPromise,
                new Promise((_, reject) => setTimeout(() => {
                  // Don't reject, just log that we're continuing without verification
                  console.log("rustContract() call timed out, continuing anyway");
                  return null;
                }, 5000))
              ]);
              
              if (rustContractResult) {
                console.log("Contract connection successful! Rust contract address:", rustContractResult);
              }
              
              // Set the contract and continue regardless
              setContract(newContract);
              setConnectionStatus('connected');
              setUseMock(false);
              console.log(`Successfully connected to ${currentNetwork.name}`);
              
              // Setup event listeners for wallet changes
              window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                  // User disconnected wallet
                  disconnectWallet();
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
                if (network.chainId !== currentNetwork.chainId) {
                  console.warn(`Wrong network detected. Expected ${currentNetwork.chainId}, got ${network.chainId}`);
                  setErrorMessage(`Please connect to the ${currentNetwork.name} network (ChainID: ${currentNetwork.chainId})`);
                  alert(`Please connect to the ${currentNetwork.name} network (ChainID: ${currentNetwork.chainId})`);
                }
              } catch (networkError) {
                console.error("Failed to check network:", networkError);
              }
            } catch (callError) {
              console.error("Contract method call error:", callError);
              
              // Continue with a warning but use the contract instance anyway
              setErrorMessage(`Warning: The contract at ${currentNetwork.contractAddress} didn't respond correctly to the rustContract() call. Some functions may not work properly.`);
              
              // Set the contract anyway and try to use it
              setContract(newContract);
              setConnectionStatus('connected');
              setUseMock(false);
              
              // Setup event listeners for wallet changes
              window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                  // User disconnected wallet
                  disconnectWallet();
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
                if (network.chainId !== currentNetwork.chainId) {
                  console.warn(`Wrong network detected. Expected ${currentNetwork.chainId}, got ${network.chainId}`);
                  setErrorMessage(`Please connect to the ${currentNetwork.name} network (ChainID: ${currentNetwork.chainId})`);
                  alert(`Please connect to the ${currentNetwork.name} network (ChainID: ${currentNetwork.chainId})`);
                }
              } catch (networkError) {
                console.error("Failed to check network:", networkError);
              }
            }
          }
        } catch (contractError) {
          console.error("Contract connection failed:", contractError);
          
          // Fall back to mock mode since contract verification failed
          console.log("Falling back to mock mode due to contract verification failure");
          setErrorMessage(`Contract verification failed: ${contractError.message}. Falling back to No-Blockchain Mode.`);
          
          // Use mock implementation
          useFallbackMock("Contract verification failed");
        }
      } catch (error) {
        console.warn('Error connecting to blockchain:', error.message);
        setErrorMessage(`Failed to connect to ${NETWORKS[selectedNetwork].name}: ${error.message}. Verify your MetaMask is connected to the correct network and the contract is deployed.`);
        setConnectionStatus('error');
        setConnecting(false);
      }
    } catch (error) {
      console.error('Error in connect process:', error);
      setErrorMessage(`Connection error: ${error.message}`);
      setConnectionStatus('error');
      setConnecting(false);
    } finally {
      setConnecting(false);
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
        {/* Network and Connection Controls */}
        <div className="network-selection-container">
          <div className="network-controls">
            <h2>Network Selection</h2>
            <div className="network-options">
              <div className="network-option">
                <input 
                  type="radio" 
                  id="fluent-network" 
                  name="network" 
                  value="fluent" 
                  checked={selectedNetwork === 'fluent'} 
                  onChange={() => handleNetworkChange('fluent')} 
                />
                <label htmlFor="fluent-network">
                  <span className={`status-indicator ${networkStatus.fluent.isAccessible ? 'online' : 'offline'}`}></span>
                  Fluent Developer Preview
                </label>
              </div>
              <div className="network-option">
                <input 
                  type="radio" 
                  id="sepolia-network" 
                  name="network" 
                  value="sepolia" 
                  checked={selectedNetwork === 'sepolia'} 
                  onChange={() => handleNetworkChange('sepolia')} 
                />
                <label htmlFor="sepolia-network">
                  <span className={`status-indicator ${networkStatus.sepolia.isAccessible ? 'online' : 'offline'}`}></span>
                  Ethereum Sepolia
                </label>
              </div>
            </div>
            <div className="network-actions">
              <button 
                className="refresh-btn" 
                onClick={refreshNetworkStatus}
              >
                Refresh Network Status
              </button>
              {!networkConfigured && (
                <button 
                  className="add-network-btn" 
                  onClick={addNetworkToMetaMask}
                >
                  Add Network to MetaMask
                </button>
              )}
              <button 
                className="mock-mode-btn" 
                onClick={() => useFallbackMock("Manually activated")}
                disabled={connectionStatus === 'connected' && useMock}
              >
                Use No-Blockchain Mode
              </button>
            </div>
          </div>
          
          <WalletConnection 
            connectWallet={() => connectWallet(false)}
            account={account}
            connectionStatus={connectionStatus}
            networkName={useMock ? "No-Blockchain Mode" : NETWORKS[selectedNetwork].name}
          />
        </div>
        
        {/* Network status and error messages */}
        <div className="status-container">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="network-status">
            {selectedNetwork && (
              <div className={`status-badge ${networkStatus[selectedNetwork].isAccessible ? 'success' : 'error'}`}>
                {networkStatus[selectedNetwork].message}
              </div>
            )}
          </div>
        </div>
        
        {/* Connection Information */}
        {connectionStatus === 'connected' && (
          <div className="connection-info-container">
            <div className="info-box">
              <h3>Connection Information</h3>
              <p>Mode: {useMock ? "No-Blockchain Mode" : "Blockchain Connected"}</p>
              <p>Network: {useMock ? "Local Simulation" : NETWORKS[selectedNetwork].name}</p>
              <p>Wallet: {account}</p>
              {useMock && (
                <p className="mock-notice">
                  Using local math implementations. Results are calculated in-browser without blockchain interaction.
                </p>
              )}
              {connectionStatus === 'connected' && !useMock && (
                <button 
                  className="disconnect-btn" 
                  onClick={disconnectWallet}
                >
                  Disconnect Wallet
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Math functions remain the same */}
        {connectionStatus === 'connected' && contract && (
          <>
            <MathFunctions
              contract={contract}
              isConnected={connectionStatus === 'connected'}
              scaleFactor={SCALE_FACTOR}
              updateCalculationHistory={updateCalculationHistory}
            />
            
            <GraphVisualization
              contract={contract}
              isConnected={connectionStatus === 'connected'}
              selectedFunction={selectedFunction}
              setSelectedFunction={setSelectedFunction}
            />
            
            <div className="calculation-history">
              <h2>Calculation History</h2>
              {calculationHistory.length > 0 ? (
                <ul>
                  {calculationHistory.map(item => (
                    <li key={item.id}>
                      <span className="timestamp">{item.timestamp}</span>
                      <span className="function-name">{item.functionName}({item.input})</span>
                      <span className="result">{item.result}</span>
                      <span className="duration">{item.duration}ms</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-history">No calculations performed yet.</p>
              )}
            </div>
          </>
        )}
        
        <AboutSection />
      </main>
    </div>
  );
}

export default App;

