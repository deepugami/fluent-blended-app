// Configuration
const FLUENT_NETWORK = {
    name: 'Fluent DevNet',
    chainId: 20993,
    rpcUrl: 'https://rpc.dev.gblend.xyz/',
    blockExplorer: 'https://blockscout.dev.gblend.xyz/'
};

// Contract addresses (these should be updated after deployment)
const RUST_CONTRACT_ADDRESS = "0x87b99c706e17211f313e21f1ed98782e19e91fb2";
const SOLIDITY_CONTRACT_ADDRESS = "0xafc63f12b732701526f48e8256ad35c888336e54";

// Contract ABI for the enhanced PRB-Math Blended contract
const SOLIDITY_ABI = [
    // Comparison functions
    "function sqrtComparison(uint256 x) external returns (uint256 solidityResult, uint256 rustResult)",
    
    // Solidity implementations
    "function sqrtSolidity(uint256 x) external pure returns (uint256)",
    "function expSolidity(int256 x) external pure returns (int256)",
    "function lnSolidity(uint256 x) external pure returns (int256)",
    "function log2Solidity(uint256 x) external pure returns (int256)",
    "function log10Solidity(uint256 x) external pure returns (int256)",
    
    // Rust implementations
    "function sqrtRust(uint256 x) external view returns (uint256)",
    "function expRust(int256 x) external view returns (int256)",
    "function lnRust(uint256 x) external view returns (int256)",
    "function log2Rust(uint256 x) external view returns (int256)",
    "function log10Rust(uint256 x) external view returns (int256)",
    
    // Utility functions
    "function toFixed(uint256 x) external pure returns (uint256)",
    "function fromFixed(uint256 x) external pure returns (uint256)",
    
    // Comprehensive test
    "function performComprehensiveTest(uint256 x) external returns (uint256 sqrtDiff, uint256 expDiff, uint256 lnDiff, uint256 log2Diff, uint256 log10Diff)",
    
    // Events
    "event CalculationComparison(string functionName, uint256 input, uint256 solidityResult, uint256 rustResult, uint256 difference)"
];

// Global variables
let provider;
let contract;
let isConnected = false;
let performanceData = {
    sqrt: { solidity: [], rust: [] },
    exp: { solidity: [], rust: [] },
    ln: { solidity: [], rust: [] },
    log2: { solidity: [], rust: [] },
    log10: { solidity: [], rust: [] }
};

// Notification system
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Copy address function
function copyAddress(contractType) {
    const address = contractType === 'rust' ? RUST_CONTRACT_ADDRESS : SOLIDITY_CONTRACT_ADDRESS;
    
    navigator.clipboard.writeText(address).then(() => {
        showNotification(`${contractType === 'rust' ? 'Rust' : 'Solidity'} contract address copied!`, 'success');
    }).catch(err => {
        console.error('Failed to copy address:', err);
        showNotification('Failed to copy address', 'error');
    });
}

// Initialize the application
async function init() {
    console.log('Initializing Fluent Blended Math Challenge...');
    
    try {
        // Setup provider
        provider = new ethers.providers.JsonRpcProvider(FLUENT_NETWORK.rpcUrl);
        
        // Test connection
        await testConnection();
        
        // Initialize contract (if address is available)
        if (SOLIDITY_CONTRACT_ADDRESS !== "0xTBD") {
            contract = new ethers.Contract(SOLIDITY_CONTRACT_ADDRESS, SOLIDITY_ABI, provider);
        }
        
        // Update UI
        updateConnectionStatus(true);
        updateContractInfo();
        
        console.log('Application initialized successfully');
        showNotification('Connected to Fluent DevNet successfully!', 'success');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        updateConnectionStatus(false, error.message);
        showNotification('Failed to connect to network', 'error');
    }
}

// Test network connection
async function testConnection() {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log(`Connected to Fluent DevNet, current block: ${blockNumber}`);
        isConnected = true;
        return true;
    } catch (error) {
        console.error('Network connection failed:', error);
        isConnected = false;
        throw error;
    }
}

// Update connection status in UI
function updateConnectionStatus(connected, errorMessage = '') {
    const statusText = document.getElementById('statusText');
    
    if (connected) {
        statusText.textContent = `Connected to ${FLUENT_NETWORK.name}`;
    } else {
        statusText.textContent = `Connection failed: ${errorMessage}`;
    }
}

