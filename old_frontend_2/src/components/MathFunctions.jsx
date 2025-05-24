import React, { useState } from 'react';
import { ethers } from 'ethers';

const RustTypesDemo = ({ contract, isConnected, updateCalculationHistory }) => {
  const [calling, setCalling] = useState({});
  const [results, setResults] = useState({});

  const callFunction = async (functionName) => {
    if (!contract || !isConnected) {
      alert('Please connect to the Fluent network first');
      return null;
    }

    try {
      setCalling(prev => ({ ...prev, [functionName]: true }));
      const startTime = performance.now();
      
      const result = await contract[functionName]();
      
      let formattedResult;
      if (functionName === 'getRustUint256' || functionName === 'getRustInt256') {
        formattedResult = result.toString();
      } else if (functionName === 'getRustBytes') {
        formattedResult = ethers.utils.toUtf8String(result);
      } else if (functionName === 'getRustBytes32') {
        formattedResult = result;
      } else if (functionName === 'getRustBool') {
        formattedResult = result.toString();
      } else if (functionName === 'getRustAddress') {
        formattedResult = result;
      } else {
        formattedResult = result;
      }
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      setResults(prev => ({ ...prev, [functionName]: formattedResult }));
      updateCalculationHistory(functionName, 'No input', formattedResult, duration);
      
      setCalling(prev => ({ ...prev, [functionName]: false }));
      return formattedResult;
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      setCalling(prev => ({ ...prev, [functionName]: false }));
      const errorMessage = `Error: ${error.message || 'Unknown error'}`;
      setResults(prev => ({ ...prev, [functionName]: errorMessage }));
      return errorMessage;
    }
  };

  const functions = [
    {
      name: 'getRustString',
      title: 'Get Rust String',
      description: 'Returns a string value from the Rust contract: "Hello World"',
      expectedOutput: 'Hello World',
      returnType: 'string'
    },
    {
      name: 'getRustUint256',
      title: 'Get Rust Uint256',
      description: 'Returns a uint256 value from the Rust contract',
      expectedOutput: '10',
      returnType: 'uint256'
    },
    {
      name: 'getRustInt256',
      title: 'Get Rust Int256',
      description: 'Returns an int256 value from the Rust contract',
      expectedOutput: '-10',
      returnType: 'int256'
    },
    {
      name: 'getRustAddress',
      title: 'Get Rust Address',
      description: 'Returns an address value from the Rust contract',
      expectedOutput: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      returnType: 'address'
    },
    {
      name: 'getRustBytes',
      title: 'Get Rust Bytes',
      description: 'Returns bytes data from the Rust contract',
      expectedOutput: 'FLUENT',
      returnType: 'bytes'
    },
    {
      name: 'getRustBytes32',
      title: 'Get Rust Bytes32',
      description: 'Returns a bytes32 value from the Rust contract',
      expectedOutput: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      returnType: 'bytes32'
    },
    {
      name: 'getRustBool',
      title: 'Get Rust Bool',
      description: 'Returns a boolean value from the Rust contract',
      expectedOutput: 'true',
      returnType: 'bool'
    }
  ];

  return (
    <section className="math-functions">
      <h2>Rust Contract Functions</h2>
      <p className="section-description">
        These functions demonstrate Rust-Solidity interoperability on the Fluent network. 
        Each function calls a Rust contract through a Solidity wrapper.
      </p>
      
      <div className="function-cards">
        {functions.map(func => (
          <div key={func.name} className="function-card">
            <div className="function-header">
              <h3>{func.title}</h3>
              <span className="return-type">{func.returnType}</span>
            </div>
            
            <p className="function-description">{func.description}</p>
            
            <div className="expected-output">
              <strong>Expected Output:</strong> <code>{func.expectedOutput}</code>
            </div>
            
            <div className="function-controls">
              <button
                onClick={() => callFunction(func.name)}
                disabled={calling[func.name] || !isConnected}
                className={`call-button ${calling[func.name] ? 'calling' : ''}`}
              >
                {calling[func.name] ? (
                  <>
                    <span className="loading-spinner"></span>
                    Calling...
                  </>
                ) : (
                  `Call ${func.name}()`
                )}
              </button>
            </div>
            
            {results[func.name] && (
              <div className="function-result">
                <strong>Result:</strong>
                <div className={`result-value ${results[func.name].includes('Error:') ? 'error' : 'success'}`}>
                  {results[func.name]}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="contract-info">
        <h3>Contract Information</h3>
        <p>
          <strong>Rust Contract:</strong> <code>0x87b99c706e17211f313e21f1ed98782e19e91fb2</code>
        </p>
        <p>
          <strong>Solidity Wrapper:</strong> <code>0xAFc63F12b732701526f48E8256Ad35c888336E54</code>
        </p>
        <p>
          <strong>Network:</strong> Fluent Developer Preview
        </p>
        <p className="note">
          <strong>Note:</strong> If you see errors, this is a known issue with Rust-Solidity cross-contract calls on the current Fluent network version.
        </p>
      </div>
    </section>
  );
};

export default RustTypesDemo; 