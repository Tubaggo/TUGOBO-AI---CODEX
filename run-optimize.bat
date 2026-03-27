@echo off
powershell -ExecutionPolicy Bypass -File "%~dp0optimize-pc.ps1" -Aggressive -CloseHeavyApps
