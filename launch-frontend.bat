@echo off
echo 🚀 Starting Fluent Blended Math Challenge Frontend...
echo.
echo 📍 Frontend will be available at: http://localhost:8000
echo 🌐 Network: Fluent DevNet (Chain ID: 20993)
echo 🦀 Rust Contract: 0x87b99c706e17211f313e21f1ed98782e19e91fb2
echo 💎 Solidity Contract: 0xafc63f12b732701526f48e8256ad35c888336e54
echo.
echo Press Ctrl+C to stop the server
echo.

cd prb-math-blended\frontend
python -m http.server 8000

pause 