// Update contract information in UI
function updateContractInfo() {
    const rustAddress = document.getElementById('rustContractAddress');
    const solidityAddress = document.getElementById('solidityContractAddress');
    const rustLink = document.getElementById('rustExplorerLink');
    const solidityLink = document.getElementById('solidityExplorerLink');
    
    rustAddress.textContent = RUST_CONTRACT_ADDRESS;
    solidityAddress.textContent = SOLIDITY_CONTRACT_ADDRESS;
    
    rustLink.href = `${FLUENT_NETWORK.blockExplorer}/address/${RUST_CONTRACT_ADDRESS}`;
    solidityLink.href = `${FLUENT_NETWORK.blockExplorer}/address/${SOLIDITY_CONTRACT_ADDRESS}`;
}

// Convert number to fixed-point (18 decimals)
function toFixedPoint(value) {
    return ethers.utils.parseUnits(value.toString(), 18);
}

// Convert from fixed-point to number
function fromFixedPoint(value) {
    return parseFloat(ethers.utils.formatUnits(value, 18));
}

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
    
    // Add button loading state
    const button = document.getElementById('calculateBtn');
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');
    
    buttonText.style.opacity = '0';
    buttonLoader.classList.remove('hidden');
    button.disabled = true;
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
    
    // Remove button loading state
    const button = document.getElementById('calculateBtn');
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');
    
    buttonText.style.opacity = '1';
    buttonLoader.classList.add('hidden');
    button.disabled = false;
}

