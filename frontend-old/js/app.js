// Contract ABI for the prbMathBlended contract
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
    },
    {
        "inputs": [{"internalType": "string", "name": "message", "type": "string"}],
        "name": "MathError",
        "type": "error"
    }
];

// Contract deployment information
const CONTRACT_ADDRESS = "0x8D4E34c7A6a757574665CaF2E23684b1dff31Fda";

// Fluent Network configuration
const FLUENT_NETWORK = {
  name: 'Fluent Developer Preview',
  chainId: 20993,
  rpcUrl: 'https://rpc.dev.thefluent.xyz/',
  blockExplorer: 'https://blockscout.dev.thefluent.xyz/'
};

// Global variables
let provider;
let readOnlyProvider;
let contract;
let readOnlyContract;
let signer;
let connectedAccount = null;
let chart;
let isCalculating = false;
let contractCallHistory = [];

// Fixed-point scale factor (10^18)
const SCALE_FACTOR = BigInt(10) ** BigInt(18);

// Initialize the application when DOM content is loaded
document.addEventListener('DOMContentLoaded', initialize);

async function initialize() {
    // Set up event listeners
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.querySelectorAll('.calculate-btn').forEach(button => {
        button.addEventListener('click', handleCalculation);
    });
    document.getElementById('graphFunction').addEventListener('change', updateGraph);
    
    // Add input event listeners for real-time validation
    document.querySelectorAll('.function-input input').forEach(input => {
        input.addEventListener('input', validateInput);
    });
    
    // Add clipboard copy button functionality
    document.querySelectorAll('.copy-result').forEach(button => {
        button.addEventListener('click', copyResultToClipboard);
    });
    
    // Setup network info display
    document.getElementById('networkName').textContent = FLUENT_NETWORK.name;
    
    // Initialize read-only provider and contract
    setupReadOnlyProvider();
    
    // Setup graph
    setupGraph('sqrt');
    
    // Check if wallet is already connected
    checkWalletConnection();
    
    // Enable calculation buttons (even without wallet connection)
    document.querySelectorAll('.calculate-btn').forEach(button => {
        button.disabled = false;
    });
    
    // Update connection status to show read-only mode
    if (!connectedAccount) {
        document.getElementById('connectionStatus').className = 'status read-only';
        document.getElementById('connectionStatus').textContent = 'Read-Only Mode';
    }

    // Show calculation history section
    document.getElementById('historySection').classList.remove('hidden');
}

function setupReadOnlyProvider() {
    try {
        // Create a read-only provider using the network's RPC URL
        readOnlyProvider = new ethers.providers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
        
        // Create a read-only contract instance
        readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, readOnlyProvider);
        
        console.log('Read-only provider and contract setup successfully');
    } catch (error) {
        console.error('Error setting up read-only provider:', error);
        displayErrorMessage('Failed to connect to Fluent network. Please try again later.');
    }
}

