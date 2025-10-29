import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../services/Firebase";
import { FirestoreDocAbstract } from "../models/Abstracts";
import { Exercises } from "../models/Exercises";
import { Meals } from "../models/Meals";
import { Routines } from "../models/Routines";
import { Settings } from "../models/Settings";
import { Groceries } from "../models/Groceries";
import { apiClient } from "../utils/apiClient";

export interface DataType {
  routines: Routines;
  exercises: Exercises;
  meals: Meals;
  settings: Settings;
}

interface UserType {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
}

interface AppContextType {
  data: DataType | undefined;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<DataType | undefined>>;
  refreshCounter: number;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
  user: UserType | null;
  isFirebaseInitialized: boolean;
  userReady: boolean;
  isWarmingUp: boolean;
  warmupError: string | null;
  performWarmup: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [data, setData] = useState<DataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [userReady, setUserReady] = useState(false);
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

  useEffect(() => {
    if (!user || !userReady) return;

    const fetchData = async () => {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 100));

      await Promise.all([
        Settings.fromApi(setData),
        Routines.fromApi(setData),
        Exercises.fromApi(setData),
        Meals.fromApi(setData),
        Groceries.fromApi(setData),
      ]);

      setIsLoading(false);
    };
    fetchData();
  }, [user, userReady]);

  const contextValue: AppContextType = {
    data,
    isLoading,
    setIsLoading,
    setData,
    refreshCounter,
    setRefreshCounter,
    user,
    isFirebaseInitialized,
    userReady,
    isWarmingUp,
    warmupError,
    performWarmup,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};

export { AppContext };
