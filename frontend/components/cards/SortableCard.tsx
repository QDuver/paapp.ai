import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { View, StyleSheet } from "react-native";
import CustomCard from "./CustomCard";
import { FirestoreDocAbstract, CardAbstract } from "../../models/Abstracts";

interface SortableCardProps {
  id: string;
  item: CardAbstract;
  index: number;
  firestoreDoc: FirestoreDocAbstract;
}

const SortableCard = ({ id, item, index, firestoreDoc }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style as any} {...attributes}>
      <CustomCard
        firestoreDoc={firestoreDoc}
        item={item}
        index={index}
        dragListeners={listeners}
        isDragging={isDragging}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default SortableCard;
