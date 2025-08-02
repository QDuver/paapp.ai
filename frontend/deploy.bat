@echo off
echo ========================================
echo    Flutter Firebase Deployment Script
echo ========================================
echo.

REM Change to the project directory
cd /d "%~dp0"

echo [1/4] Cleaning previous build...
flutter clean
if %errorlevel% neq 0 (
    echo ERROR: Flutter clean failed!
    pause
)

echo.
echo [2/4] Getting dependencies...
flutter pub get
if %errorlevel% neq 0 (
    echo ERROR: Flutter pub get failed!
    pause
)

echo.
echo [3/4] Building Flutter web app...
flutter build web --release
if %errorlevel% neq 0 (
    echo ERROR: Flutter build web failed!
    pause
)

echo.
echo [4/4] Deploying to Firebase...
firebase deploy
if %errorlevel% neq 0 (
    echo ERROR: Firebase deploy failed!
    echo Make sure you have Firebase CLI installed and are logged in.
    echo Run: npm install -g firebase-tools
    echo Then: firebase login
    pause
)

echo.
echo ========================================
echo     Deployment completed successfully!
echo ========================================
echo.
echo Your app has been deployed to Firebase Hosting.
echo.
pause
