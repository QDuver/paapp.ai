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

  console.log('[CardListMobile] Render:', {
    itemCount: localItems.length,
    isDragging,
    refreshing,
    refreshCounter,
    firestoreDocItems: firestoreDoc.items.length,
    localOrder: localItems.map(item => item.name),
    firestoreOrder: firestoreDoc.items.map(item => item.name)
  });

  React.useEffect(() => {
    console.log('[CardListMobile] ⚠️ useEffect triggered - resetting localItems from firestoreDoc', {
      fromOrder: localItems.map(item => item.name),
      toOrder: firestoreDoc.items.map(item => item.name),
      refreshCounter
    });
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
    console.log('[CardListMobile] Refresh triggered', { currentCounter: refreshCounter });
    setRefreshCounter(refreshCounter + 1);
  };

  const handleDragBegin = (index: number) => {
    const item = localItems[index];
    console.log('[CardListMobile] Drag begin', {
      itemCount: localItems.length,
      draggedCard: item?.name,
      fromIndex: index
    });
    setIsDragging(true);
  };

  const handlePlaceholderIndexChange = (fromIndex: number, toIndex: number) => {
    const item = localItems[fromIndex];
    console.log('[CardListMobile] Placeholder moved', {
      card: item?.name,
      fromIndex,
      toIndex,
      distance: toIndex - fromIndex
    });
  };

  const handleDragEnd = ({ data, from, to }: { data: CardAbstract[]; from: number; to: number }) => {
    console.log('[CardListMobile] Drag end', {
      card: localItems[from]?.name,
      fromIndex: from,
      toIndex: to,
      orderChanged: from !== to,
      newOrder: data.map(item => item.name)
    });
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
        keyExtractor={(item) => `card-${item.name}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        onDragBegin={handleDragBegin}
        onDragEnd={handleDragEnd}
        onPlaceholderIndexChange={handlePlaceholderIndexChange}
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
