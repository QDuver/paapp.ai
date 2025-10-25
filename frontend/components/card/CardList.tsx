import React from "react";
import { StyleSheet, View, Text } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { FirestoreDocAbstract, CardAbstract, DialogableAbstract } from "../../models/Abstracts";
import CustomCard from "./CustomCard";
import { useAppContext } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";

interface CardListProps {
  firestoreDoc: FirestoreDocAbstract;
  showEditDialog: (
    item: DialogableAbstract,
    parent: FirestoreDocAbstract | CardAbstract,
    firestoreDoc: FirestoreDocAbstract,
    isNew: boolean
  ) => void;
}

const CardList = ({ firestoreDoc, showEditDialog }: CardListProps) => {
  const { refreshCounter } = useAppContext();

  const renderCard = ({ item, isActive, getIndex }: RenderItemParams<CardAbstract>) => (
    <CustomCard firestoreDoc={firestoreDoc} item={item} index={getIndex() ?? 0} showEditDialog={showEditDialog} />
  );

  return (
    <View style={styles.container}>
      <DraggableFlatList<CardAbstract>
        data={firestoreDoc.items}
        renderItem={renderCard}
        keyExtractor={(item, index) => `${refreshCounter}-card-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        activationDistance={10}
        dragItemOverflow={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 9999,
  },
  fab: {
    backgroundColor: theme.colors.accent,
    ...theme.shadows.fab,
  },
});

export default CardList;
