#!/bin/bash

# Manual verification script for Blockscout
echo "🔍 Manual Contract Verification Script"
echo "======================================"

# Contract details
CONTRACT_ADDRESS="0x5e44930a479f34fbc1c9657c68f5b7f761363769"
RUST_CONTRACT_ADDRESS="0x447cc72447d69cf9e0622756ff447725a8ee5fa6"
BLOCKSCOUT_URL="https://blockscout.dev.gblend.xyz/api/"
RPC_URL="https://rpc.dev.gblend.xyz/"

echo "📋 Contract Details:"
echo "Contract Address: $CONTRACT_ADDRESS"
echo "Rust Contract Address: $RUST_CONTRACT_ADDRESS"
echo "Blockscout URL: $BLOCKSCOUT_URL"
echo ""

# Try different verification approaches
echo "🔄 Attempt 1: Standard verification with optimization"
forge verify-contract $CONTRACT_ADDRESS \
    src/prbMathBlended.sol:prbMathBlended \
    --rpc-url $RPC_URL \
    --verifier blockscout \
    --verifier-url $BLOCKSCOUT_URL \
    --constructor-args $(cast abi-encode "constructor(address)" $RUST_CONTRACT_ADDRESS) \
    --compiler-version "0.8.30" \
    --num-of-optimizations 200 \
    --watch

echo ""
echo "⏳ Waiting 15 seconds before next attempt..."
sleep 15

echo "🔄 Attempt 2: Verification without optimization"
forge verify-contract $CONTRACT_ADDRESS \
    src/prbMathBlended.sol:prbMathBlended \
    --rpc-url $RPC_URL \
    --verifier blockscout \
    --verifier-url $BLOCKSCOUT_URL \
    --constructor-args $(cast abi-encode "constructor(address)" $RUST_CONTRACT_ADDRESS) \
    --compiler-version "0.8.30" \
    --num-of-optimizations 0 \
    --watch

echo ""
echo "⏳ Waiting 15 seconds before final attempt..."
sleep 15

echo "🔄 Attempt 3: Verification with different optimization count"
forge verify-contract $CONTRACT_ADDRESS \
    src/prbMathBlended.sol:prbMathBlended \
    --rpc-url $RPC_URL \
    --verifier blockscout \
    --verifier-url $BLOCKSCOUT_URL \
    --constructor-args $(cast abi-encode "constructor(address)" $RUST_CONTRACT_ADDRESS) \
    --compiler-version "0.8.30" \
    --num-of-optimizations 1000 \
    --watch

echo ""
echo "✅ Verification attempts completed!"
echo "📖 Check Blockscout at: https://blockscout.dev.gblend.xyz/address/$CONTRACT_ADDRESS"