function validateInput(event) {
    const input = event.target;
    const value = parseFloat(input.value);
    const functionName = input.id.replace('Input', '');
    const calculateButton = document.querySelector(`.calculate-btn[data-function="${functionName}"]`);
    
    // Clear any previous error messages
    const errorElement = input.parentElement.querySelector('.input-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Validate input
    let isValid = true;
    let errorMessage = '';
    
    if (isNaN(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid number';
    } else if ((functionName === 'ln' || functionName === 'log10' || functionName === 'log2') && value <= 0) {
        isValid = false;
        errorMessage = 'Value must be greater than 0';
    } else if (functionName === 'sqrt' && value < 0) {
        isValid = false;
        errorMessage = 'Value must be non-negative';
    } else if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) {
        isValid = false;
        errorMessage = 'Value is outside of safe range';
    }
    
    // Display error message if needed
    if (!isValid && input.value !== '') {
        const error = document.createElement('div');
        error.className = 'input-error';
        error.textContent = errorMessage;
        input.parentElement.appendChild(error);
        calculateButton.disabled = true;
    } else {
        calculateButton.disabled = false;
    }
}

async function checkWalletConnection() {
    if (window.ethereum && window.ethereum.selectedAddress) {
        await connectWallet();
    }
}

async function connectWallet() {
    try {
        // Reset the UI
        document.getElementById('connectionStatus').className = 'status connecting';
        document.getElementById('connectionStatus').textContent = 'Connecting...';
        
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask is not installed. Please install MetaMask to use this app.');
            document.getElementById('connectionStatus').className = 'status read-only';
            document.getElementById('connectionStatus').textContent = 'Read-Only Mode';
            return;
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        connectedAccount = accounts[0];

        // Setup ethers provider and contract
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        // Check if connected to the right network
        const network = await provider.getNetwork();
        if (network.chainId !== FLUENT_NETWORK.chainId) {
            // Prompt user to switch to Fluent network
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(FLUENT_NETWORK.chainId) }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: ethers.utils.hexValue(FLUENT_NETWORK.chainId),
                                chainName: FLUENT_NETWORK.name,
                                rpcUrls: [FLUENT_NETWORK.rpcUrl],
                                blockExplorerUrls: [FLUENT_NETWORK.blockExplorer]
                            }],
                        });
                    } catch (addError) {
                        console.error('Error adding Fluent network:', addError);
                        alert('Failed to add Fluent network to your wallet. Please add it manually.');
                        document.getElementById('connectionStatus').className = 'status error';
                        document.getElementById('connectionStatus').textContent = 'Wrong Network';
                        return;
                    }
                } else {
                    console.error('Error switching to Fluent network:', switchError);
                    alert('Failed to switch to Fluent network. Please switch manually.');
                    document.getElementById('connectionStatus').className = 'status error';
                    document.getElementById('connectionStatus').textContent = 'Wrong Network';
                    return;
                }
            }
        }

        // Update UI to show connected state
        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('walletAddress').textContent = `${connectedAccount.substring(0, 6)}...${connectedAccount.substring(38)}`;
        document.getElementById('connectionStatus').className = 'status connected';
        document.getElementById('connectionStatus').textContent = 'Connected';
        document.getElementById('connectWallet').textContent = 'Disconnect';
        document.getElementById('connectWallet').removeEventListener('click', connectWallet);
        document.getElementById('connectWallet').addEventListener('click', disconnectWallet);
        
        console.log('Wallet connected successfully');
        
        // Refresh any existing graphs with real contract data
        await updateGraph();
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
        document.getElementById('connectionStatus').className = 'status error';
        document.getElementById('connectionStatus').textContent = 'Connection Failed';
        alert('Failed to connect wallet. Please try again.');
    }
}

async function disconnectWallet() {
    // Reset the UI
    connectedAccount = null;
    document.getElementById('walletInfo').classList.add('hidden');
    document.getElementById('connectionStatus').className = 'status read-only';
    document.getElementById('connectionStatus').textContent = 'Read-Only Mode';
    document.getElementById('connectWallet').textContent = 'Connect Wallet';
    document.getElementById('connectWallet').removeEventListener('click', disconnectWallet);
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    // Refresh the graph with simulated data
    await updateGraph();
}

function displayErrorMessage(message) {
    const errorBanner = document.createElement('div');
    errorBanner.className = 'error-banner';
    errorBanner.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-error';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        errorBanner.remove();
    });
    
    errorBanner.appendChild(closeButton);
    document.body.appendChild(errorBanner);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (document.body.contains(errorBanner)) {
            errorBanner.remove();
        }
    }, 5000);
}

