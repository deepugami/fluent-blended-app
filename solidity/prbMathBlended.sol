// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title prbMathBlended
 * @dev Solidity contract that demonstrates blended execution by providing both
 * Solidity-based mathematical functions (similar to prb-math) and Rust-based
 * implementations using libm. This showcases the power of Fluent's blended execution.
 * 
 * The Rust implementation uses the libm library for high-precision floating-point calculations.
 * The Solidity implementation provides traditional fixed-point arithmetic.
 */
contract prbMathBlended {
    // Interface to the Rust functions
    interface RustMath {
        function sqrt(uint256 x) external view returns (uint256);
        function exp(int256 x) external view returns (int256);
        function ln(uint256 x) external view returns (int256);
        function log10(uint256 x) external view returns (int256);
        function log2(uint256 x) external view returns (int256);
    }

    // Address of the deployed Rust contract
    address public immutable rustContract;
    
    // Scaling factor for fixed-point arithmetic (10^18)
    uint256 public constant SCALE = 10**18;
    uint256 public constant HALF_SCALE = 5 * 10**17;
    
    // Mathematical constants
    uint256 public constant E = 2718281828459045235; // e ≈ 2.718281828459045235 (scaled by 10^18)
    uint256 public constant LOG2_E = 1442695040888963407; // log2(e) ≈ 1.442695040888963407 (scaled by 10^18)
    uint256 public constant LN_2 = 693147180559945309; // ln(2) ≈ 0.693147180559945309 (scaled by 10^18)
    
    // Events
    event CalculationComparison(
        string functionName,
        uint256 input,
        uint256 solidityResult,
        uint256 rustResult,
        uint256 difference
    );
    
    // Error messages
    error InvalidRustContract();
    error MathError(string message);
    error InvalidInput(string message);

    /**
     * @dev Sets the address of the Rust contract implementation
     * @param _rustContract Address of the deployed Rust contract
     */
    constructor(address _rustContract) {
        if (_rustContract == address(0)) revert InvalidRustContract();
        rustContract = _rustContract;
    }

    /**
     * @dev Calculates the square root using both Solidity and Rust implementations
     * @param x The input value as a fixed-point number with 18 decimals
     * @return solidityResult The Solidity-calculated square root
     * @return rustResult The Rust-calculated square root
     */
    function sqrtComparison(uint256 x) public returns (uint256 solidityResult, uint256 rustResult) {
        solidityResult = sqrtSolidity(x);
        rustResult = sqrtRust(x);
        
        uint256 difference = solidityResult > rustResult 
            ? solidityResult - rustResult 
            : rustResult - solidityResult;
            
        emit CalculationComparison("sqrt", x, solidityResult, rustResult, difference);
    }

    /**
     * @dev Calculates the square root using Solidity (Babylonian method)
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The square root of x as a fixed-point number with 18 decimals
     */
    function sqrtSolidity(uint256 x) public pure returns (uint256) {
        if (x == 0) return 0;
        
        // Initial guess - can be improved
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        
        // Babylonian method - iterative approximation
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        
        // Adjust for fixed-point arithmetic
        return y * SCALE / 1000000000; // Adjust scaling
    }

    /**
     * @dev Calculates the square root using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The square root of x as a fixed-point number with 18 decimals
     */
    function sqrtRust(uint256 x) public view returns (uint256) {
        return RustMath(rustContract).sqrt(x);
    }

    /**
     * @dev Approximates e^x using Taylor series (Solidity implementation)
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The value of e^x as a fixed-point number with 18 decimals
     */
    function expSolidity(int256 x) public pure returns (int256) {
        if (x < -42139678854452767551) return 0; // Underflow protection
        if (x >= 135305999368893231589) revert MathError("exp overflow");
        
        // Convert to positive for calculation
        bool negative = x < 0;
        uint256 absX = uint256(negative ? -x : x);
        
        // Taylor series approximation: e^x = 1 + x + x^2/2! + x^3/3! + x^4/4! + ...
        uint256 result = SCALE; // Start with 1
        uint256 term = absX; // First term is x
        
        // Calculate first few terms of Taylor series
        for (uint256 i = 1; i <= 10 && term > 0; i++) {
            result += term / factorial(i);
            term = term * absX / SCALE;
        }
        
        // Handle negative exponents
        if (negative) {
            result = SCALE * SCALE / result;
        }
        
        return int256(result);
    }

    /**
     * @dev Calculates e^x using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The value of e^x as a fixed-point number with 18 decimals
     */
    function expRust(int256 x) public view returns (int256) {
        return RustMath(rustContract).exp(x);
    }

    /**
     * @dev Approximates natural logarithm using Solidity
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The natural logarithm of x as a fixed-point number with 18 decimals
     */
    function lnSolidity(uint256 x) public pure returns (int256) {
        if (x == 0) revert MathError("ln(0) is undefined");
        if (x == SCALE) return 0; // ln(1) = 0
        
        // Use change of base and binary logarithm for better precision
        // ln(x) = log2(x) / log2(e)
        int256 log2Result = log2Solidity(x);
        return log2Result * int256(LN_2) / int256(SCALE);
    }

    /**
     * @dev Calculates the natural logarithm using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The natural logarithm of x as a fixed-point number with 18 decimals
     */
    function lnRust(uint256 x) public view returns (int256) {
        if (x == 0) revert MathError("ln(0) is undefined");
        return RustMath(rustContract).ln(x);
    }

    /**
     * @dev Approximates base-2 logarithm using bit manipulation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The base-2 logarithm of x as a fixed-point number with 18 decimals
     */
    function log2Solidity(uint256 x) public pure returns (int256) {
        if (x == 0) revert MathError("log2(0) is undefined");
        if (x == SCALE) return 0; // log2(1) = 0
        
        // Find the integer part by finding the position of the highest bit
        uint256 integerPart = 0;
        uint256 temp = x / SCALE;
        
        while (temp > 1) {
            integerPart++;
            temp >>= 1;
        }
        
        // For fractional part, use binary search or approximation
        // Simplified version - can be improved with more sophisticated algorithms
        uint256 fractionalPart = 0;
        temp = x;
        
        for (uint256 i = 0; i < 18; i++) {
            temp = temp * temp / SCALE;
            if (temp >= 2 * SCALE) {
                fractionalPart += SCALE >> (i + 1);
                temp >>= 1;
            }
        }
        
        return int256(integerPart * SCALE + fractionalPart);
    }

    /**
     * @dev Calculates the base-2 logarithm using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The base-2 logarithm of x as a fixed-point number with 18 decimals
     */
    function log2Rust(uint256 x) public view returns (int256) {
        if (x == 0) revert MathError("log2(0) is undefined");
        return RustMath(rustContract).log2(x);
    }

    /**
     * @dev Calculates the base-10 logarithm using Solidity
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The base-10 logarithm of x as a fixed-point number with 18 decimals
     */
    function log10Solidity(uint256 x) public pure returns (int256) {
        if (x == 0) revert MathError("log10(0) is undefined");
        
        // log10(x) = ln(x) / ln(10)
        int256 lnResult = lnSolidity(x);
        return lnResult * int256(SCALE) / 2302585092994045684; // ln(10) ≈ 2.302585092994045684
    }

    /**
     * @dev Calculates the base-10 logarithm using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The base-10 logarithm of x as a fixed-point number with 18 decimals
     */
    function log10Rust(uint256 x) public view returns (int256) {
        if (x == 0) revert MathError("log10(0) is undefined");
        return RustMath(rustContract).log10(x);
    }

    /**
     * @dev Helper function to calculate factorial (used in Taylor series)
     * @param n The number to calculate factorial for
     * @return The factorial of n
     */
    function factorial(uint256 n) internal pure returns (uint256) {
        if (n == 0 || n == 1) return 1;
        if (n == 2) return 2;
        if (n == 3) return 6;
        if (n == 4) return 24;
        if (n == 5) return 120;
        if (n == 6) return 720;
        if (n == 7) return 5040;
        if (n == 8) return 40320;
        if (n == 9) return 362880;
        if (n == 10) return 3628800;
        
        // For larger numbers, use iterative calculation
        uint256 result = 3628800;
        for (uint256 i = 11; i <= n && i <= 20; i++) {
            result *= i;
        }
        return result;
    }
    
    /**
     * @dev Helper function to convert from a regular number to fixed-point representation
     * @param x The number to convert
     * @return The fixed-point representation with 18 decimals
     */
    function toFixed(uint256 x) public pure returns (uint256) {
        return x * SCALE;
    }
    
    /**
     * @dev Helper function to convert from fixed-point to a regular number
     * @param x The fixed-point number with 18 decimals
     * @return The regular number representation
     */
    function fromFixed(uint256 x) public pure returns (uint256) {
        return x / SCALE;
    }

    /**
     * @dev Perform a comprehensive comparison of all mathematical functions
     * @param x The input value for testing
     * @return A summary of differences between implementations
     */
    function performComprehensiveTest(uint256 x) public returns (
        uint256 sqrtDiff,
        uint256 expDiff,
        uint256 lnDiff,
        uint256 log2Diff,
        uint256 log10Diff
    ) {
        // Test sqrt
        (uint256 sqrtSol, uint256 sqrtRust) = sqrtComparison(x);
        sqrtDiff = sqrtSol > sqrtRust ? sqrtSol - sqrtRust : sqrtRust - sqrtSol;
        
        // Test exp (with safe input)
        int256 expInput = int256(x % (10 * SCALE)); // Keep input reasonable
        int256 expSol = expSolidity(expInput);
        int256 expRustResult = expRust(expInput);
        expDiff = uint256(expSol > expRustResult ? expSol - expRustResult : expRustResult - expSol);
        
        // Test ln (ensure x > 0)
        uint256 lnInput = x == 0 ? SCALE : x;
        int256 lnSol = lnSolidity(lnInput);
        int256 lnRustResult = lnRust(lnInput);
        lnDiff = uint256(lnSol > lnRustResult ? lnSol - lnRustResult : lnRustResult - lnSol);
        
        // Test log2
        int256 log2Sol = log2Solidity(lnInput);
        int256 log2RustResult = log2Rust(lnInput);
        log2Diff = uint256(log2Sol > log2RustResult ? log2Sol - log2RustResult : log2RustResult - log2Sol);
        
        // Test log10
        int256 log10Sol = log10Solidity(lnInput);
        int256 log10RustResult = log10Rust(lnInput);
        log10Diff = uint256(log10Sol > log10RustResult ? log10Sol - log10RustResult : log10RustResult - log10Sol);
    }
} 