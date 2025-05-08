@echo off
echo Cleaning up old frontend files...

REM Backup old frontend folder
if exist frontend (
  echo Creating backup of old frontend in frontend_old...
  if exist frontend_old rmdir /S /Q frontend_old
  ren frontend frontend_old
  echo Old frontend backed up.
) else (
  echo No old frontend directory found to clean up.
)

echo Cleanup completed! 