import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { FirestoreDocAbstract, CardAbstract, DialogableAbstract } from "../../models/Abstracts";
import CustomCard from "./CustomCard";
import { useAppContext } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";
import { RefreshControl } from "react-native";

interface CardListMobileProps {
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

const CardListMobile = ({ firestoreDoc, showEditDialog, refreshing, sectionColor }: CardListMobileProps) => {
  const { refreshCounter, setRefreshCounter } = useAppContext();
  const [localItems, setLocalItems] = React.useState<CardAbstract[]>(firestoreDoc.items);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    setLocalItems(firestoreDoc.items);
  }, [firestoreDoc.items, refreshCounter]);

  const renderCard = ({ item, isActive, getIndex, drag }: RenderItemParams<CardAbstract>) => (
    <CustomCard
      firestoreDoc={firestoreDoc}
      item={item}
      index={getIndex() ?? 0}
      showEditDialog={showEditDialog}
      drag={drag}
      isActive={isActive}
    />
  );

  const handleRefresh = () => {
    setRefreshCounter(refreshCounter + 1);
  };

  const handleDragBegin = () => {
    setIsDragging(true);
  };

  const handleDragEnd = ({ data }: { data: CardAbstract[] }) => {
    setIsDragging(false);
    setLocalItems(data);
    firestoreDoc.items = data;
    firestoreDoc.onSave().catch(error => {
      console.error("Error saving reordered items:", error);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: `${sectionColor}08` }]}>
      <DraggableFlatList<CardAbstract>
        data={localItems}
        renderItem={renderCard}
        keyExtractor={(item, index) => `card-${index}-${item.name}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        onDragBegin={handleDragBegin}
        onDragEnd={handleDragEnd}
        activationDistance={10}
        dragItemOverflow={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            enabled={!isDragging}
          />
        }
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
});

export default CardListMobile;
