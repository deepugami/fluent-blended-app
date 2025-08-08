// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IPrbMathRust {
    function sqrt(uint256 x) external view returns (uint256);
    function exp(uint256 x) external view returns (uint256);
    function ln(uint256 x) external view returns (uint256);
    function log2(uint256 x) external view returns (uint256);
    function log10(uint256 x) external view returns (uint256);
}

contract prbMathBlended {
    
    IPrbMathRust public prbMathRust;

    constructor(address PrbMathRustAddress) {
        prbMathRust = IPrbMathRust(PrbMathRustAddress);
    }
    
    function sqrt(uint256 x) external view returns (int256) {
        uint256 result = prbMathRust.sqrt(x);
        return int256(result);
    }

    function exp(int256 x) external view returns (int256) {
        // Convert int256 to uint256 for the Rust function
        // Handle negative values by returning minimal result
        uint256 ux = x >= 0 ? uint256(x) : 0;
        uint256 result = prbMathRust.exp(ux);
        return int256(result);
    }

    function ln(uint256 x) external view returns (int256) {
        uint256 result = prbMathRust.ln(x);
        return int256(result);
    }

    function log2(uint256 x) external view returns (int256) {
        uint256 result = prbMathRust.log2(x);
        return int256(result);
    }

    function log10(uint256 x) external view returns (int256) {
        uint256 result = prbMathRust.log10(x);
        return int256(result);
    }
}