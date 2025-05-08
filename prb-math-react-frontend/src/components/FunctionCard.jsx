import React, { useState } from 'react';

const FunctionCard = ({ func, isCalculating, calculateFunction, isConnected }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    if (!input) {
      setError('Please enter a value');
      return;
    }

    setError(null);
    
    // Validate input
    const numInput = parseFloat(input);
    if (isNaN(numInput)) {
      setError('Please enter a valid number');
      return;
    }
    
    if ((func.name === 'ln' || func.name === 'log10' || func.name === 'log2') && numInput <= 0) {
      setError(`${func.title} is only defined for values greater than 0`);
      return;
    }

    if (func.inputMin !== undefined && numInput < func.inputMin) {
      setError(`Value must be at least ${func.inputMin}`);
      return;
    }

    const calculatedResult = await calculateFunction(func.name, numInput);
    if (calculatedResult && !calculatedResult.startsWith('Error')) {
      setResult(calculatedResult);
    } else {
      setError(calculatedResult);
      setResult(null);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError(null);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      // You could add a copied notification here
    }
  };

  return (
    <div className="function-card">
      <h3>{func.title}</h3>
      <p className="function-description">{func.description}</p>

      <div className="function-input">
        <label htmlFor={`${func.name}Input`}>{func.inputLabel}</label>
        <input
          type="number"
          id={`${func.name}Input`}
          value={input}
          onChange={handleInputChange}
          placeholder={func.inputPlaceholder}
          min={func.inputMin}
          step="any"
          disabled={isCalculating}
        />
        <button
          className="calculate-btn"
          onClick={handleCalculate}
          disabled={isCalculating || !isConnected}
        >
          {isCalculating ? 'Calculating...' : 'Calculate'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {result !== null && (
        <div className="result-display">
          <p>Result: <span className="result-value">{result}</span></p>
          <button className="copy-result" onClick={copyToClipboard}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default FunctionCard; 