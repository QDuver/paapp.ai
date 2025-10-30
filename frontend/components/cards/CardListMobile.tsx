import React, { useEffect } from "react";
import { StyleSheet, View, Platform, RefreshControl } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { FirestoreDocAbstract, CardAbstract } from "../../models/Abstracts";
import CustomCard from "./CustomCard";
import { useAppContext } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";

interface CardListMobileProps {
  firestoreDoc: FirestoreDocAbstract;
  refreshing: boolean;
  sectionColor: string;
}

const CardListMobile = ({ firestoreDoc, refreshing, sectionColor }: CardListMobileProps) => {
  const { refreshCounter, setRefreshCounter } = useAppContext();
  const [localItems, setLocalItems] = React.useState<CardAbstract[]>(firestoreDoc.items);
  const [isDragging, setIsDragging] = React.useState(false);


  useEffect(() => {
    setLocalItems(firestoreDoc.items);
  }, [firestoreDoc.items, refreshCounter]);

  const renderCard = ({ item, isActive, getIndex, drag }: RenderItemParams<CardAbstract>) => (
    <CustomCard
      firestoreDoc={firestoreDoc}
      item={item}
      index={getIndex() ?? 0}
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
    setIsDragging(true);
  };

  const handlePlaceholderIndexChange = (fromIndex: number, toIndex: number) => {
    const item = localItems[fromIndex];
  };

  const handleDragEnd = ({ data, from, to }: { data: CardAbstract[]; from: number; to: number }) => {
    setIsDragging(false);
    setLocalItems(data);
    firestoreDoc.items = data;
    firestoreDoc.onSave()
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
    paddingBottom: 100,
  },
});

export default CardListMobile;
