import React, { useState } from 'react';
import { ethers } from 'ethers';
import FunctionCard from './FunctionCard';

const MathFunctions = ({ contract, isConnected, scaleFactor, updateCalculationHistory }) => {
  const [calculating, setCalculating] = useState({});

  const calculateFunction = async (functionName, input) => {
    if (!contract || !isConnected) {
      alert('Please connect your wallet first');
      return null;
    }

    try {
      setCalculating(prev => ({ ...prev, [functionName]: true }));
      const startTime = performance.now();
      
      let fixedInput;
      let result;

      if (functionName === 'exp') {
        // exp takes int256 input
        fixedInput = ethers.utils.parseUnits(input.toString(), 18);
        result = await contract.exp(fixedInput);
      } else {
        // Other functions take uint256 input
        fixedInput = ethers.utils.parseUnits(Math.max(0, input).toString(), 18);
        result = await contract[functionName](fixedInput);
      }

      const formattedResult = ethers.utils.formatUnits(result, 18);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      updateCalculationHistory(functionName, input, formattedResult, duration);
      
      setCalculating(prev => ({ ...prev, [functionName]: false }));
      return formattedResult;
    } catch (error) {
      console.error(`Error calculating ${functionName}:`, error);
      setCalculating(prev => ({ ...prev, [functionName]: false }));
      return `Error: ${error.message || 'Unknown error'}`;
    }
  };

  const functions = [
    {
      name: 'sqrt',
      title: 'Square Root (√x)',
      inputLabel: 'Enter a positive number:',
      inputPlaceholder: 'e.g., 16',
      inputMin: 0,
      description: 'Calculates the square root of a number using Newton\'s method.'
    },
    {
      name: 'exp',
      title: 'Exponential (e^x)',
      inputLabel: 'Enter a number:',
      inputPlaceholder: 'e.g., 2',
      description: 'Calculates e^x using a Taylor series approximation.'
    },
    {
      name: 'ln',
      title: 'Natural Logarithm (ln(x))',
      inputLabel: 'Enter a positive number:',
      inputPlaceholder: 'e.g., 2.718',
      inputMin: 0.000001,
      description: 'Calculates the natural logarithm using mathematical approximations.'
    },
    {
      name: 'log10',
      title: 'Base-10 Logarithm (log₁₀(x))',
      inputLabel: 'Enter a positive number:',
      inputPlaceholder: 'e.g., 100',
      inputMin: 0.000001,
      description: 'Calculates the base-10 logarithm using the relation log10(x) = ln(x) / ln(10).'
    },
    {
      name: 'log2',
      title: 'Base-2 Logarithm (log₂(x))',
      inputLabel: 'Enter a positive number:',
      inputPlaceholder: 'e.g., 8',
      inputMin: 0.000001,
      description: 'Calculates the base-2 logarithm using the relation log2(x) = ln(x) / ln(2).'
    }
  ];

  return (
    <section className="math-functions">
      <h2>Math Functions</h2>
      <div className="function-cards">
        {functions.map(func => (
          <FunctionCard
            key={func.name}
            func={func}
            isCalculating={calculating[func.name] || false}
            calculateFunction={calculateFunction}
            isConnected={isConnected}
          />
        ))}
      </div>
    </section>
  );
};

export default MathFunctions; 