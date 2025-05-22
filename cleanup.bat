@echo off

REM Remove temporary directories
rmdir /s /q temp-blended
rmdir /s /q temp-deploy
rmdir /s /q temp
rmdir /s /q deploy-temp
rmdir /s /q eKIITedublended-appdeploymentscripts
rmdir /s /q ".\-p"

REM Remove duplicate/old frontend directories
rmdir /s /q frontend-old
rmdir /s /q prb-math-react-frontend

REM Remove temporary project directories 
rmdir /s /q prbMathBlended

REM Clean build artifacts not needed in git
rmdir /s /q target
rmdir /s /q rust\target
rmdir /s /q node_modules

echo Cleanup completed! 