async function handleCalculation(event) {
    if (isCalculating) return;
    
    isCalculating = true;
    const functionName = event.target.dataset.function;
    const inputElement = document.getElementById(`${functionName}Input`);
    const resultElement = document.getElementById(`${functionName}Result`);
    const resultContainer = document.getElementById(`${functionName}ResultContainer`);
    
    // Reset UI
    resultContainer.classList.remove('error');
    resultElement.textContent = 'Calculating...';
    event.target.disabled = true;
    
    // Show loading animation
    const originalButtonText = event.target.textContent;
    event.target.innerHTML = '<span class="loading-spinner"></span> Calculating';
    
    try {
        // Get input value
        const inputValue = inputElement.value;
        if (!inputValue || isNaN(parseFloat(inputValue))) {
            resultContainer.classList.add('error');
            resultElement.textContent = 'Invalid input';
            return;
        }
        
        // Convert input to fixed-point representation
        const fixedInput = ethers.utils.parseUnits(inputValue, 18);
        
        // Record start time for performance measurement
        const startTime = performance.now();
        
        // Call the appropriate contract function (using read-only contract if wallet not connected)
        const contractToUse = connectedAccount ? contract : readOnlyContract;
        let result;
        
        switch (functionName) {
            case 'sqrt':
                result = await contractToUse.sqrt(fixedInput);
                break;
            case 'exp':
                result = await contractToUse.exp(fixedInput);
                break;
            case 'ln':
                result = await contractToUse.ln(fixedInput);
                break;
            case 'log10':
                result = await contractToUse.log10(fixedInput);
                break;
            case 'log2':
                result = await contractToUse.log2(fixedInput);
                break;
            default:
                throw new Error(`Unknown function: ${functionName}`);
        }
        
        // Record end time
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Format and display result
        const formattedResult = formatResult(result);
        resultElement.textContent = formattedResult;
        
        // Add success effect
        resultContainer.classList.add('success');
        setTimeout(() => {
            resultContainer.classList.remove('success');
        }, 1000);
        
        // Update calculation history
        updateCalculationHistory(functionName, inputValue, formattedResult, duration);
        
        // Show history section
        document.getElementById('historySection').classList.remove('hidden');
        
    } catch (error) {
        console.error(`Error calculating ${functionName}:`, error);
        resultContainer.classList.add('error');
        
        // Check if the error is a contract revert with a specific reason
        if (error.reason) {
            resultElement.textContent = `Error: ${error.reason}`;
        } else if (error.message && error.message.includes('MathError')) {
            // Extract the error message from the revert reason
            const errorMatch = error.message.match(/MathError\((.*?)\)/);
            if (errorMatch && errorMatch[1]) {
                resultElement.textContent = `Error: ${errorMatch[1].replace(/["']/g, '')}`;
            } else {
                resultElement.textContent = 'Calculation error';
            }
        } else if (error.message && error.message.includes('network changed')) {
            resultElement.textContent = 'Network connection error';
            displayErrorMessage('Network connection error. Please check your connection to the Fluent network.');
        } else if (error.code === 'TIMEOUT') {
            resultElement.textContent = 'Request timed out';
            displayErrorMessage('The calculation request timed out. Please try again later.');
        } else {
            resultElement.textContent = 'Calculation error';
        }
    } finally {
        // Reset UI
        event.target.disabled = false;
        event.target.innerHTML = originalButtonText;
        isCalculating = false;
    }
}

function formatResult(result) {
    // Convert the BigNumber result from fixed-point representation to a decimal number
    const resultBigInt = BigInt(result.toString());
    
    // Handle potential negative values
    const isNegative = resultBigInt < 0;
    const absoluteResult = isNegative ? -resultBigInt : resultBigInt;
    
    // Convert to decimal representation
    const integerPart = absoluteResult / SCALE_FACTOR;
    const fractionalPart = absoluteResult % SCALE_FACTOR;
    
    // Format with appropriate precision
    let formattedFractional = fractionalPart.toString().padStart(18, '0');
    
    // Trim trailing zeros
    while (formattedFractional.endsWith('0') && formattedFractional.length > 1) {
        formattedFractional = formattedFractional.slice(0, -1);
    }
    
    const formattedResult = `${isNegative ? '-' : ''}${integerPart}${formattedFractional !== '0' ? '.' + formattedFractional : ''}`;
    
    return formattedResult;
}

