import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { Exercises, IExercises, IExerciseUnique } from "../models/Exercises";
// import { Meals } from "../models/Meals";
import { DialogableAbstract, CardAbstract, CardListAbstract } from "../models/Abstracts";
import { IMeals, Meals } from "../models/Meals";
import { IRoutines, Routines } from "../models/Routines";
import { RequestStatusType } from "../models/Shared";
import { ISettings } from "../models/Settings";
import { getCurrentDate } from "../utils/utils";

interface DataType {
  routines: Routines | null;
  exercises: Exercises | null /*  */;
  meals: Meals | null;
  uniqueExercises: IExerciseUnique[];
}

interface DialogSettings {
  visible: boolean;
  item: DialogableAbstract | null;
  parent: CardListAbstract<any> | CardAbstract | null;
  cardList: CardListAbstract<any> | null;
  isNew: boolean;
}

interface AppContextType {
  data: DataType | undefined;
  settings: ISettings | null;
  currentDate: string;
  isLoading: boolean;
  refreshCounter: number;
  onUpdate: (cardList: CardListAbstract<any>) => void;
  onBuildItems: (cardList: CardListAbstract<any>, formData: { [key: string]: any }) => void;
  updateSettings: (settings: ISettings) => Promise<void>;
  dialogSettings: DialogSettings;
  showEditDialog: (
    item: DialogableAbstract,
    parent: CardListAbstract<any> | CardAbstract,
    cardList: CardListAbstract<any>,
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
  const {
    get,
    data: apiData,
    status,
  } = useApi<{
    routines: IRoutines;
    exercises: IExercises;
    meals: IMeals;
    uniqueExercises: IExerciseUnique[];
  }>(skipAuth);
  const { post } = useApi(skipAuth);
  const { get: getSettings, post: postSettings } = useApi<ISettings>(skipAuth);
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
    getSettings("settings/settings").then(response => {
      if (response) {
        setSettings(response);
      }
    });
  }, []);

  useEffect(() => {
    get(`routines/${currentDate}`);
  }, [currentDate]);

  useEffect(() => {
    if (!apiData) return;

    setData({
      routines: new Routines(apiData.routines),
      exercises: new Exercises(apiData.exercises),
      meals: new Meals(apiData.meals),
      uniqueExercises: apiData.uniqueExercises || [],
    });
  }, [apiData]);

  useEffect(() => {
    setIsLoading(status === RequestStatusType.LOADING);
  }, [status]);

  const onUpdate = (cardList: CardListAbstract<any>) => {
    setRefreshCounter(prev => prev + 1);
    post(`${cardList.collection}/${cardList.id}`, cardList);
  };

  const onBuildItems = async (cardList: CardListAbstract<any>, formData: { [key: string]: any }) => {
    setIsLoading(true);
    await post(`build-items/${cardList.collection}/${cardList.id}`, formData);
    await get(`routines/${currentDate}`);
    setIsLoading(false);
  };

  const updateSettings = async (newSettings: ISettings) => {
    await postSettings("settings/settings", newSettings);
    setSettings(newSettings);
  };

  const showEditDialog = (
    item: DialogableAbstract,
    parent: CardListAbstract<any> | CardAbstract,
    cardList: CardListAbstract<any>,
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
    onUpdate,
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
