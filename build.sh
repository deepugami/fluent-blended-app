#!/bin/bash
set -e  # Exit on error
echo "Building PRB Math Blended App..."

# Build the Rust WASM package
cd rust
cargo build --release --target wasm32-unknown-unknown
if [ $? -ne 0 ]; then
  echo "Failed to build Rust WASM package"
  cd ..
  exit 1
fi
echo "Rust WASM build complete!"

# Copy WASM to deployment folder
cd ..
mkdir -p deployment
cp -f rust/target/wasm32-unknown-unknown/release/prb_math_wasm.wasm deployment/

# Copy Solidity contract to deployment folder
mkdir -p solidity
cp -f solidity/prbMathBlended.sol deployment/

# Build React frontend
cd prb-math-react-frontend
npm install
npm run build
if [ $? -ne 0 ]; then
  echo "Failed to build React frontend"
  cd ..
  exit 1
fi
cd ..

# Copy React frontend files to deployment folder
mkdir -p deployment/frontend
cp -rf prb-math-react-frontend/dist/* deployment/frontend/

echo "Build completed successfully!"
echo "All files have been copied to the 'deployment' folder" 