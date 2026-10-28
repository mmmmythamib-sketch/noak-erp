@echo off
chcp 65001 > nul
title NOAK ERP — Desktop Application
echo ========================================================
echo       NOAK ERP — Desktop Application Launcher
echo ========================================================
echo.
cd /d "%~dp0"

if not exist "dist\main\index.cjs" (
    echo Building application bundles...
    call npm run build
)

echo Starting Electron Desktop App...
call npm start

if errorlevel 1 (
    echo.
    echo An error occurred while starting the application.
    pause
)
