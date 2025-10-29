import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainApp from "./components/MainApp";
import { AppProvider } from "./contexts/AppContext";
import LoginScreen from "./components/auth/LoginScreen";
import WarmupErrorScreen from "./components/WarmupErrorScreen";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "./services/Firebase";
import { theme } from "./styles/theme";
import { useWarmup } from "./hooks/useWarmup";

// Load icon fonts CSS for web
if (Platform.OS === "web") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/fonts.css";
  document.head.appendChild(link);
}

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: theme.colors.accent,
    background: theme.colors.primary,
    surface: theme.colors.secondary,
  },
};

export default function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [user, setUser] = useState(null);
  const { warmupError, isWarmingUp, performWarmup } = useWarmup();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Import and initialize Firebase first
        const { default: initializeFirebase } = await import("./services/Firebase");
        await initializeFirebase();
        setIsFirebaseInitialized(true);
        const auth = getFirebaseAuth();
        if (auth) {
          onAuthStateChanged(auth, async u => {
            setUser(
              u
                ? {
                    uid: u.uid,
                    email: u.email,
                    photoURL: u.photoURL,
                    displayName: u.displayName,
                  }
                : null
            );
            if (u?.uid) {
              AsyncStorage.setItem("userId", u.uid);
              await performWarmup();
            } else {
              AsyncStorage.removeItem("userId");
            }
            setUserReady(true);
          });
        } else {
          setUserReady(true);
        }
      } catch (error) {
        console.error("Failed to initialize Firebase:", error);
        // Still set initialized to true to avoid eternal loading
        setIsFirebaseInitialized(true);
        setUserReady(true);
      }
    };

    initializeApp();
  }, []);

  // Show splash screen while Firebase initializes
  if (!isFirebaseInitialized || !userReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={paperTheme}>
          <LoginScreen showButton={false} />
        </PaperProvider>
      </GestureHandlerRootView>
    );
  }

  if (!user)
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={paperTheme}>
          <LoginScreen />
        </PaperProvider>
      </GestureHandlerRootView>
    );

  if (isWarmingUp)
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={paperTheme}>
          <LoginScreen showButton={false} />
        </PaperProvider>
      </GestureHandlerRootView>
    );

  if (warmupError)
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={paperTheme}>
          <WarmupErrorScreen error={warmupError} onRetry={performWarmup} />
        </PaperProvider>
      </GestureHandlerRootView>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <AppProvider>
          <MainApp />
        </AppProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