function updateCalculationHistory(functionName, input, result, duration) {
    const historyContainer = document.getElementById('calculationHistory');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // Format the calculation name and result for display
    const formattedName = functionName === 'sqrt' ? '√' : 
                         functionName === 'exp' ? 'e^' : functionName;
    
    historyItem.innerHTML = `
        <div class="history-function">${formattedName}(${input})</div>
        <div class="history-result">${result}</div>
        <div class="history-time">${duration.toFixed(2)}ms</div>
    `;
    
    // Add to top of history with animation
    historyItem.style.opacity = '0';
    historyItem.style.transform = 'translateY(-10px)';
    
    if (historyContainer.firstChild) {
        historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    } else {
        historyContainer.appendChild(historyItem);
    }
    
    // Trigger animation
    setTimeout(() => {
        historyItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        historyItem.style.opacity = '1';
        historyItem.style.transform = 'translateY(0)';
    }, 10);
    
    // Limit history to 10 items
    const historyItems = historyContainer.querySelectorAll('.history-item');
    if (historyItems.length > 10) {
        historyContainer.removeChild(historyItems[historyItems.length - 1]);
    }
    
    // Show the history section if it was hidden
    document.getElementById('historySection').classList.remove('hidden');
}

function copyResultToClipboard(event) {
    const functionName = event.target.getAttribute('data-function');
    const resultElement = document.getElementById(`${functionName}Result`);
    
    if (resultElement.textContent === '-' || resultElement.textContent.startsWith('Error')) {
        return;
    }
    
    navigator.clipboard.writeText(resultElement.textContent).then(() => {
        // Show copied indicator
        const originalText = event.target.textContent;
        event.target.textContent = 'Copied!';
        setTimeout(() => {
            event.target.textContent = originalText;
        }, 1500);
    });
}

function setupGraph(functionName) {
    // We'll initialize the graph with client-side data first
    // and later update it with contract data when possible
    const data = generateGraphData(functionName);
    
    // Create initial chart
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: getGraphTitle(functionName),
                data: data,
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#4a90e2',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            parsing: {
                xAxisKey: 'x',
                yAxisKey: 'y'
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(x)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${functionName}(${context.parsed.x.toFixed(2)}) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        }
    });
}

async function updateGraph() {
    const functionName = document.getElementById('graphFunction').value;
    document.getElementById('currentGraphFunction').textContent = getGraphTitle(functionName);
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    try {
        // Get real contract data when possible
        let data;
        
        if (readOnlyContract) {
            // Show loading indicator
            document.getElementById('graphLoadingIndicator').classList.remove('hidden');
            
            try {
                data = await generateContractData(functionName);
            } catch (error) {
                console.error('Error getting contract data:', error);
                // Fall back to client-side calculation
                data = generateGraphData(functionName);
            } finally {
                document.getElementById('graphLoadingIndicator').classList.add('hidden');
            }
        } else {
            // Use client-side calculation as fallback
            data = generateGraphData(functionName);
        }
        
        // Create the chart
        const ctx = document.getElementById('graphCanvas').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: getGraphTitle(functionName),
                    data: data,
                    borderColor: '#4a90e2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#4a90e2',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                parsing: {
                    xAxisKey: 'x',
                    yAxisKey: 'y'
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'x'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'f(x)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${functionName}(${context.parsed.x.toFixed(2)}) = ${context.parsed.y.toFixed(4)}`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating graph:', error);
    }
}

