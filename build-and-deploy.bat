@echo off
echo ==== Fluent Blended App - Build and Deploy ====
echo.

echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is required but not installed. Aborting.
    exit /b 1
)

where gblend >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: gblend is required but not installed. Aborting.
    exit /b 1
)

where forge >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: forge is required but not installed. Aborting.
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo Installing Node.js dependencies...
    call npm install
)

echo.
echo Starting deployment...
call node deploy.js

REM If deployment was successful, run the test script
if %ERRORLEVEL% EQU 0 if exist deployment-result.json (
    echo.
    echo Deployment succeeded! Running tests...
    call node test.js
) else (
    echo.
    echo Deployment failed or deployment-result.json not found. Skipping tests.
    exit /b 1
)

echo.
echo Build and deployment process completed! 