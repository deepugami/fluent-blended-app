import React, { useState, useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ethers } from 'ethers';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphVisualization = ({ contract, selectedFunction, setSelectedFunction, isConnected, scaleFactor }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Function Values',
        data: [],
        borderColor: '#777777',
        backgroundColor: 'rgba(85, 85, 85, 0.2)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#555555',
        pointBorderColor: '#ffffff',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  });
  const [graphError, setGraphError] = useState(null);
  const chartRef = useRef(null);

  // Generate x-values based on the function type
  const generateXValues = (funcName) => {
    switch (funcName) {
      case 'sqrt':
        // For sqrt, use positive values from 0 to 100
        return Array.from({ length: 21 }, (_, i) => i * 5);
      case 'exp':
        // For exp, use values from -3 to 3
        return Array.from({ length: 13 }, (_, i) => -3 + i * 0.5);
      case 'ln':
      case 'log10':
      case 'log2':
        // For logarithms, use positive values from 0.1 to 100
        return [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100].map(val => parseFloat(val.toFixed(2)));
      default:
        return [];
    }
  };

  // Calculate values using the contract
  const calculateContractValues = async (funcName, xValues) => {
    if (!contract || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const results = [];
      
      for (const x of xValues) {
        if ((funcName === 'ln' || funcName === 'log10' || funcName === 'log2') && x <= 0) {
          results.push(null); // Skip invalid inputs
          continue;
        }

        let input;
        if (funcName === 'exp') {
          // exp takes int256 input
          input = ethers.utils.parseUnits(x.toString(), 18);
        } else {
          // Other functions take uint256 input
          input = ethers.utils.parseUnits(Math.max(0, x).toString(), 18);
        }

        const result = await contract[funcName](input);
        const formattedResult = parseFloat(ethers.utils.formatUnits(result, 18));
        results.push(formattedResult);
      }

      return results;
    } catch (error) {
      console.error('Error calculating contract values:', error);
      throw error;
    }
  };

  // Function to generate points for the graph
  const generateGraphData = async (funcName) => {
    setIsLoading(true);
    setGraphError(null);

    try {
      const xValues = generateXValues(funcName);
      let yValues;

      if (contract && isConnected) {
        yValues = await calculateContractValues(funcName, xValues);
      } else {
        // Fallback to local calculation for preview
        yValues = xValues.map(x => {
          switch (funcName) {
            case 'sqrt': return Math.sqrt(x);
            case 'exp': return Math.exp(x);
            case 'ln': return x > 0 ? Math.log(x) : null;
            case 'log10': return x > 0 ? Math.log10(x) : null;
            case 'log2': return x > 0 ? Math.log2(x) : null;
            default: return 0;
          }
        });
      }

      // Filter out null values
      const validPoints = xValues.map((x, i) => ({ x, y: yValues[i] }))
        .filter(point => point.y !== null);

      setChartData({
        labels: validPoints.map(point => point.x),
        datasets: [
          {
            label: getFunctionLabel(funcName),
            data: validPoints.map(point => point.y),
            borderColor: '#777777',
            backgroundColor: 'rgba(85, 85, 85, 0.2)',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#555555',
            pointBorderColor: '#ffffff',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      });
    } catch (error) {
      setGraphError('Error generating graph data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFunctionIcon = (funcName) => {
    switch(funcName) {
      case 'sqrt': return '√';
      case 'exp': return 'eˣ';
      case 'ln': return 'ln';
      case 'log10': return 'log₁₀';
      case 'log2': return 'log₂';
      default: return 'ƒ';
    }
  };

  const getFunctionLabel = (funcName) => {
    switch (funcName) {
      case 'sqrt': return 'Square Root (√x)';
      case 'exp': return 'Exponential (e^x)';
      case 'ln': return 'Natural Logarithm (ln(x))';
      case 'log10': return 'Base-10 Logarithm (log₁₀(x))';
      case 'log2': return 'Base-2 Logarithm (log₂(x))';
      default: return 'Function Values';
    }
  };

  // Update graph when function changes
  useEffect(() => {
    generateGraphData(selectedFunction);
  }, [selectedFunction, contract, isConnected]);

  const handleFunctionChange = (e) => {
    setSelectedFunction(e.target.value);
  };

  return (
    <section className="graph-visualization">
      <h2>Function Visualization</h2>
      
      <div className="graph-control-panel">
        <div className="graph-selector">
          <label htmlFor="graphFunction">Select Function:</label>
          <select 
            id="graphFunction" 
            value={selectedFunction} 
            onChange={handleFunctionChange}
            disabled={isLoading}
          >
            <option value="sqrt">Square Root (√x)</option>
            <option value="exp">Exponential (e^x)</option>
            <option value="ln">Natural Logarithm (ln(x))</option>
            <option value="log10">Base-10 Logarithm (log₁₀(x))</option>
            <option value="log2">Base-2 Logarithm (log₂(x))</option>
          </select>
        </div>
        
        <div className="selected-function">
          <div className="function-icon">{getFunctionIcon(selectedFunction)}</div>
          <div className="function-name">{getFunctionLabel(selectedFunction)}</div>
        </div>
      </div>
      
      <div className="graph-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner large"></div>
            <p>Generating graph data...</p>
          </div>
        ) : graphError ? (
          <div className="graph-error">
            <p>{graphError}</p>
            <p>Please try again or switch to No-Blockchain Mode.</p>
          </div>
        ) : (
          <div className="graph-container">
            <Line
              ref={chartRef}
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      boxWidth: 20,
                      padding: 20,
                      font: {
                        size: 14
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                      size: 14
                    },
                    bodyFont: {
                      size: 14
                    },
                    callbacks: {
                      label: (context) => {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(6)}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Input (x)',
                      font: {
                        size: 14,
                        weight: 'bold'
                      },
                      padding: 10
                    },
                    grid: {
                      color: 'rgba(200, 200, 200, 0.1)'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Output',
                      font: {
                        size: 14,
                        weight: 'bold'
                      },
                      padding: 10
                    },
                    grid: {
                      color: 'rgba(200, 200, 200, 0.1)'
                    }
                  },
                },
              }}
            />
          </div>
        )}
      </div>
      
      <div className="graph-note">
        <p>
          {isConnected ? 
            'Graph values are calculated on-chain using the PRB Math Blended contract.' : 
            'Currently in No-Blockchain Mode, showing values calculated with JavaScript Math library.'}
        </p>
      </div>
    </section>
  );
};

export default GraphVisualization; 