import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import { FirestoreDocAbstract, CardAbstract, DialogableAbstract } from "../../models/Abstracts";
import CardListWeb from "./CardListWeb";
import CardListMobile from "./CardListMobile";

interface CardListProps {
  firestoreDoc: FirestoreDocAbstract;
  showEditDialog: (
    item: DialogableAbstract,
    parent: FirestoreDocAbstract | CardAbstract,
    firestoreDoc: FirestoreDocAbstract,
    isNew: boolean
  ) => void;
  refreshing: boolean;
  sectionColor: string;
  autoFocusItemId?: string | null;
}

const CardList = ({ firestoreDoc, showEditDialog, refreshing, sectionColor, autoFocusItemId }: CardListProps) => {
  const isMobile = Platform.OS !== "web";

  if (isMobile) {
    return (
      <CardListMobile
        firestoreDoc={firestoreDoc}
        showEditDialog={showEditDialog}
        refreshing={refreshing}
        sectionColor={sectionColor}
        autoFocusItemId={autoFocusItemId}
      />
    );
  }

  return (
    <CardListWeb
      firestoreDoc={firestoreDoc}
      showEditDialog={showEditDialog}
      refreshing={refreshing}
      sectionColor={sectionColor}
      autoFocusItemId={autoFocusItemId}
    />
  );
};

export default CardList;
