@echo off
title GlobeTrotter - Starting Servers
echo ========================================
echo   Starting GlobeTrotter Application
echo ========================================
echo.
cd /d "%~dp0"
echo Starting Backend Server on port 5000...
start "GlobeTrotter Backend" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server on port 3000...
start "GlobeTrotter Frontend" cmd /k "cd /d %~dp0frontend && npm start"
echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two windows will open - keep both open!
echo.
echo Press any key to close this window...
echo (Servers will continue running in their windows)
pause >nul

