@echo off
chcp 65001 > nul
title NOAK ERP — Development Mode
echo ========================================================
echo       NOAK ERP — Vite Interactive Development Server
echo ========================================================
echo.
cd /d "%~dp0"
echo Starting development server and opening browser at http://localhost:5173 ...
call npm run dev -- --open
pause
