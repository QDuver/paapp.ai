# 🚀 Quick OAuth Fix

## Current Issue
Your Google OAuth client ID is invalid or doesn't exist. Here's the fastest way to fix it:

## Option 1: Use FlutterFire CLI (Automated)

```bash
# Add Flutter SDK's cache/dart-sdk/bin to your PATH, then run:
flutter pub global activate flutterfire_cli

# If flutterfire command doesn't work, try:
dart pub global run flutterfire_cli:flutterfire configure

# Or try:
%USERPROFILE%\AppData\Local\Pub\Cache\bin\flutterfire configure
```

## Option 2: Manual Configuration (Recommended for immediate fix)

### 1. Create New OAuth Client ID

Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=final-app-429707)

1. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
2. Application type: **Web application**
3. Name: `Life Automation Web`
4. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:8080
   http://localhost
   ```
5. **Authorized redirect URIs**:
   ```
   http://localhost:3000
   http://localhost:8080  
   http://localhost
   ```
6. Click **CREATE**
7. **COPY THE CLIENT ID** (format: `xxxxx-yyyyy.apps.googleusercontent.com`)

### 2. Update Firebase Authentication

Go to [Firebase Console](https://console.firebase.google.com/project/final-app-429707/authentication/providers)

1. Click **Google** provider
2. Paste your new **Web client ID** 
3. Click **Save**

### 3. Update Your Code

Replace this line in `lib/services/auth_service.dart`:

```dart
// Line ~15, replace:
clientId: '1050310982145-YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',

// With your actual client ID:
clientId: 'YOUR_ACTUAL_CLIENT_ID_FROM_STEP_1.apps.googleusercontent.com',
```

### 4. Test

```bash
flutter run -d chrome
```

## 🎯 What to Expect

After this fix:
1. Google popup should appear
2. You should be able to select your Google account
3. Authentication should succeed
4. You'll be redirected to your app's main screen

## 🔍 Troubleshooting

If you still get errors:

1. **Clear browser cache**
2. **Try incognito/private mode**
3. **Check the JavaScript console** for any additional errors
4. **Verify the client ID** matches exactly between Google Cloud Console and Firebase Console

The key is that the OAuth client ID must exist in Google Cloud Console AND be properly configured in Firebase Authentication settings.
