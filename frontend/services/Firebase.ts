import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseConfig() {
  const platform = Platform.OS;

  let apiKey: string | undefined;
  let appId: string | undefined;

  if (platform === "web") {
    apiKey = process.env.EXPO_PUBLIC_FIREBASE_WEB_API_KEY || "AIzaSyBdK8faj02cuSahzFa9lv4IXv_oqaeQ6ZE";
    appId = process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID || "1:1050310982145:web:9356829b666d63cf7c9e00";
  } else if (platform === "android") {
    apiKey = process.env.EXPO_PUBLIC_FIREBASE_ANDROID_API_KEY || "AIzaSyAhIctV7kkjeQecDRHtRD_4Zr2cil7MMmI";
    appId = process.env.EXPO_PUBLIC_FIREBASE_ANDROID_APP_ID || "1:1050310982145:android:418f3a2f4d7b10897c9e00";
  } else if (platform === "ios") {
    apiKey = process.env.EXPO_PUBLIC_FIREBASE_IOS_API_KEY;
    appId = process.env.EXPO_PUBLIC_FIREBASE_IOS_APP_ID;
  }

  return {
    apiKey,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "final-app-429707.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "final-app-429707",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "final-app-429707.firebasestorage.app",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1050310982145",
    appId,
  };
}

export default function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (getApps().length === 0) {
    firebaseApp = initializeApp(getFirebaseConfig());

    if (Platform.OS === "web") {
      auth = getAuth(firebaseApp);
    } else {
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  } else {
    firebaseApp = getApps()[0];
    auth = getAuth(firebaseApp);
  }

  return firebaseApp;
}

export function getFirebaseAuth(): Auth | null {
  return auth;
}
