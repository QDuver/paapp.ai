# 🔧 URGENT: Create Web OAuth Client ID

## ❗ The Problem
You have Firebase configured, but you're missing a **WEB** OAuth client ID. The iOS client ID you have won't work for web authentication.

## 🎯 Step-by-Step Solution

### Step 1: Create Web OAuth Client ID
1. **Click this link**: https://console.cloud.google.com/apis/credentials?project=final-app-429707
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth 2.0 Client IDs"**
4. Choose **"Web application"**
5. Name: `Life Automation Web`
6. **Authorized JavaScript origins** - Add these EXACTLY:
   ```
   http://localhost:3000
   http://localhost:8080
   http://localhost
   https://localhost:3000
   https://localhost:8080
   ```
7. **Authorized redirect URIs** - Add these EXACTLY:
   ```
   http://localhost:3000
   http://localhost:8080
   http://localhost
   https://localhost:3000
   https://localhost:8080
   ```
8. Click **"CREATE"**
9. **COPY THE CLIENT ID** (format: `1050310982145-xxxxxxxxx.apps.googleusercontent.com`)

### Step 2: Update Your Code
In `lib/services/auth_service.dart`, replace this line:
```dart
clientId: '1050310982145-REPLACE_THIS_PART.apps.googleusercontent.com',
```

With your actual client ID:
```dart
clientId: '1050310982145-YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com',
```

### Step 3: Update Firebase Console (Optional but Recommended)
1. Go to: https://console.firebase.google.com/project/final-app-429707/authentication/providers
2. Click **Google** provider
3. In **"Web client ID"** field, paste your new client ID from Step 1
4. Click **Save**

### Step 4: Test
```bash
flutter run -d chrome
```

## 🚨 Important Notes

- **Different client IDs for different platforms**: 
  - Web: New one you're creating
  - iOS: `1050310982145-acqklksuo63jrnnfd2vf2oln3id4jl7c.apps.googleusercontent.com` (already exists)
  - Android: Will be different when you set up Android

- **The error you're getting** means Google can't find the OAuth client ID you're trying to use
- **This is a one-time setup** - once done, it works forever

## ✅ Expected Result
After completing these steps, Google Sign-In popup should work without the "OAuth client was not found" error.

## 🔍 If Still Having Issues
1. **Double-check the client ID** in your code matches exactly what you copied
2. **Clear browser cache** and try in incognito mode
3. **Wait 5-10 minutes** after creating the OAuth client (Google needs time to propagate)
4. **Check browser console** for additional error messages
