@echo off
cd /d "%~dp0"

echo Killing node processes...
taskkill /F /IM node.exe >nul 2>&1

echo Running typecheck...
call npm run typecheck
if errorlevel 1 pause & exit /b 1

echo Running build...
call npm run build
if errorlevel 1 pause & exit /b 1

echo Done.
pause