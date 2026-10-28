@echo off
chcp 65001 > nul
title NOAK ERP — بناء ملف التثبيت المكتبي EXE
echo ========================================================
echo       نظام إدارة موارد شركة نوك — NOAK ERP
echo       بناء حزمة التثبيت لنظام Windows (.exe)
echo ========================================================
echo.
cd /d "%~dp0"
echo جاري بناء ملفات المشروع وحزمة التثبيت بواسطة electron-builder...
call npm run package:win

echo.
if exist "release" (
    echo تم إنشاء ملف التثبيت بنجاح في مجلد release!
    explorer release
) else (
    echo تعذر العثور على مجلد release، يرجى مراجعة سجل الأخطاء أعلاه.
)
pause
