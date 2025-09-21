import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import useApi from "../hooks/useApi";
import { Exercises, IExercises } from "../models/Exercises";
// import { Meals } from "../models/Meals";
import { BaseEditableEntity, CardAbstract, CardListAbstract } from "../models/Abstracts";
import { IMeals, Meals } from "../models/Meals";
import { IRoutines, Routines } from "../models/Routines";
import { RequestStatusType } from "../models/Shared";
import { getCurrentDate } from "../utils/dateUtils";

interface DataType {
  routines: Routines | null;
  exercises: Exercises | null;
  meals: Meals | null;
}


interface DialogSettings {
  visible: boolean;
  item: BaseEditableEntity | null;
  parent: CardListAbstract<any> | CardAbstract | null;
  cardList: CardListAbstract<any> | null;
  isNew: boolean;
}

interface AppContextType {
  data: DataType | undefined;
  currentDate: string;
  isLoading: boolean;
  refreshCounter: number;
  onUpdate: (cardList: CardListAbstract<any>) => void;
  dialogSettings: DialogSettings;
  showEditDialog: (item: BaseEditableEntity, parent: CardListAbstract<any> | CardAbstract, cardList: CardListAbstract<any>, isNew?: boolean) => void;
  hideEditDialog: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { get, data: apiData, status, } = useApi<{ routines: IRoutines; exercises: IExercises; meals: IMeals; }>();
  const {post} = useApi();
  const [data, setData] = useState<DataType>();
  const [currentDate, setCurrentDate] = useState<string>(getCurrentDate());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [dialogSettings, setDialogSettings] = useState<DialogSettings>({
    visible: false,
    item: null,
    parent: null,
    cardList: null,
    isNew: false,
  });
  
  useEffect(() => {
    get(`quentin-duverge/routines/${currentDate}`);
  }, [currentDate]);

  useEffect(() => {
    if (!apiData) return;

    setData({
      routines: new Routines(apiData.routines),
      exercises: new Exercises(apiData.exercises),
      meals: new Meals(apiData.meals),
    });

  }, [apiData]);

  useEffect(() => {
    setIsLoading(status === RequestStatusType.LOADING);
  }, [status]);

  const onUpdate = (cardList: CardListAbstract<any>) => {
    setRefreshCounter(prev => prev + 1);
    post(`quentin-duverge/${cardList.collection}/${cardList.id}`, cardList);
  };

  const showEditDialog = (
    item: BaseEditableEntity, 
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
    currentDate,
    isLoading,
    refreshCounter,
    onUpdate,
    dialogSettings,
    showEditDialog,
    hideEditDialog,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
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

