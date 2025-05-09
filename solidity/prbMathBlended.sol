// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title prbMathBlended
 * @dev Solidity contract that interfaces with a Rust implementation of PRB Math functions.
 * This smart contract acts as a facade that forwards calls to the Rust implementation
 * deployed on the Fluent network. It provides a familiar Solidity interface for
 * developers while leveraging the performance benefits of Rust.
 * 
 * The Rust implementation uses the libm library for high-precision floating-point calculations.
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
    
    // Events
    event RustContractUpdated(address indexed oldContract, address indexed newContract);
    
    // Error messages
    error InvalidRustContract();
    error MathError(string message);

    /**
     * @dev Sets the address of the Rust contract implementation
     * @param _rustContract Address of the deployed Rust contract
     */
    constructor(address _rustContract) {
        if (_rustContract == address(0)) revert InvalidRustContract();
        rustContract = _rustContract;
    }

    /**
     * @dev Calculates the square root using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The square root of x as a fixed-point number with 18 decimals
     */
    function sqrt(uint256 x) public view returns (uint256) {
        return RustMath(rustContract).sqrt(x);
    }

    /**
     * @dev Calculates e^x using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The value of e^x as a fixed-point number with 18 decimals
     * @notice For values outside the range [-40, 40], results may be clamped
     */
    function exp(int256 x) public view returns (int256) {
        return RustMath(rustContract).exp(x);
    }

    /**
     * @dev Calculates the natural logarithm using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The natural logarithm of x as a fixed-point number with 18 decimals
     * @notice Returns a minimum value for x = 0 as the logarithm is undefined
     */
    function ln(uint256 x) public view returns (int256) {
        if (x == 0) revert MathError("ln(0) is undefined");
        return RustMath(rustContract).ln(x);
    }

    /**
     * @dev Calculates the base-10 logarithm using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The base-10 logarithm of x as a fixed-point number with 18 decimals
     * @notice Returns a minimum value for x = 0 as the logarithm is undefined
     */
    function log10(uint256 x) public view returns (int256) {
        if (x == 0) revert MathError("log10(0) is undefined");
        return RustMath(rustContract).log10(x);
    }

    /**
     * @dev Calculates the base-2 logarithm using the Rust implementation
     * @param x The input value as a fixed-point number with 18 decimals
     * @return The base-2 logarithm of x as a fixed-point number with 18 decimals
     * @notice Returns a minimum value for x = 0 as the logarithm is undefined
     */
    function log2(uint256 x) public view returns (int256) {
        if (x == 0) revert MathError("log2(0) is undefined");
        return RustMath(rustContract).log2(x);
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
} 