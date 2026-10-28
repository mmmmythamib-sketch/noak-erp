@echo off
chcp 65001 > nul
title NOAK ERP — تشغيل تطبيق سطح المكتب
echo ========================================================
echo       نظام إدارة موارد شركة نوك — NOAK ERP
echo       قسم النجارة والديكور الداخلي & قسم الألمنيوم
echo ========================================================
echo.
echo جاري فحص الملفات المترجمة وتشغيل التطبيق...
cd /d "%~dp0"

if not exist "dist\main\index.cjs" (
    echo جاري بناء ملفات التشغيل لأول مرة...
    call npm run build
)

echo جاري فتح نافذة برنامج NOAK ERP المكتبي...
call npm start

if errorlevel 1 (
    echo.
    echo حدث خطأ أثناء تشغيل التطبيق.
    pause
)
