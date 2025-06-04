// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IPrbMathRust {
    function sqrt(uint256 x) external view returns (int256);
    function exp(int256 x) external view returns (int256);
    function ln(uint256 x) external view returns (int256);
    function log2(uint256 x) external view returns (int256);
    function log10(uint256 x) external view returns (int256);
}

contract prbMathBlended {
    
    IPrbMathRust public prbMathRust;

    constructor(address PrbMathRustAddress) {
        prbMathRust = IPrbMathRust(PrbMathRustAddress);
    }

    function sqrt(uint256 x) external view returns (int256) {
        int256 result = prbMathRust.sqrt(x);
        return result;
    }

    function exp(int256 x) external view returns (int256) {
        int256 result = prbMathRust.exp(x);
        return result;
    }

    function ln(uint256 x) external view returns (int256) {
        int256 result = prbMathRust.ln(x);
        return result;
    }

    function log2(uint256 x) external view returns (int256) {
        int256 result = prbMathRust.log2(x);
        return result;
    }

    function log10(uint256 x) external view returns (int256) {
        int256 result = prbMathRust.log10(x);
        return result;
    }
}
