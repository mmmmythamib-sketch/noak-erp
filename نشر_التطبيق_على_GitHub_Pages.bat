@echo off
chcp 65001 > nul
title نشر منظومة نوك NOAK ERP على GitHub Pages
color 0A

set "PATH=C:\Users\MYTHAM\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;C:\Program Files\GitHub CLI;%PATH%"

echo ======================================================================
echo           نشر منظومة نوك NOAK ERP على دومين GitHub Pages المجاني
echo ======================================================================
echo.

:: 1. التحقق من بناء النسخة المحدثة للويب
echo [1/4] جاري تجهيز وبناء ملفات الموقع للويب...
call npm run build:renderer
if %errorlevel% neq 0 (
    echo [خطأ] فشل بناء ملفات الموقع. يرجى التحقق من الأخطاء.
    pause
    exit /b %errorlevel%
)
echo [✓] تم بناء ملفات الموقع بنجاح داخل dist/renderer.
echo.

:: 2. التحقق من تسجيل الدخول إلى GitHub
echo [2/4] جاري فحص حالة الاتصال بحساب GitHub...
gh auth status > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [تنبيه] أنت غير مسجل الدخول إلى GitHub حالياً على هذا الجهاز.
    echo سيتم الآن فتح المتصفح لتسجيل الدخول إلى حسابك في GitHub بضغطة واحدة...
    echo.
    gh auth login -w -p https
    if %errorlevel% neq 0 (
        echo [خطأ] تعذر تسجيل الدخول. يرجى المحاولة لاحقاً.
        pause
        exit /b 1
    )
)
echo [✓] تم التحقق من تسجيل الدخول إلى GitHub بنجاح!
echo.

:: 3. الحصول على اسم المستخدم
for /f "tokens=*" %%i in ('gh api user --jq .login') do set GITHUB_USER=%%i
echo مرحباً بك يا: %GITHUB_USER%
echo.

:: 4. فحص هل المستودع موجود بالفعل أو إنشاؤه
echo [3/4] جاري تجهيز مستودع GitHub (noak-erp)...
git remote get-url origin > nul 2>&1
if %errorlevel% neq 0 (
    echo جاري إنشاء المستودع noak-erp على حسابك في GitHub ورفع الأكواد...
    gh repo create noak-erp --public --source=. --remote=origin --push
) else (
    echo المستودع مرتبط مسبقاً، جاري رفع التحديثات الجديدة...
    git push -u origin main
)

:: 5. تفعيل GitHub Pages
echo.
echo [4/4] جاري نشر الموقع وتفعيله على GitHub Pages...
call npm run deploy
if %errorlevel% neq 0 (
    echo [تنبيه] المحاولة البديلة عبر GitHub Actions...
    git push origin main
)

echo.
echo ======================================================================
echo               تهانينا! تم حجز ونشر التطبيق بنجاح!
echo ======================================================================
echo.
echo دومين موقعك المجاني الدائم هو:
echo https://%GITHUB_USER%.github.io/noak-erp/
echo.
echo (ملاحظة: عند النشر لأول مرة قد يستغرق خادم GitHub دقيقة أو دقيقتين لبدء العمل)
echo.
start https://%GITHUB_USER%.github.io/noak-erp/
pause
