@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
echo Starting Azura Voyages at http://localhost:5173
start "" http://localhost:5173
call npm run dev
pause
