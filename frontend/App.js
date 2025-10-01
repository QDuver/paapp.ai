import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainApp from "./components/MainApp";
import { AppProvider } from "./contexts/AppContext";
import LoginScreen from "./components/auth/LoginScreen";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "./services/Firebase";

export default function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [user, setUser] = useState(null);
  const [skipAuth, setSkipAuth] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for skipAuth parameter in URL (both query param and path formats)
        if (typeof window !== "undefined" && window.location) {
          const urlParams = new URLSearchParams(window.location.search);
          const pathname = window.location.pathname;
          const shouldSkipAuth =
            urlParams.get("skipAuth") === "true" ||
            pathname.includes("skipAuth=true");

          if (shouldSkipAuth) {
            setSkipAuth(true);
            setIsFirebaseInitialized(true);
            setUserReady(true);
            setUser({ uid: "test-user", email: "test@example.com" });
            return;
          }
        }

        // Import and initialize Firebase first
        const { default: initializeFirebase } = await import(
          "./services/Firebase"
        );
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
              // Warmup the backend connection - wait for it to complete
              try {
                const token = await u.getIdToken();
                const { DEV_CONFIG, PROD_CONFIG } = await import(
                  "./config/env"
                );
                const baseUrl = __DEV__
                  ? typeof window !== "undefined" && window.location
                    ? `http://localhost:${DEV_CONFIG.LOCAL_PORT}`
                    : `http://${DEV_CONFIG.LOCAL_IP}:${DEV_CONFIG.LOCAL_PORT}`
                  : PROD_CONFIG.API_URL;

                const response = await fetch(`${baseUrl}/warmup`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                });
                const data = await response.json();
                console.log("[WARMUP] Backend warmed up:", data);
              } catch (error) {
                console.error("[WARMUP] Error:", error);
              }
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

  // Show loading screen while Firebase initializes
  if (!isFirebaseInitialized || !userReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: "#666" }}>Initializing...</Text>
      </View>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <AppProvider skipAuth={skipAuth}>
      <MainApp user={user} />
    </AppProvider>
  );
}
