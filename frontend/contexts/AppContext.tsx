import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardAbstract, DialogableAbstract, FirestoreDocAbstract, IUIMetadata, SectionKey } from "../models/Abstracts";
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

export interface EditDialogState {
  parent: FirestoreDocAbstract | CardAbstract | null;
  firestoreDoc: FirestoreDocAbstract | null;
  isNew: boolean;
}

export interface LoadingProgress {
  settings: boolean;
  routines: boolean;
  exercises: boolean;
  meals: boolean;
  groceries: boolean;
}

interface AppContextType {
  data: DataType | undefined;
  isLoading: boolean;
  loadingProgress: LoadingProgress;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<DataType | undefined>>;
  refreshCounter: number;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
  sections: Array<typeof FirestoreDocAbstract>;
  activeSection: typeof FirestoreDocAbstract;
  setActiveSection: (section: typeof FirestoreDocAbstract) => void;
  editDialogState: EditDialogState;
  editableItem: DialogableAbstract | null;
  setEditableItem: React.Dispatch<React.SetStateAction<DialogableAbstract | null>>;
  setEditDialogState: React.Dispatch<React.SetStateAction<EditDialogState>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const ACTIVE_SECTION_KEY = "@activeSection";

const SECTIONS: Array<typeof FirestoreDocAbstract> = [Routines, Exercises, Meals, Groceries];

export const AppContextProvider = ({ children }: AppProviderProps) => {
  const [data, setData] = useState<DataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    settings: false,
    routines: false,
    exercises: false,
    meals: false,
    groceries: false,
  });
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const { user, authReady, warmupError } = useAppInit();
  const [activeSectionKey, setActiveSectionKey] = useState<SectionKey>(SECTIONS[0].uiMetadata.key);
  const [editableItem, setEditableItem] = useState<DialogableAbstract | null>(null);
  const [editDialogState, setEditDialogState] = useState<EditDialogState>({
    parent: null,
    firestoreDoc: null,
    isNew: false,
  });

  const activeSection = useMemo(() => {
    return SECTIONS.find(s => s.uiMetadata.key === activeSectionKey) || SECTIONS[0];
  }, [activeSectionKey]);

  const setActiveSection = (section: typeof FirestoreDocAbstract) => {
    setActiveSectionKey(section.uiMetadata.key);
  };

  useEffect(() => {
    if(!editableItem) {
      setEditDialogState({ parent: null, firestoreDoc: null, isNew: false });
    }
  }, [editableItem]);

  useEffect(() => {
    const loadActiveSection = async () => {
      try {
        const savedSectionKey = await AsyncStorage.getItem(ACTIVE_SECTION_KEY);
        if (savedSectionKey) {
          const isValidKey = SECTIONS.some(s => s.uiMetadata.key === savedSectionKey);
          if (isValidKey) {
            setActiveSectionKey(savedSectionKey as SectionKey);
          }
        }
      } catch (error) {
        console.error("Failed to load active section:", error);
      }
    };
    loadActiveSection();
  }, []);

  useEffect(() => {
    const saveActiveSection = async () => {
      try {
        await AsyncStorage.setItem(ACTIVE_SECTION_KEY, activeSectionKey);
      } catch (error) {
        console.error("Failed to save active section:", error);
      }
    };
    saveActiveSection();
  }, [activeSectionKey]);

  useEffect(() => {
    if (!user || !authReady || warmupError) return;

    const fetchData = async () => {
      setIsLoading(true);
      setLoadingProgress({
        settings: false,
        routines: false,
        exercises: false,
        meals: false,
        groceries: false,
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      await Promise.all([
        Settings.fromApi(setData).then(() => {
          setLoadingProgress(prev => ({ ...prev, settings: true }));
        }),
        Routines.fromApi(setData).then(() => {
          setLoadingProgress(prev => ({ ...prev, routines: true }));
        }),
        Exercises.fromApi(setData).then(() => {
          setLoadingProgress(prev => ({ ...prev, exercises: true }));
        }),
        Meals.fromApi(setData).then(() => {
          setLoadingProgress(prev => ({ ...prev, meals: true }));
        }),
        Groceries.fromApi(setData).then(() => {
          setLoadingProgress(prev => ({ ...prev, groceries: true }));
        }),
      ]);

      setIsLoading(false);
    };
    fetchData();
  }, [user, authReady, warmupError]);

  const contextValue: AppContextType = {
    data,
    isLoading,
    loadingProgress,
    setIsLoading,
    setData,
    refreshCounter,
    setRefreshCounter,
    sections: SECTIONS,
    activeSection,
    setActiveSection,
    editDialogState,
    setEditDialogState,
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
