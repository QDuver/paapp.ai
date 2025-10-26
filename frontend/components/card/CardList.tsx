import React from "react";
import { StyleSheet, View, Text, RefreshControl, Platform } from "react-native";
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
  refreshing: boolean;
  sectionColor: string;
}

const CardList = ({ firestoreDoc, showEditDialog, refreshing, sectionColor }: CardListProps) => {
  const { refreshCounter, setRefreshCounter } = useAppContext();

  const renderCard = ({ item, isActive, getIndex }: RenderItemParams<CardAbstract>) => (
    <CustomCard firestoreDoc={firestoreDoc} item={item} index={getIndex() ?? 0} showEditDialog={showEditDialog} />
  );

  const handleRefresh = () => {
    setRefreshCounter(refreshCounter + 1);
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList<CardAbstract>
        data={firestoreDoc.items}
        renderItem={renderCard}
        keyExtractor={(item, index) => `${refreshCounter}-card-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        activationDistance={10}
        dragItemOverflow={true}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={sectionColor} onRefresh={handleRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      overflowY: 'auto',
      height: '100%',
    }),
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
