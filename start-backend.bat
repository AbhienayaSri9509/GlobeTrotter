@echo off
title GlobeTrotter Backend Server
echo ========================================
echo   GlobeTrotter Backend Server
echo ========================================
echo.
echo Starting server on http://localhost:5000
echo.
echo IMPORTANT: Keep this window open!
echo.
cd /d "%~dp0backend"
if not exist "package.json" (
    echo ERROR: Cannot find backend folder!
    echo Make sure this file is in the GlobeTrotter root directory.
    pause
    exit /b 1
)
npm start
pause

