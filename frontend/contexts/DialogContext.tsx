import React, { createContext, ReactNode, useContext, useState } from "react";
import { CardAbstract, DialogableAbstract, FirestoreDocAbstract } from "../models/Abstracts";

interface DialogSettings {
  visible: boolean;
  item: DialogableAbstract | null;
  parent: FirestoreDocAbstract | CardAbstract | null;
  cardList: FirestoreDocAbstract | null;
  isNew: boolean;
}

interface DialogContextType {
  dialogSettings: DialogSettings;
  showEditDialog: (
    item: DialogableAbstract,
    parent: FirestoreDocAbstract | CardAbstract,
    cardList: FirestoreDocAbstract,
    isNew?: boolean
  ) => void;
  hideEditDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialogSettings, setDialogSettings] = useState<DialogSettings>({
    visible: false,
    item: null,
    parent: null,
    cardList: null,
    isNew: false,
  });

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

  const contextValue: DialogContextType = {
    dialogSettings,
    showEditDialog,
    hideEditDialog,
  };

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
};

export const useDialogContext = (): DialogContextType => {
  const context = useContext(DialogContext);

  if (context === undefined) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }

  return context;
};

export { DialogContext };
