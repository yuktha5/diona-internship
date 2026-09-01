@echo off
echo ===================================================
echo   WCB Manitoba - Dynamic PDF Generation Suite
echo ===================================================
echo Starting local web server...
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Launching Python HTTP Server at http://localhost:8000
    start http://localhost:8000
    python -m http.server 8000
    goto end
)

where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Launching NPX Serve at http://localhost:3000
    start http://localhost:3000
    npx -y serve -l 3000 .
    goto end
)

echo No Python or Node.js server found. Opening directly in browser...
start index.html

:end
