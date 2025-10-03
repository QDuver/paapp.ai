import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Exercises } from "../models/Exercises";
import { DialogableAbstract, CardAbstract, FirestoreDocAbstract, IUnique } from "../models/Abstracts";
import { Meals } from "../models/Meals";
import { Routines } from "../models/Routines";
import { Settings } from "../models/Settings";
import { getCurrentDate } from "../utils/utils";
import { apiClient } from "../utils/apiClient";

interface DataType {
  routines: Routines;
  exercises: Exercises;
  meals: Meals;
  uniqueExercises: IUnique[];
  settings: Settings;
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
  settings: Settings | null;
  isLoading: boolean;
  refreshCounter: number;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
  onBuildItems: (cardList: FirestoreDocAbstract, formData: { [key: string]: any }) => void;
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
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [data, setData] = useState<DataType>();
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
    const fetchData = async () => {
      const settings = await Settings.fromApi();
      const routines = await Routines.fromApi();
      const exercises = await Exercises.fromApi();
      const meals = await Meals.fromApi();
      setData({
        routines,
        exercises,
        meals,
        uniqueExercises: [],
        settings,
      });
    };
    fetchData();
  }, []);


  const onBuildItems = async (cardList: FirestoreDocAbstract, formData: { [key: string]: any }) => {
    setIsLoading(true);
    await apiClient.post(`build-items/${cardList.collection}/${cardList.id}`, formData);

    const response = await apiClient.get<{
      routines: any;
      exercises: any;
      meals: any;
      uniqueExercises: IUnique[];
    }>(`routines/${getCurrentDate()}`);

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
    isLoading,
    refreshCounter,
    setRefreshCounter,
    onBuildItems,
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
