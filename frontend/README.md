# Routine Assistant Expo React Native App

A "Hello World" React Native application built with Expo.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (optional, but recommended for easier development)

### Installation

1. Navigate to the project directory:

   ```cmd
   cd aiapps
   ```

2. Install dependencies (already done during project creation):
   ```cmd
   npm install
   ```

### Running the App

#### Option 1: Using Expo Development Build

```cmd
npm start
```

This will open Expo Developer Tools in your browser. You can then:

- Scan the QR code with the Expo Go app on your phone
- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator (macOS only)
- Press `w` to run in web browser

#### Option 2: Platform-specific commands

```cmd
npm run android    # Run on Android
npm run ios        # Run on iOS (macOS only)
npm run web        # Run in web browser
```

### Expo Go App

Download the Expo Go app on your phone:

- [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [iOS](https://apps.apple.com/app/expo-go/id982107779)

## Project Structure

- `App.js` - Main application component
- `package.json` - Dependencies and scripts
- `app.json` - Expo configuration
- `babel.config.js` - Babel configuration

## Features

- ✅ Hello World display with Expo
- ✅ Dark/Light mode support
- ✅ Safe area handling
- ✅ Responsive design
- ✅ Cross-platform (iOS, Android, Web)
- ✅ Easy development with Expo Go

## Advantages of Expo

- 🚀 Faster development cycle
- 📱 Test on real devices without complex setup
- 🌐 Web support out of the box
- 🔧 Over-the-air updates
- 📦 Managed workflow with pre-configured build tools

## Next Steps

You can start building your life automation features by:

1. Adding new screens with Expo Router
2. Using Expo's built-in APIs (camera, location, notifications, etc.)
3. Connecting to your backend API
4. Adding state management
5. Publishing to app stores with EAS Build
