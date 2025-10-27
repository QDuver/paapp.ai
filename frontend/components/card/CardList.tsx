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
}

const CardList = ({ firestoreDoc, showEditDialog, refreshing, sectionColor }: CardListProps) => {
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== "web" || width < 768;

  if (isMobile) {
    return (
      <CardListMobile
        firestoreDoc={firestoreDoc}
        showEditDialog={showEditDialog}
        refreshing={refreshing}
        sectionColor={sectionColor}
      />
    );
  }

  return (
    <CardListWeb
      firestoreDoc={firestoreDoc}
      showEditDialog={showEditDialog}
      refreshing={refreshing}
      sectionColor={sectionColor}
    />
  );
};

export default CardList;
