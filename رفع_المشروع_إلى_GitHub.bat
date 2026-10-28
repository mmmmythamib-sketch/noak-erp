@echo off
chcp 65001 > nul
title رفع ونشر منظومة نوك على GitHub Pages
color 0A

set "PATH=C:\Users\MYTHAM\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"

echo ======================================================================
echo           رفع منظومة نوك NOAK ERP وتفعيل GitHub Pages المجاني
echo ======================================================================
echo.

echo [1/3] جاري رفع الأكواد إلى حسابك mmmmythamib-sketch...
echo (إذا ظهرت نافذة تطلب تسجيل الدخول، وافق عليها من المتصفح)
echo.

git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [تنبيه] إذا لم تكن قد أنشأت المستودع بعد، يرجى الضغط على زر
    echo "Create repository" في صفحة GitHub التي ستفتح أمامك الآن، ثم أعد تشغيل هذا الملف.
    start https://github.com/new?name=noak-erp
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] تم رفع كامل المشروع بنجاح إلى GitHub!
echo.
echo [3/3] جاري فتح صفحة إعدادات GitHub Pages لتأكيد الدومين...
start https://github.com/mmmmythamib-sketch/noak-erp/settings/pages

echo.
echo ======================================================================
echo               تهانينا! تم ربط وتفعيل الدومين بنجاح!
echo ======================================================================
echo.
echo دومين موقعك المجاني الدائم على GitHub هو:
echo https://mmmmythamib-sketch.github.io/noak-erp/
echo.
echo (في صفحة Pages المفتوحة أمامك: تأكد من اختيار Source: GitHub Actions)
echo.
pause
