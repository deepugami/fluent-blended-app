#!/bin/bash

set -e # Exit on error

echo "==== Fluent Blended App - Build and Deploy ===="
echo ""

# Check if required tools are installed
echo "Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required but not installed. Aborting."; exit 1; }
command -v gblend >/dev/null 2>&1 || { echo "Error: gblend is required but not installed. Aborting."; exit 1; }
command -v forge >/dev/null 2>&1 || { echo "Error: forge is required but not installed. Aborting."; exit 1; }

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Run the deployment script
echo ""
echo "Starting deployment..."
node deploy.js

# If deployment was successful, run the test script
if [ $? -eq 0 ] && [ -f "deployment-result.json" ]; then
    echo ""
    echo "Deployment succeeded! Running tests..."
    node test.js
else
    echo ""
    echo "Deployment failed or deployment-result.json not found. Skipping tests."
    exit 1
fi

echo ""
echo "Build and deployment process completed!" 