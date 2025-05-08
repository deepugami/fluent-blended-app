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
// TODO: Update this with your actual deployed contract address after deployment
const CONTRACT_ADDRESS = "0xE3be5250dC953F4581e4be70EaB0C23544006261";

// Fluent Network configuration
// TODO: Update these values with the actual Fluent network configuration
const FLUENT_NETWORK = {
    name: 'Fluent Testnet',
    chainId: 424242,  // Update with actual Fluent chain ID
    rpcUrl: 'https://testnet.fluent.xyz',  // Update with actual RPC URL
    blockExplorer: 'https://explorer.testnet.fluent.xyz'  // Update with actual explorer URL
};

// Global variables
let provider;
let contract;
let signer;
let connectedAccount;
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
    
    // Setup graph
    setupGraph('sqrt');
    
    // Check if wallet is already connected
    checkWalletConnection();
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
            document.getElementById('connectionStatus').className = 'status disconnected';
            document.getElementById('connectionStatus').textContent = 'Not Connected';
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

        // Update UI
        document.getElementById('walletAddress').textContent = 
            `${connectedAccount.substring(0, 6)}...${connectedAccount.substring(38)}`;
        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('connectWallet').textContent = 'Wallet Connected';
        document.getElementById('connectionStatus').className = 'status connected';
        document.getElementById('connectionStatus').textContent = 'Connected';
        
        // Enable all calculation buttons
        document.querySelectorAll('.calculate-btn').forEach(button => {
            button.disabled = false;
        });
        
        // Update graph with actual contract data
        updateGraph();
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
        document.getElementById('connectionStatus').className = 'status error';
        document.getElementById('connectionStatus').textContent = 'Connection Failed';
    }
}

async function handleCalculation(event) {
    if (isCalculating) return;
    
    const functionName = event.target.getAttribute('data-function');
    const inputElement = document.getElementById(`${functionName}Input`);
    const resultElement = document.getElementById(`${functionName}Result`);
    const resultContainer = document.getElementById(`${functionName}ResultContainer`);
    
    if (!inputElement.value) {
        alert('Please enter a value');
        return;
    }
    
    try {
        isCalculating = true;
        
        // Show loading indicator
        resultElement.innerHTML = '<span class="loading">Calculating...</span>';
        resultContainer.classList.remove('error');
        
        if (!contract) {
            alert('Please connect your wallet first');
            resultElement.textContent = '-';
            isCalculating = false;
            return;
        }
        
        const inputValue = parseFloat(inputElement.value);
        
        // Validate input value
        if ((functionName === 'ln' || functionName === 'log10' || functionName === 'log2') && inputValue <= 0) {
            throw new Error(`${functionName}(${inputValue}) is undefined`);
        }
        
        // Convert input value to appropriate BigNumber format with scaling
        let input;
        if (functionName === 'exp') {
            // For exp, we need to handle negative inputs (int256)
            input = ethers.BigNumber.from(
                (BigInt(Math.round(inputValue * 1e6)) * SCALE_FACTOR / BigInt(1e6)).toString()
            );
        } else {
            // For other functions, inputs are uint256
            if (inputValue < 0) {
                throw new Error('Please enter a positive number');
            }
            input = ethers.BigNumber.from(
                (BigInt(Math.round(inputValue * 1e6)) * SCALE_FACTOR / BigInt(1e6)).toString()
            );
        }
        
        // Record start time for performance measurement
        const startTime = performance.now();
        
        // Call the appropriate contract function
        let result;
        try {
            result = await contract[functionName](input);
        } catch (error) {
            // Check if the error is from the MathError custom error
            if (error.code === 'CALL_EXCEPTION') {
                const errorData = error.error?.data?.originalError?.data;
                if (errorData && errorData.startsWith('0x08c379a0')) {
                    // This is a custom error with a message
                    const decodedError = ethers.utils.defaultAbiCoder.decode(['string'], '0x' + errorData.slice(10));
                    throw new Error(decodedError[0]);
                }
            }
            throw error;
        }
        
        // Record end time and calculate duration
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Add to history
        contractCallHistory.push({
            function: functionName,
            input: inputValue,
            result: result.toString(),
            timestamp: new Date().toISOString(),
            duration: duration
        });
        
        // Format the result (convert from fixed-point representation)
        const formattedResult = formatResult(result);
        resultElement.textContent = formattedResult;
        
        // Add the calculation to the calculation history
        updateCalculationHistory(functionName, inputValue, formattedResult, duration);
        
    } catch (error) {
        console.error(`Error calculating ${functionName}:`, error);
        resultElement.textContent = 'Error: ' + error.message;
        resultContainer.classList.add('error');
    } finally {
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
    
    // Add to top of history
    if (historyContainer.firstChild) {
        historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    } else {
        historyContainer.appendChild(historyItem);
    }
    
    // Limit history to 10 items
    while (historyContainer.children.length > 10) {
        historyContainer.removeChild(historyContainer.lastChild);
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
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    
    // Generate placeholder data for initial display
    const data = generateGraphData(functionName);
    
    // Chart.js configuration with improved styling
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.x,
            datasets: [{
                label: getGraphTitle(functionName),
                data: data.y,
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: '#4a90e2',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Segoe UI, sans-serif',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    displayColors: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Input Value (x)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Output Value',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                }
            }
        }
    });
}

