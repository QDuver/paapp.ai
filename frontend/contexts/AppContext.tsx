import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FirestoreDocAbstract, IUnique } from "../models/Abstracts";
import { Exercises } from "../models/Exercises";
import { Meals } from "../models/Meals";
import { Routines } from "../models/Routines";
import { Settings } from "../models/Settings";
import { apiClient } from "../utils/apiClient";

const modelMap = {
  exercises: Exercises,
  meals: Meals,
};

interface DataType {
  routines: Routines;
  exercises: Exercises;
  meals: Meals;
  uniqueExercises: IUnique[];
  settings: Settings;
}

interface AppContextType {
  data: DataType | undefined;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<DataType | undefined>>;
  refreshCounter: number;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [data, setData] = useState<DataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      await Promise.all([Settings.fromApi(setData), Routines.fromApi(setData), Exercises.fromApi(setData), Meals.fromApi(setData)]);

      const uniqueExercises = await apiClient.get<IUnique[]>(`unique/exercises`);
      setData(prevData => ({ ...prevData, uniqueExercises }));

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const contextValue: AppContextType = {
    data,
    isLoading,
    setIsLoading,
    setData,
    refreshCounter,
    setRefreshCounter,
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
