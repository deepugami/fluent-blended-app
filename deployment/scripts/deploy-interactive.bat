@echo off
echo This script will deploy the prbMathBlended contract to the Fluent testnet
set PRIVATE_KEY=0xd301a675236c83b64727f2e257e16aa3d99da178ba6de2d8534da98f0dc73daa
echo Using provided private key...
echo.
echo Running deployment script...
node deploy.js
pause
