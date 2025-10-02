import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Exercises } from "../models/Exercises";
import { DialogableAbstract, CardAbstract, FirestoreDocAbstract, IUnique } from "../models/Abstracts";
import { Meals } from "../models/Meals";
import { Routines } from "../models/Routines";
import { ISettings } from "../models/Settings";
import { getCurrentDate } from "../utils/utils";
import { apiClient } from "../utils/apiClient";

interface DataType {
  routines: Routines;
  exercises: Exercises;
  meals: Meals;
  uniqueExercises: IUnique[];
}

interface DialogSettings {
  visible: boolean;
  item: DialogableAbstract | null;
  parent: FirestoreDocAbstract | CardAbstract | null;
  cardList: FirestoreDocAbstract | null;
  isNew: boolean;
}

interface AppContextType {
  data: DataType | undefined;
  settings: ISettings | null;
  currentDate: string;
  isLoading: boolean;
  refreshCounter: number;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
  onBuildItems: (cardList: FirestoreDocAbstract, formData: { [key: string]: any }) => void;
  updateSettings: (settings: ISettings) => Promise<void>;
  dialogSettings: DialogSettings;
  showEditDialog: (
    item: DialogableAbstract,
    parent: FirestoreDocAbstract | CardAbstract,
    cardList: FirestoreDocAbstract,
    isNew?: boolean
  ) => void;
  hideEditDialog: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  skipAuth?: boolean;
}

export const AppProvider = ({ children, skipAuth = false }: AppProviderProps) => {
  const [data, setData] = useState<DataType>();
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [currentDate, setCurrentDate] = useState<string>(getCurrentDate());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [dialogSettings, setDialogSettings] = useState<DialogSettings>({
    visible: false,
    item: null,
    parent: null,
    cardList: null,
    isNew: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await apiClient.get<ISettings>("settings/settings", { skipAuth });
      if (response) {
        setSettings(response);
      }
    };
    fetchSettings();
  }, [skipAuth]);

  useEffect(() => {
    const fetchRoutines = async () => {
      setIsLoading(true);
      const response = await apiClient.get<{
        routines: Routines;
        exercises: Exercises;
        meals: Meals;
        uniqueExercises: IUnique[];
      }>(`routines/${currentDate}`, { skipAuth });

      if (response) {
        setData({
          routines: new Routines(response.routines),
          exercises: new Exercises(response.exercises),
          meals: new Meals(response.meals),
          uniqueExercises: response.uniqueExercises || [],
        });
      }
      setIsLoading(false);
    };
    fetchRoutines();
  }, [currentDate, skipAuth]);

  const onBuildItems = async (cardList: FirestoreDocAbstract, formData: { [key: string]: any }) => {
    setIsLoading(true);
    await apiClient.post(`build-items/${cardList.collection}/${cardList.id}`, formData, { skipAuth });

    const response = await apiClient.get<{
      routines: Routines;
      exercises: Exercises;
      meals: Meals;
      uniqueExercises: IUnique[];
    }>(`routines/${currentDate}`, { skipAuth });

    if (response) {
      setData({
        routines: new Routines(response.routines),
        exercises: new Exercises(response.exercises),
        meals: new Meals(response.meals),
        uniqueExercises: response.uniqueExercises || [],
      });
    }
    setIsLoading(false);
  };

  const updateSettings = async (newSettings: ISettings) => {
    const success = await apiClient.post("settings/settings", newSettings, { skipAuth });
    if (success) {
      setSettings(newSettings);
    }
  };

  const showEditDialog = (
    item: DialogableAbstract,
    parent: FirestoreDocAbstract | CardAbstract,
    cardList: FirestoreDocAbstract,
    isNew: boolean = false
  ) => {
    setDialogSettings({
      visible: true,
      item,
      parent,
      cardList,
      isNew,
    });
  };

  const hideEditDialog = () => {
    setDialogSettings({
      visible: false,
      item: null,
      parent: null,
      cardList: null,
      isNew: false,
    });
  };

  const contextValue: AppContextType = {
    data,
    settings,
    currentDate,
    isLoading,
    refreshCounter,
    setRefreshCounter,
    onBuildItems,
    updateSettings,
    dialogSettings,
    showEditDialog,
    hideEditDialog,
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
