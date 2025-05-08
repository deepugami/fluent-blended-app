@echo off
echo Building PRB Math Blended App...

REM Build the Rust WASM package
cd rust
cargo build --release --target wasm32-unknown-unknown
if %ERRORLEVEL% neq 0 (
  echo Failed to build Rust WASM package
  cd ..
  exit /b %ERRORLEVEL%
)
echo Rust WASM build complete!

REM Copy WASM to deployment folder
cd ..
if not exist deployment mkdir deployment
copy /Y rust\target\wasm32-unknown-unknown\release\prb_math_wasm.wasm deployment\

REM Copy Solidity contract to deployment folder
if not exist solidity mkdir solidity
copy /Y solidity\prbMathBlended.sol deployment\

REM Build React frontend
cd prb-math-react-frontend
call npm install
call npm run build
if %ERRORLEVEL% neq 0 (
  echo Failed to build React frontend
  cd ..
  exit /b %ERRORLEVEL%
)
cd ..

REM Copy React frontend files to deployment folder
if not exist deployment\frontend mkdir deployment\frontend
xcopy /Y /E /I prb-math-react-frontend\dist\* deployment\frontend\

echo Build completed successfully!
echo All files have been copied to the "deployment" folder 