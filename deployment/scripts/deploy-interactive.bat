@echo off
echo This script will deploy the prbMathBlended contract to the Fluent testnet
echo Please provide your test wallet private key (this is only used for educational purposes):
set /p PRIVATE_KEY=d301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa (without 0x prefix): 
set PRIVATE_KEY=0x%PRIVATE_KEY%
echo.
echo Running deployment script...
node deploy.js
pause
