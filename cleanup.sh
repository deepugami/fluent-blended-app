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

echo "Cleanup completed!" 