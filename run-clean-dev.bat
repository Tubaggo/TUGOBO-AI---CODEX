@echo off
cd /d "%~dp0"

echo Killing node processes...
taskkill /F /IM node.exe >nul 2>&1

echo Waiting...
timeout /t 2 /nobreak >nul

echo Cleaning .next...
powershell -ExecutionPolicy Bypass -Command "if (Test-Path .next) { Remove-Item -Recurse -Force .next }"

echo Waiting...
timeout /t 2 /nobreak >nul

echo Starting dev server...
start cmd /k "npm run dev"

exit