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
  refreshCounter: number;
}

const CardListWeb = ({ firestoreDoc, showEditDialog, refreshing, sectionColor, refreshCounter }: CardListWebProps) => {
  const { setRefreshCounter } = useAppContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = firestoreDoc.items.findIndex((item: any, idx: number) => `card-${idx}` === active.id);
      const newIndex = firestoreDoc.items.findIndex((item: any, idx: number) => `card-${idx}` === over.id);

      console.log("handleDragEnd - moving from", oldIndex, "to", newIndex);
      firestoreDoc.items = arrayMove(firestoreDoc.items, oldIndex, newIndex);
      setRefreshCounter(prev => prev + 1);
      firestoreDoc.onSave();
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={firestoreDoc.items.map((_: any, idx: number) => `card-${idx}`)} strategy={verticalListSortingStrategy}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={sectionColor}
              onRefresh={() => {
                console.log("Refresh triggered");
              }}
            />
          }
        >
          {firestoreDoc.items.map((item: CardAbstract, index: number) => (
            <SortableCard
              key={`${refreshCounter}-card-${index}`}
              id={`card-${index}`}
              item={item}
              index={index}
              firestoreDoc={firestoreDoc}
              showEditDialog={showEditDialog}
            />
          ))}
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
  },
});

export default CardListWeb;
