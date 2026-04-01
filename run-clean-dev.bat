@echo off
cd /d "%~dp0"

echo [1/4] Killing node processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/4] Waiting...
timeout /t 2 >nul

echo [3/4] Cleaning .next...
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Path '.next') { Remove-Item '.next' -Recurse -Force -ErrorAction SilentlyContinue }"

echo [4/4] Starting dev server...
npm run dev

pause