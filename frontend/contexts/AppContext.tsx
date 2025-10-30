import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { DialogableAbstract, FirestoreDocAbstract, IUIMetadata, SectionKey } from "../models/Abstracts";
import { Exercises } from "../models/Exercises";
import { Meals } from "../models/Meals";
import { Routines } from "../models/Routines";
import { Settings } from "../models/Settings";
import { Groceries } from "../models/Groceries";
import { useAppInit } from "./AppInit";

export interface DataType {
  routines: Routines;
  exercises: Exercises;
  meals: Meals;
  settings: Settings;
}

interface AppContextType {
  data: DataType | undefined;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<DataType | undefined>>;
  refreshCounter: number;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
  sections: Array<typeof FirestoreDocAbstract>;
  activeSection: typeof FirestoreDocAbstract;
  setActiveSection: React.Dispatch<React.SetStateAction<typeof FirestoreDocAbstract>>;
  editableItem: DialogableAbstract | null;
  setEditableItem: React.Dispatch<React.SetStateAction<DialogableAbstract | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppProviderProps) => {
  const [data, setData] = useState<DataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const { user, authReady, warmupError } = useAppInit();
  const sections: Array<typeof FirestoreDocAbstract> = [Routines, Exercises, Meals, Groceries];
  const [activeSection, setActiveSection] = useState<typeof FirestoreDocAbstract>(() => sections[0]);
  const [editableItem, setEditableItem] = useState<DialogableAbstract>(null);

  useEffect(() => {
    if (!user || !authReady || warmupError) return;

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
  }, [user, authReady, warmupError]);

  const contextValue: AppContextType = {
    data,
    isLoading,
    setIsLoading,
    setData,
    refreshCounter,
    setRefreshCounter,
    sections,
    activeSection,
    setActiveSection,
    editableItem,
    setEditableItem,
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
