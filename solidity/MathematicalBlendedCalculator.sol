// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MathematicalBlendedCalculator
 * @dev A simplified mathematical calculator that demonstrates Rust-Solidity integration
 * without prb-math dependency. Focuses on basic mathematical functions.
 */
contract MathematicalBlendedCalculator {
      // Interface to the Rust mathematical functions
    interface IRustMath {
        function sqrt(uint256 x) external view returns (int256);
        function exp(int256 x) external view returns (int256);
        function ln(uint256 x) external view returns (int256);
        function log2(uint256 x) external view returns (int256);
        function log10(uint256 x) external view returns (int256);
    }

    // Address of the deployed Rust contract
    address public immutable rustContract;
    
    // Scaling factor for fixed-point arithmetic (10^18)
    uint256 public constant SCALE = 10**18;
    
    // Events
    event CalculationPerformed(
        string functionName,
        uint256 input,
        uint256 result,
        string implementation
    );
    
    event ComparisonResult(
        string functionName,
        uint256 input,
        uint256 solidityResult,
        uint256 rustResult,
        uint256 difference
    );

    /**
     * @dev Sets the address of the Rust contract implementation
     * @param _rustContract Address of the deployed Rust contract
     */
    constructor(address _rustContract) {
        require(_rustContract != address(0), "Invalid rust contract address");
        rustContract = _rustContract;
    }    /**
     * @dev Calculates square root using Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The square root result from Rust
     */
    function sqrtRust(uint256 x) public view returns (uint256) {
        int256 result = IRustMath(rustContract).sqrt(x);
        // Convert int256 to uint256 (square root should always be positive)
        require(result >= 0, "Negative square root");
        return uint256(result);
    }

    /**
     * @dev Calculates square root using simple Solidity implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The square root calculated in Solidity
     */
    function sqrtSolidity(uint256 x) public pure returns (uint256) {
        if (x == 0) return 0;
        
        // Babylonian method
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        
        return y;
    }

    /**
     * @dev Calculates exponential using Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The exponential result from Rust
     */
    function expRust(int256 x) public view returns (int256) {
        return IRustMath(rustContract).exp(x);
    }

    /**
     * @dev Simple Solidity exponential approximation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The exponential calculated in Solidity
     */
    function expSolidity(int256 x) public pure returns (int256) {
        if (x == 0) return int256(SCALE); // e^0 = 1
        if (x < 0) return int256(SCALE) / expSolidity(-x); // e^(-x) = 1/e^x
        
        // Simple Taylor series approximation for small positive values
        uint256 absX = uint256(x);
        if (absX > 20 * SCALE) return 2**255 - 1; // Prevent overflow
        
        uint256 result = SCALE; // Start with 1
        uint256 term = absX; // First term is x
        
        // Add a few terms of the Taylor series
        for (uint256 i = 1; i <= 10; i++) {
            result += term / factorial(i);
            if (i < 10) {
                term = term * absX / SCALE;
            }
        }
        
        return int256(result);
    }

    /**
     * @dev Calculates natural logarithm using Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The natural logarithm result from Rust
     */
    function lnRust(uint256 x) public view returns (int256) {
        require(x > 0, "ln(0) is undefined");
        return IRustMath(rustContract).ln(x);
    }

    /**
     * @dev Simple Solidity natural logarithm approximation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The natural logarithm calculated in Solidity
     */
    function lnSolidity(uint256 x) public pure returns (int256) {
        require(x > 0, "ln(0) is undefined");
        if (x == SCALE) return 0; // ln(1) = 0
        
        // Simple approximation using series expansion around 1
        if (x < SCALE) {
            // For x < 1, use ln(x) = -ln(1/x)
            return -lnSolidity(SCALE * SCALE / x);
        }
        
        // For x > 1, use Taylor series around 1
        uint256 ratio = (x - SCALE) * SCALE / x; // (x-1)/x
        int256 result = 0;
        uint256 term = ratio;
        
        for (uint256 i = 1; i <= 10; i++) {
            if (i % 2 == 1) {
                result += int256(term / i);
            } else {
                result -= int256(term / i);
            }
            term = term * ratio / SCALE;
        }
        
        return result;
    }

    /**
     * @dev Calculates base-2 logarithm using Rust implementation
     * @param x The input value
     * @return The log2 result from Rust
     */
    function log2Rust(uint256 x) public view returns (int256) {
        require(x > 0, "log2(0) is undefined");
        return IRustMath(rustContract).log2(x);
    }

    /**
     * @dev Calculates base-10 logarithm using Rust implementation
     * @param x The input value
     * @return The log10 result from Rust
     */
    function log10Rust(uint256 x) public view returns (int256) {
        require(x > 0, "log10(0) is undefined");
        return IRustMath(rustContract).log10(x);
    }

    /**
     * @dev Compares Rust and Solidity sqrt implementations
     * @param x The input value
     * @return solidityResult The Solidity result
     * @return rustResult The Rust result
     */
    function sqrtComparison(uint256 x) public returns (uint256 solidityResult, uint256 rustResult) {
        solidityResult = sqrtSolidity(x);
        rustResult = sqrtRust(x);
        
        uint256 difference = solidityResult > rustResult 
            ? solidityResult - rustResult 
            : rustResult - solidityResult;
            
        emit ComparisonResult("sqrt", x, solidityResult, rustResult, difference);
    }

    /**
     * @dev Compares Rust and Solidity exp implementations
     * @param x The input value
     * @return solidityResult The Solidity result
     * @return rustResult The Rust result
     */
    function expComparison(int256 x) public returns (int256 solidityResult, int256 rustResult) {
        solidityResult = expSolidity(x);
        rustResult = expRust(x);
        
        emit CalculationPerformed("exp", uint256(x > 0 ? x : -x), uint256(rustResult > 0 ? rustResult : -rustResult), "rust");
    }

    /**
     * @dev Helper function to calculate factorial
     * @param n The number
     * @return The factorial of n
     */
    function factorial(uint256 n) internal pure returns (uint256) {
        if (n <= 1) return 1;
        if (n == 2) return 2;
        if (n == 3) return 6;
        if (n == 4) return 24;
        if (n == 5) return 120;
        if (n == 6) return 720;
        if (n == 7) return 5040;
        if (n == 8) return 40320;
        if (n == 9) return 362880;
        if (n == 10) return 3628800;
        return 3628800; // Cap at 10! to prevent overflow
    }

    /**
     * @dev Convert a regular number to fixed-point representation
     * @param x The number to convert
     * @return The fixed-point representation
     */
    function toFixed(uint256 x) public pure returns (uint256) {
        return x * SCALE;
    }

    /**
     * @dev Convert from fixed-point to regular number
     * @param x The fixed-point number
     * @return The regular number
     */
    function fromFixed(uint256 x) public pure returns (uint256) {
        return x / SCALE;
    }

    /**
     * @dev Get the Rust contract address
     * @return The address of the Rust contract
     */
    function getRustContract() public view returns (address) {
        return rustContract;
    }
}