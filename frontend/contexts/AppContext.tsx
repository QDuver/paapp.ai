import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FirestoreDocAbstract, IUnique } from "../models/Abstracts";
import { Exercises } from "../models/Exercises";
import { Meals } from "../models/Meals";
import { Routines } from "../models/Routines";
import { Settings } from "../models/Settings";
import { apiClient } from "../utils/apiClient";

const modelMap = {
  exercises: Exercises,
  meals: Meals
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
  refreshCounter: number;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
  onBuildWithAi: (firestoreDoc: FirestoreDocAbstract, formData: { [key: string]: any }) => void;
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

      const settings = await Settings.fromApi();
      const routines = await Routines.fromApi();
      const exercises = await Exercises.fromApi();
      const meals = await Meals.fromApi();
      const uniqueExercises = await apiClient.get<IUnique[]>(`unique/exercises`);
      setData({
        routines,
        exercises,
        meals,
        uniqueExercises,
        settings,
      });
      setIsLoading(false);
    };
    fetchData();
  }, []);


  const onBuildWithAi = async (firestoreDoc: FirestoreDocAbstract, formData: { [key: string]: any }) => {
    // setIsLoading(true);
    
    // const ModelClass = modelMap[firestoreDoc.collection];
    // const instance = await ModelClass.buildWithAi(formData);
    
    // setData(prevData => ({
    //   ...prevData,
    //   [firestoreDoc.collection]: instance
    // }));
    // setIsLoading(false);
  };

  const contextValue: AppContextType = {
    data,
    isLoading,
    refreshCounter,
    setRefreshCounter,
    onBuildWithAi,
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

