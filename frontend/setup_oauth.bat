@echo off
echo =================================================================
echo GOOGLE OAUTH CLIENT ID SETUP FOR FIREBASE
echo =================================================================
echo.
echo 1. Open this link in your browser:
echo https://console.cloud.google.com/apis/credentials?project=final-app-429707
echo.
echo 2. Click "CREATE CREDENTIALS" - "OAuth 2.0 Client IDs"
echo.
echo 3. Choose "Web application"
echo.
echo 4. Add these Authorized JavaScript origins:
echo    - http://localhost:3000
echo    - http://localhost:8080
echo    - http://localhost
echo.
echo 5. Add these Authorized redirect URIs:
echo    - http://localhost:3000
echo    - http://localhost:8080
echo    - http://localhost
echo.
echo 6. Click CREATE and copy the Client ID
echo.
echo 7. Open Firebase Console:
echo https://console.firebase.google.com/project/final-app-429707/authentication/providers
echo.
echo 8. Click Google provider and paste the Client ID in "Web client ID"
echo.
echo 9. Update your code:
echo    Edit: lib/services/auth_service.dart
echo    Replace: REPLACE_WITH_YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
echo    With your actual client ID from step 6
echo.
echo Press any key to exit...
pause >nul
