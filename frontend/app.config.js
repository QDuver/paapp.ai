require('dotenv').config();

export default {
  expo: {
    name: "paapp.ai",
    slug: "paappai",
    owner: "quentind38",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "com.aiapps.routineassistant",
    assetBundlePatterns: [
      "**/*"
    ],
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.aiapps.routineassistant"
    },
    android: {
      package: "com.aiapps.routineassistant",
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicons/favicon.ico",
      bundler: "metro"
    },
    plugins: [
      "expo-font",
      "expo-web-browser",
      "expo-dev-client"
    ],
    extra: {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_WEB_API_KEY: process.env.FIREBASE_WEB_API_KEY,
      FIREBASE_WEB_APP_ID: process.env.FIREBASE_WEB_APP_ID,
      FIREBASE_WEB_CLIENT_ID: process.env.FIREBASE_WEB_CLIENT_ID,
      FIREBASE_ANDROID_API_KEY: process.env.FIREBASE_ANDROID_API_KEY,
      FIREBASE_ANDROID_APP_ID: process.env.FIREBASE_ANDROID_APP_ID,
      FIREBASE_ANDROID_CLIENT_ID: process.env.FIREBASE_ANDROID_CLIENT_ID,
      FIREBASE_IOS_API_KEY: process.env.FIREBASE_IOS_API_KEY,
      FIREBASE_IOS_APP_ID: process.env.FIREBASE_IOS_APP_ID,
      FIREBASE_IOS_CLIENT_ID: process.env.FIREBASE_IOS_CLIENT_ID,
      FIREBASE_IOS_BUNDLE_ID: process.env.FIREBASE_IOS_BUNDLE_ID,
    }
  }
};
