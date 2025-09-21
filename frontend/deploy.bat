@echo off
echo Building React Native Expo web application...
call npx expo export --platform web
echo Build complete!

echo Deploying to Firebase Hosting...
call firebase deploy
echo Deployment complete!
pause