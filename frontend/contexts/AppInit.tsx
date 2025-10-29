import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../services/Firebase";
import { apiClient } from "../utils/apiClient";

interface UserType {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
}

interface AppInitContextType {
  user: UserType | null;
  isFirebaseInitialized: boolean;
  authReady: boolean;
  isWarmingUp: boolean;
  warmupError: string | null;
}

const AppInitContext = createContext<AppInitContextType | undefined>(undefined);

interface AppInitProviderProps {
  children: ReactNode;
}

export const AppInitProvider = ({ children }: AppInitProviderProps) => {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [authReady, setUserReady] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [warmupError, setWarmupError] = useState<string | null>(null);
  const [isWarmingUp, setIsWarmingUp] = useState(false);

  const performWarmup = async () => {
    setWarmupError(null);
    setIsWarmingUp(true);

    await apiClient.get("warmup", {
      silent: true,
      onError: (error) => {
        setWarmupError(error.message || "Failed to connect to server");
      },
    });

    setIsWarmingUp(false);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { default: initializeFirebase } = await import("../services/Firebase");
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
        setIsFirebaseInitialized(true);
        setUserReady(true);
      }
    };

    initializeApp();
  }, []);

  const contextValue: AppInitContextType = {
    user,
    isFirebaseInitialized,
    authReady,
    isWarmingUp,
    warmupError,
  };

  return <AppInitContext.Provider value={contextValue}>{children}</AppInitContext.Provider>;
};

export const useAppInit = (): AppInitContextType => {
  const context = useContext(AppInitContext);

  if (context === undefined) {
    throw new Error("useAppInit must be used within an AppInitProvider");
  }

  return context;
};

export { AppInitContext };
