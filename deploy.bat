@echo off
echo Starting full deployment process...
echo.

echo ===================================
echo  STEP 1: Deploying Backend API
echo ===================================
echo.

cd backend
echo Current directory: %CD%
echo Running backend deployment...

call gcloud builds submit --tag gcr.io/final-app-429707/life-automation-api
if %ERRORLEVEL% neq 0 (
    echo ERROR: Backend build failed!
    cd ..
    pause
    exit /b 1
)

call gcloud run deploy life-automation-api --image gcr.io/final-app-429707/life-automation-api --platform managed --region europe-west2 --allow-unauthenticated
if %ERRORLEVEL% neq 0 (
    echo ERROR: Backend deployment failed!
    cd ..
    pause
    exit /b 1
)

echo Backend deployment completed successfully!
echo.

echo ===================================
echo  STEP 2: Deploying Frontend
echo ===================================
echo.

cd ..\frontend
echo Current directory: %CD%
echo Running frontend deployment...

call flutter clean
if %ERRORLEVEL% neq 0 (
    echo ERROR: Flutter clean failed!
    cd ..
    pause
    exit /b 1
)

call flutter pub get
if %ERRORLEVEL% neq 0 (
    echo ERROR: Flutter pub get failed!
    cd ..
    pause
    exit /b 1
)

call flutter build web --release
if %ERRORLEVEL% neq 0 (
    echo ERROR: Flutter build failed!
    cd ..
    pause
    exit /b 1
)

call firebase deploy
if %ERRORLEVEL% neq 0 (
    echo ERROR: Firebase deployment failed!
    cd ..
    pause
    exit /b 1
)

echo Frontend deployment completed successfully!
echo.

cd ..
echo ===================================
echo  DEPLOYMENT COMPLETE!
echo ===================================
echo Both backend and frontend have been deployed successfully.
echo.
pause