async function updateGraph() {
    const functionName = document.getElementById('graphFunction').value;
    
    // Update graph title display
    document.getElementById('currentGraphFunction').textContent = getGraphTitle(functionName);
    
    // If wallet is connected, try to get real data from the contract
    let data;
    if (contract) {
        try {
            document.getElementById('graphLoadingIndicator').classList.remove('hidden');
            data = await generateContractData(functionName);
            document.getElementById('graphLoadingIndicator').classList.add('hidden');
        } catch (error) {
            console.error('Error generating contract data:', error);
            data = generateGraphData(functionName);
            document.getElementById('graphLoadingIndicator').classList.add('hidden');
        }
    } else {
        data = generateGraphData(functionName);
    }
    
    // Update chart
    chart.data.labels = data.x;
    chart.data.datasets[0].label = getGraphTitle(functionName);
    chart.data.datasets[0].data = data.y;
    
    // Customize Y axis scale based on function
    if (functionName === 'exp') {
        chart.options.scales.y.type = 'logarithmic';
    } else {
        chart.options.scales.y.type = 'linear';
    }
    
    chart.update();
}

async function generateContractData(functionName) {
    const x = [];
    const y = [];
    
    // Different range based on function type
    let start, end, step, numPoints = 50;
    
    switch (functionName) {
        case 'sqrt':
            start = 0;
            end = 10;
            break;
        case 'exp':
            start = -3;
            end = 3;
            break;
        case 'ln':
        case 'log10':
        case 'log2':
            start = 0.1;
            end = 10;
            break;
        default:
            start = 0;
            end = 10;
    }
    
    step = (end - start) / numPoints;
    
    // Batch contract calls for better performance
    const calls = [];
    const points = [];
    
    for (let i = 0; i < numPoints; i++) {
        const point = start + i * step;
        points.push(point);
        
        // Create the appropriate BigNumber input
        let input;
        if (functionName === 'exp') {
            input = ethers.BigNumber.from(
                (BigInt(Math.round(point * 1e6)) * SCALE_FACTOR / BigInt(1e6)).toString()
            );
        } else {
            if (point <= 0 && (functionName === 'ln' || functionName === 'log10' || functionName === 'log2')) {
                // Skip negative/zero inputs for logarithm functions
                continue;
            }
            input = ethers.BigNumber.from(
                (BigInt(Math.round(Math.max(0, point) * 1e6)) * SCALE_FACTOR / BigInt(1e6)).toString()
            );
        }
        
        calls.push(contract[functionName](input));
    }
    
    // Execute all calls in parallel
    const results = await Promise.all(calls);
    
    // Process results
    for (let i = 0; i < results.length; i++) {
        x.push(points[i].toFixed(2));
        
        try {
            // Convert the result from fixed-point to regular number
            const resultBigInt = BigInt(results[i].toString());
            const value = Number(resultBigInt) / Number(SCALE_FACTOR);
            y.push(value);
        } catch (error) {
            console.error('Error processing result:', error);
            y.push(null);
        }
    }
    
    return { x, y };
}

function generateGraphData(functionName) {
    const x = [];
    const y = [];
    
    // Different range based on function type
    let start, end, step;
    
    switch (functionName) {
        case 'sqrt':
            start = 0;
            end = 10;
            step = 0.2;
            break;
        case 'exp':
            start = -3;
            end = 3;
            step = 0.1;
            break;
        case 'ln':
        case 'log10':
        case 'log2':
            start = 0.1;
            end = 10;
            step = 0.2;
            break;
        default:
            start = 0;
            end = 10;
            step = 0.2;
    }
    
    // Generate points
    for (let i = start; i <= end; i += step) {
        x.push(i.toFixed(1));
        
        // Calculate y values based on mathematical functions
        // These are placeholder implementations - in a real app, you'd use the contract
        let value;
        
        switch (functionName) {
            case 'sqrt':
                value = Math.sqrt(i);
                break;
            case 'exp':
                value = Math.exp(i);
                break;
            case 'ln':
                value = i > 0 ? Math.log(i) : null;
                break;
            case 'log10':
                value = i > 0 ? Math.log10(i) : null;
                break;
            case 'log2':
                value = i > 0 ? Math.log2(i) : null;
                break;
            default:
                value = i;
        }
        
        y.push(value);
    }
    
    return { x, y };
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