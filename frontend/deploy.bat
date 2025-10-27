@echo off
echo ========================================
echo Deploying paapp.ai to Firebase
echo ========================================
echo.

echo [1/3] Building web app with Expo...
call npm run build:web
if errorlevel 1 (
    echo ERROR: Build failed!
    exit /b 1
)
echo Build completed successfully!
echo.

echo [2/3] Deploying to Firebase Hosting...
call firebase deploy --only hosting
if errorlevel 1 (
    echo ERROR: Firebase deployment failed!
    exit /b 1
)
echo.

echo ========================================
echo Deployment completed successfully!
echo ========================================