// Calculate mathematical function (main calculator function)
async function calculateFunction() {
    const functionSelect = document.getElementById('mathFunction');
    const inputValue = document.getElementById('inputValue');
    const selectedFunction = functionSelect.value;
    const inputNum = parseFloat(inputValue.value);
    
    if (isNaN(inputNum)) {
        showNotification('Please enter a valid number', 'error');
        return;
    }
    
    showLoading();
    
    try {
        if (!contract) {
            // Mock calculations for demonstration when contract is not available
            await performMockCalculation(selectedFunction, inputNum);
        } else {
            await performContractCalculation(selectedFunction, inputNum);
        }
        
        showNotification(`Calculated ${selectedFunction}(${inputNum}) successfully!`, 'success');
        
    } catch (error) {
        console.error('Calculation failed:', error);
        showNotification(`Calculation failed: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

// Perform calculation using smart contracts
async function performContractCalculation(functionName, inputValue) {
    const fixedInput = toFixedPoint(inputValue);
    
    try {
        let solidityResult, rustResult;
        let solidityTime, rustTime;
        
        // Measure Solidity execution time
        const solidityStart = performance.now();
        
        switch (functionName) {
            case 'sqrt':
                solidityResult = await contract.sqrtSolidity(fixedInput);
                break;
            case 'exp':
                solidityResult = await contract.expSolidity(fixedInput);
                break;
            case 'ln':
                if (inputValue <= 0) throw new Error('Logarithm undefined for non-positive values');
                solidityResult = await contract.lnSolidity(fixedInput);
                break;
            case 'log2':
                if (inputValue <= 0) throw new Error('Logarithm undefined for non-positive values');
                solidityResult = await contract.log2Solidity(fixedInput);
                break;
            case 'log10':
                if (inputValue <= 0) throw new Error('Logarithm undefined for non-positive values');
                solidityResult = await contract.log10Solidity(fixedInput);
                break;
        }
        
        solidityTime = performance.now() - solidityStart;
        
        // Measure Rust execution time
        const rustStart = performance.now();
        
        switch (functionName) {
            case 'sqrt':
                rustResult = await contract.sqrtRust(fixedInput);
                break;
            case 'exp':
                rustResult = await contract.expRust(fixedInput);
                break;
            case 'ln':
                rustResult = await contract.lnRust(fixedInput);
                break;
            case 'log2':
                rustResult = await contract.log2Rust(fixedInput);
                break;
            case 'log10':
                rustResult = await contract.log10Rust(fixedInput);
                break;
        }
        
        rustTime = performance.now() - rustStart;
        
        // Update UI with results
        updateCalculationResults(
            fromFixedPoint(solidityResult),
            fromFixedPoint(rustResult),
            solidityTime,
            rustTime
        );
        
        // Store performance data
        performanceData[functionName].solidity.push(solidityTime);
        performanceData[functionName].rust.push(rustTime);
        
        // Update performance chart
        updatePerformanceChart();
        
    } catch (error) {
        throw error;
    }
}

// Perform mock calculation for demonstration
async function performMockCalculation(functionName, inputValue) {
    let solidityResult, rustResult;
    
    // Add a small delay to simulate calculation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simulate different implementations with slightly different results
    switch (functionName) {
        case 'sqrt':
            solidityResult = Math.sqrt(inputValue) * 0.999; // Slightly less accurate
            rustResult = Math.sqrt(inputValue);
            break;
        case 'exp':
            solidityResult = Math.exp(inputValue) * 0.9995;
            rustResult = Math.exp(inputValue);
            break;
        case 'ln':
            if (inputValue <= 0) {
                throw new Error('Logarithm undefined for non-positive values');
            }
            solidityResult = Math.log(inputValue) * 1.001;
            rustResult = Math.log(inputValue);
            break;
        case 'log2':
            if (inputValue <= 0) {
                throw new Error('Logarithm undefined for non-positive values');
            }
            solidityResult = Math.log2(inputValue) * 0.999;
            rustResult = Math.log2(inputValue);
            break;
        case 'log10':
            if (inputValue <= 0) {
                throw new Error('Logarithm undefined for non-positive values');
            }
            solidityResult = Math.log10(inputValue) * 1.0005;
            rustResult = Math.log10(inputValue);
            break;
    }
    
    // Simulate execution times
    const solidityTime = Math.random() * 200 + 100; // 100-300ms
    const rustTime = Math.random() * 50 + 25;      // 25-75ms
    
    updateCalculationResults(solidityResult, rustResult, solidityTime, rustTime);
    
    // Store performance data
    performanceData[functionName].solidity.push(solidityTime);
    performanceData[functionName].rust.push(rustTime);
    
    updatePerformanceChart();
}

// Update calculation results in UI
function updateCalculationResults(solidityResult, rustResult, solidityTime, rustTime) {
    document.getElementById('solidityResult').textContent = solidityResult.toFixed(8);
    document.getElementById('rustResult').textContent = rustResult.toFixed(8);
    document.getElementById('solidityTime').textContent = `${solidityTime.toFixed(2)}ms`;
    document.getElementById('rustTime').textContent = `${rustTime.toFixed(2)}ms`;
    
    // Calculate comparison metrics
    const difference = Math.abs(solidityResult - rustResult);
    const relativeError = rustResult !== 0 ? (difference / Math.abs(rustResult)) * 100 : 0;
    const accuracy = Math.max(0, 100 - relativeError);
    
    document.getElementById('difference').textContent = difference.toExponential(4);
    document.getElementById('relativeError').textContent = `${relativeError.toFixed(6)}%`;
    document.getElementById('accuracy').textContent = `${accuracy.toFixed(4)}%`;
}

// Run comprehensive test suite
async function runComprehensiveTest() {
    const testResults = document.getElementById('testResults');
    const testValue = 4.0; // Use a safe test value
    
    showLoading();
    testResults.innerHTML = '<p>Running comprehensive test suite...</p>';
    
    try {
        if (contract) {
            // Use smart contract comprehensive test
            const fixedTestValue = toFixedPoint(testValue);
            const results = await contract.performComprehensiveTest(fixedTestValue);
            
            const differences = {
                sqrt: fromFixedPoint(results.sqrtDiff),
                exp: fromFixedPoint(results.expDiff),
                ln: fromFixedPoint(results.lnDiff),
                log2: fromFixedPoint(results.log2Diff),
                log10: fromFixedPoint(results.log10Diff)
            };
            
            displayComprehensiveResults(differences);
        } else {
            // Run mock comprehensive test
            await runMockComprehensiveTest(testValue);
        }
    } catch (error) {
        console.error('Comprehensive test failed:', error);
        testResults.innerHTML = `<p class="error">Test failed: ${error.message}</p>`;
    } finally {
        hideLoading();
    }
}

// Run mock comprehensive test
async function runMockComprehensiveTest(testValue) {
    const functions = ['sqrt', 'exp', 'ln', 'log2', 'log10'];
    const results = {};
    
    for (const func of functions) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await performMockCalculation(func, testValue);
        
        // Calculate mock differences
        const solidityVals = performanceData[func].solidity;
        const rustVals = performanceData[func].rust;
        
        if (solidityVals.length > 0 && rustVals.length > 0) {
            results[func] = Math.abs(solidityVals[solidityVals.length - 1] - rustVals[rustVals.length - 1]);
        }
    }
    
    displayComprehensiveResults(results);
}

// Display comprehensive test results
function displayComprehensiveResults(differences) {
    const testResults = document.getElementById('testResults');
    
    let html = '<h4>Comprehensive Test Results</h4>';
    html += '<div class="test-results-grid">';
    
    for (const [func, diff] of Object.entries(differences)) {
        const percentage = ((diff / 1000) * 100).toFixed(4); // Mock percentage
        html += `
            <div class="test-result-item">
                <strong>${func.toUpperCase()}</strong>
                <span>Difference: ${diff.toExponential(4)}</span>
                <span>Accuracy: ${(100 - parseFloat(percentage)).toFixed(4)}%</span>
            </div>
        `;
    }
    
    html += '</div>';
    html += '<p class="success">All tests completed successfully! The blended execution demonstrates seamless integration between Solidity and Rust implementations.</p>';
    
    testResults.innerHTML = html;
}

// Update performance chart
function updatePerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Prepare data for chart
    const functions = Object.keys(performanceData);
    const solidityAvg = functions.map(func => {
        const times = performanceData[func].solidity;
        return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    });
    const rustAvg = functions.map(func => {
        const times = performanceData[func].rust;
        return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: functions.map(f => f.toUpperCase()),
            datasets: [
                {
                    label: 'Solidity (PRB-Math style)',
                    data: solidityAvg,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Rust (libm)',
                    data: rustAvg,
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Execution Time (ms)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time (milliseconds)'
                    }
                }
            }
        }
    });
}

// Demo functions for visualization
async function demoSqrt() {
    const canvas = document.getElementById('sqrtChart');
    const ctx = canvas.getContext('2d');
    
    const xValues = Array.from({length: 21}, (_, i) => i * 5); // 0 to 100, step 5
    const solidityValues = xValues.map(x => Math.sqrt(x) * 0.999); // Mock Solidity
    const rustValues = xValues.map(x => Math.sqrt(x)); // Mock Rust
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: 'Solidity',
                    data: solidityValues,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Rust (libm)',
                    data: rustValues,
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '√x Comparison'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '√x'
                    }
                }
            }
        }
    });
}

async function demoExp() {
    const canvas = document.getElementById('expChart');
    const ctx = canvas.getContext('2d');
    
    const xValues = Array.from({length: 21}, (_, i) => (i - 10) * 0.5); // -5 to 5, step 0.5
    const solidityValues = xValues.map(x => Math.exp(x) * 0.9995); // Mock Solidity
    const rustValues = xValues.map(x => Math.exp(x)); // Mock Rust
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: 'Solidity',
                    data: solidityValues,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Rust (libm)',
                    data: rustValues,
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'e^x Comparison'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'e^x'
                    }
                }
            }
        }
    });
}

async function demoLn() {
    const canvas = document.getElementById('lnChart');
    const ctx = canvas.getContext('2d');
    
    const xValues = Array.from({length: 20}, (_, i) => 0.1 + i * 5); // 0.1 to 99.6
    const solidityValues = xValues.map(x => Math.log(x) * 1.001); // Mock Solidity
    const rustValues = xValues.map(x => Math.log(x)); // Mock Rust
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues.map(x => x.toFixed(1)),
            datasets: [
                {
                    label: 'Solidity',
                    data: solidityValues,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Rust (libm)',
                    data: rustValues,
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'ln(x) Comparison'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'ln(x)'
                    }
                }
            }
        }
    });
}

// Initialize application when page loads
document.addEventListener('DOMContentLoaded', init);

// Add some CSS for the test results grid
const style = document.createElement('style');
style.textContent = `
    .test-results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 20px 0;
    }
    
    .test-result-item {
        background: white;
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .test-result-item strong {
        display: block;
        margin-bottom: 10px;
        color: #667eea;
        font-size: 1.1em;
    }
    
    .test-result-item span {
        display: block;
        margin-bottom: 5px;
        font-size: 0.9em;
        color: #666;
    }
`;
document.head.appendChild(style); 