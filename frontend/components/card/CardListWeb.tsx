import React from "react";
import { StyleSheet, View, ScrollView, RefreshControl, Platform } from "react-native";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FirestoreDocAbstract, CardAbstract, DialogableAbstract } from "../../models/Abstracts";
import SortableCard from "./SortableCard";
import { theme } from "../../styles/theme";
import { useAppContext } from "../../contexts/AppContext";

interface CardListWebProps {
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

const CardListWeb = ({ firestoreDoc, showEditDialog, refreshing, sectionColor, autoFocusItemId }: CardListWebProps) => {
  const { refreshCounter, setRefreshCounter } = useAppContext();
  const [localItems, setLocalItems] = React.useState<CardAbstract[]>(firestoreDoc.items);

  React.useEffect(() => {
    setLocalItems(firestoreDoc.items);
  }, [firestoreDoc.items, refreshCounter]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = localItems.findIndex((item: any, idx: number) => `card-${idx}` === active.id);
      const newIndex = localItems.findIndex((item: any, idx: number) => `card-${idx}` === over.id);

      const newItems = arrayMove(localItems, oldIndex, newIndex);
      setLocalItems(newItems);
      firestoreDoc.items = newItems;
      firestoreDoc.onSave().catch(error => {
        console.error("Error saving reordered items:", error);
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={localItems.map((_: any, idx: number) => `card-${idx}`)} strategy={verticalListSortingStrategy}>
        <ScrollView
          style={[styles.container, { backgroundColor: `${sectionColor}08` }]}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshCounter(prev => prev + 1)}
            />
          }
        >
          <View style={styles.cardsWrapper}>
            {localItems.map((item: CardAbstract, index: number) => (
              <SortableCard
                key={`card-${index}-${item.name}`}
                id={`card-${index}`}
                item={item}
                index={index}
                firestoreDoc={firestoreDoc}
                showEditDialog={showEditDialog}
                autoFocusItemId={autoFocusItemId}
              />
            ))}
          </View>
        </ScrollView>
      </SortableContext>
    </DndContext>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  listContainer: {
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    alignItems: "center",
  },
  cardsWrapper: {
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: theme.spacing.lg,
  },
});

export default CardListWeb;
