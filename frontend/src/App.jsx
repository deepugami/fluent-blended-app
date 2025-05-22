import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import MathFunctions from './components/MathFunctions';
import GraphVisualization from './components/GraphVisualization';
import AboutSection from './components/AboutSection';
import './styles/App.css';

// Contract ABI
const contractABI = [
  {
    "inputs": [],
    "name": "rustString",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rustUint256",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rustInt256",
    "outputs": [{"type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rustAddress",
    "outputs": [{"type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rustBytes",
    "outputs": [{"type": "bytes"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rustBytes32",
    "outputs": [{"type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rustBool",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// =====================================================
// IMPORTANT: Update these values after deployment
// =====================================================
// Contract address - Deployed Rust contract address
const FLUENT_CONTRACT_ADDRESS = "0x87b99c706e17211f313e21f1ed98782e19e91fb2"; // Updated to match deployed Rust contract

// Network configuration
const FLUENT_NETWORK = {
  name: 'Fluent Developer Preview',
  chainId: 20993,
  rpcUrl: 'https://rpc.dev.gblend.xyz/', // Updated to use the correct RPC URL
  blockExplorer: 'https://blockscout.dev.gblend.xyz/',
  contractAddress: FLUENT_CONTRACT_ADDRESS,
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
      return "0x87b99c706e17211f313e21f1ed98782e19e91fb2";
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
      message: `${network.name} is online (Block #${blockNumber})`
    };
  } catch (error) {
    console.warn(`Failed to connect to ${network.name}:`, error.message);
    return {
      isAccessible: false,
      message: `${network.name} is not accessible: ${error.message}`
    };
  }
};

function App() {
  const [contract, setContract] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [selectedFunction, setSelectedFunction] = useState('sqrt');
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [networkStatus, setNetworkStatus] = useState({
    fluent: { isAccessible: false, message: "Checking Fluent network status..." }
  });
  const [theme, setTheme] = useState('light');

  // Theme toggle functionality
  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Check network status on component mount
  useEffect(() => {
    const checkNetworks = async () => {
      setIsLoading(true);
      try {
        const fluentStatus = await checkNetworkStatus(FLUENT_NETWORK);
        
        setNetworkStatus({
          fluent: fluentStatus
        });
        
        if (fluentStatus.isAccessible) {
          setErrorMessage(`${fluentStatus.message}. Ready to use math functions.`);
          await initializeReadOnlyMode();
        } else {
          setErrorMessage(`${fluentStatus.message}. Unable to connect to Fluent network.`);
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        setErrorMessage(`Error during initialization: ${error.message}`);
        setConnectionStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkNetworks();
  }, []);

  // Function to refresh network status
  const refreshNetworkStatus = async () => {
    setErrorMessage("Checking network status...");
    setIsLoading(true);
    
    try {
      const fluentStatus = await checkNetworkStatus(FLUENT_NETWORK);
      
      setNetworkStatus({
        fluent: fluentStatus
      });
      
      if (fluentStatus.isAccessible) {
        setErrorMessage(`${fluentStatus.message}. Ready to use math functions.`);
        await initializeReadOnlyMode();
      } else {
        setErrorMessage(`${fluentStatus.message}. Unable to connect to Fluent network.`);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error("Error refreshing network status:", error);
      setErrorMessage(`Error refreshing network status: ${error.message}`);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize read-only mode with the contract on Fluent network
  const initializeReadOnlyMode = async () => {
    try {
      // Create a read-only provider
      const provider = new ethers.providers.StaticJsonRpcProvider(
        FLUENT_NETWORK.rpcUrl,
        {
          name: FLUENT_NETWORK.name,
          chainId: FLUENT_NETWORK.chainId
        }
      );
      
      // Create a contract instance
      const contractInstance = new ethers.Contract(
        FLUENT_NETWORK.contractAddress,
        contractABI,
        provider
      );
      
      // Verify the contract by checking if it exists
      try {
        // Try to call a view function like rustString
        await contractInstance.rustString();
        
        // Contract exists, set it up
        setContract(contractInstance);
        setConnectionStatus('connected');
        console.log("Connected to contract in read-only mode");
      } catch (contractError) {
        console.log("Contract verification failed:", contractError.message);
        
        // More detailed error message for contract issues
        const detailedError = `Contract verification failed: The deployed contract at ${FLUENT_NETWORK.contractAddress} exists but there was an error calling its functions. This is likely a contract-level issue, not a connection problem.`;
        
        setErrorMessage(detailedError);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.warn('Error connecting to blockchain:', error.message);
      setErrorMessage(`Failed to connect to ${FLUENT_NETWORK.name}: ${error.message}.`);
      setConnectionStatus('disconnected');
    }
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
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      
      <Header />
      
      <main className="main-content">
        {/* Network Status */}
        <section className={`network-status-section ${isLoading ? 'loading' : ''}`}>
          <h2>Network Status</h2>
          <div className="network-status-display">
            <div className="network-badge">
              <span className={`status-indicator ${networkStatus.fluent.isAccessible ? 'online' : 'offline'}`}></span>
              <span className="network-name">Fluent Developer Preview</span>
              <span className="status-message">{networkStatus.fluent.message}</span>
            </div>
            
            <div className="network-actions">
              <button 
                className="refresh-btn" 
                onClick={refreshNetworkStatus}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Checking...
                  </>
                ) : 'Refresh Network Status'}
              </button>
            </div>
          </div>
          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          {/* Mode Information */}
          <div className="mode-info">
            <h3>Current Mode: {connectionStatus === 'connected' ? "Connected" : "Disconnected"}</h3>
            <p className="mode-description">
              {connectionStatus === 'connected' 
                ? "Connected to Fluent network. Math functions are executed on the blockchain." 
                : "Not connected to Fluent network. Please check network connectivity."}
            </p>
          </div>
        </section>
        
        {/* Math functions and visualization sections */}
        {connectionStatus === 'connected' && contract ? (
          <>
            <MathFunctions
              contract={contract}
              isConnected={true}
              scaleFactor={SCALE_FACTOR}
              updateCalculationHistory={updateCalculationHistory}
            />
            
            <GraphVisualization
              contract={contract}
              isConnected={true}
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
        ) : (
          <div className="loading-container">
            {isLoading ? (
              <>
                <div className="loading-spinner large"></div>
                <p>Initializing math functions...</p>
              </>
            ) : (
              <div className="connection-error">
                {connectionStatus === 'disconnected' && errorMessage && errorMessage.includes('Contract verification failed') ? (
                  <>
                    <h3>Contract Interaction Issue</h3>
                    <p>{errorMessage}</p>
                    <p>This is a known issue with Rust-Solidity cross-contract calls on the Fluent network.</p>
                    <div className="error-actions">
                      <a 
                        href={`${FLUENT_NETWORK.blockExplorer}address/${FLUENT_NETWORK.contractAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="explorer-link"
                      >
                        View Contract on Explorer
                      </a>
                      <button onClick={refreshNetworkStatus} className="retry-button">
                        Retry Connection
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Unable to connect to the Fluent network.</p>
                    <p>Please check network connectivity and try again.</p>
                    <button onClick={refreshNetworkStatus} className="retry-button">
                      Retry Connection
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        
        <AboutSection />
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <p>PRB Math on Fluent - Mathematical functions powered by blockchain technology</p>
          <p className="copyright">© {new Date().getFullYear()} - Built with React and Ethers.js</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

