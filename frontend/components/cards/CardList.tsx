import React from "react";
import { Platform } from "react-native";
import { FirestoreDocAbstract } from "../../models/Abstracts";
import CardListWeb from "./CardListWeb";
import CardListMobile from "./CardListMobile";

interface CardListProps {
  firestoreDoc: FirestoreDocAbstract;
  refreshing: boolean;
  sectionColor: string;
}

const CardList = ({ firestoreDoc, refreshing, sectionColor }: CardListProps) => {
  const isMobile = Platform.OS !== "web";

  if (isMobile) {
    return (
      <CardListMobile
        firestoreDoc={firestoreDoc}
        refreshing={refreshing}
        sectionColor={sectionColor}
      />
    );
  }

  return (
    <CardListWeb
      firestoreDoc={firestoreDoc}
      refreshing={refreshing}
      sectionColor={sectionColor}
    />
  );
};

export default CardList;