async function generateContractData(functionName) {
    try {
        document.getElementById('graphLoadingIndicator').classList.remove('hidden');
        
        // Use the read-only contract if wallet is not connected
        const contractToUse = connectedAccount ? contract : readOnlyContract;
        
        const points = 20;
        const data = [];
        
        // Generate appropriate input values based on the function
        let startValue, endValue;
        
        switch (functionName) {
            case 'sqrt':
                startValue = 0;
                endValue = 100;
                break;
            case 'exp':
                startValue = -5;
                endValue = 5;
                break;
            case 'ln':
            case 'log10':
            case 'log2':
                startValue = 0.1;
                endValue = 100;
                break;
            default:
                startValue = 0;
                endValue = 10;
        }
        
        const step = (endValue - startValue) / points;
        
        // Array of promises for parallel execution
        const promises = [];
        
        for (let i = 0; i <= points; i++) {
            const x = startValue + (step * i);
            const fixedX = ethers.utils.parseUnits(x.toString(), 18);
            
            let promise;
            switch (functionName) {
                case 'sqrt':
                    promise = contractToUse.sqrt(fixedX);
                    break;
                case 'exp':
                    promise = contractToUse.exp(fixedX);
                    break;
                case 'ln':
                    // Ensure x > 0 for logarithm
                    if (x > 0) {
                        promise = contractToUse.ln(fixedX);
                    } else {
                        continue;
                    }
                    break;
                case 'log10':
                    if (x > 0) {
                        promise = contractToUse.log10(fixedX);
                    } else {
                        continue;
                    }
                    break;
                case 'log2':
                    if (x > 0) {
                        promise = contractToUse.log2(fixedX);
                    } else {
                        continue;
                    }
                    break;
                default:
                    continue;
            }
            
            promises.push({ x, promise });
        }
        
        // Add a small delay to ensure loading indicator is visible
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Process promises with a small delay between each to avoid overwhelming the network
        for (const { x, promise } of promises) {
            try {
                const result = await promise;
                const y = ethers.utils.formatUnits(result, 18);
                data.push({ x, y: parseFloat(y) });
                
                // Small delay between requests to reduce network load
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
                console.error(`Error calculating ${functionName}(${x}):`, error);
                // Skip this point on error
            }
        }
        
        document.getElementById('graphLoadingIndicator').classList.add('hidden');
        return data;
    } catch (error) {
        console.error('Error generating contract data:', error);
        document.getElementById('graphLoadingIndicator').classList.add('hidden');
        displayErrorMessage('Unable to load contract data. Using simulated values instead.');
        return generateGraphData(functionName); // Fallback to client-side calculation
    }
}

function generateGraphData(functionName) {
    // Generate client-side data for the graph
    const data = [];
    
    // Different range based on function type
    let start, end, points = 50;
    
    switch (functionName) {
        case 'sqrt':
            start = 0;
            end = 100;
            break;
        case 'exp':
            start = -5;
            end = 5;
            break;
        case 'ln':
        case 'log10':
        case 'log2':
            start = 0.1;
            end = 100;
            break;
        default:
            start = 0;
            end = 10;
    }
    
    const step = (end - start) / points;
    
    // Generate data points
    for (let i = 0; i <= points; i++) {
        const x = start + i * step;
        let y;
        
        switch (functionName) {
            case 'sqrt':
                y = Math.sqrt(x);
                break;
            case 'exp':
                y = Math.exp(x);
                break;
            case 'ln':
                y = Math.log(x);
                break;
            case 'log10':
                y = Math.log10(x);
                break;
            case 'log2':
                y = Math.log2(x);
                break;
            default:
                y = x;
        }
        
        data.push({ x, y });
    }
    
    return data;
}

function getGraphTitle(functionName) {
    switch (functionName) {
        case 'sqrt':
            return 'Square Root (√x)';
        case 'exp':
            return 'Exponential (e^x)';
        case 'ln':
            return 'Natural Logarithm (ln(x))';
        case 'log10':
            return 'Base-10 Logarithm (log₁₀(x))';
        case 'log2':
            return 'Base-2 Logarithm (log₂(x))';
        default:
            return functionName;
    }
}

// Add event listeners for network changes
if (window.ethereum) {
    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
    
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // User disconnected their wallet
            document.getElementById('walletInfo').classList.add('hidden');
            document.getElementById('connectWallet').textContent = 'Connect Wallet';
            document.getElementById('connectionStatus').className = 'status disconnected';
            document.getElementById('connectionStatus').textContent = 'Not Connected';
            provider = null;
            contract = null;
            signer = null;
            connectedAccount = null;
        } else {
            // Account changed, reload the page for simplicity
            window.location.reload();
        }
    });
} 