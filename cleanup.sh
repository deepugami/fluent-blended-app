#!/bin/bash
echo "Cleaning up old frontend files..."

# Backup old frontend folder
if [ -d "frontend" ]; then
  echo "Creating backup of old frontend in frontend_old..."
  if [ -d "frontend_old" ]; then
    rm -rf frontend_old
  fi
  mv frontend frontend_old
  echo "Old frontend backed up."
else
  echo "No old frontend directory found to clean up."
fi

# Remove temporary directories
rm -rf temp-blended/
rm -rf temp-deploy/
rm -rf temp/
rm -rf deploy-temp/
rm -rf eKIITedublended-appdeploymentscripts/
rm -rf "./-p/"  # Use quotes and ./ to handle directory with dash

# Remove duplicate/old frontend directories
rm -rf frontend-old/
rm -rf prb-math-react-frontend/

# Remove temporary project directories 
rm -rf prbMathBlended/

# Clean build artifacts not needed in git
rm -rf target/
rm -rf rust/target/
rm -rf */node_modules/
rm -rf */*/node_modules/

echo "Cleanup completed!" 