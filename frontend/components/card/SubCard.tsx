import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CardAbstract, SubCardAbstract, FirestoreDocAbstract } from "../../models/Abstracts";
import { useDialogContext } from "../../contexts/DialogContext";

// Type definitions for the component props
interface SubCardProps {
  subItem: SubCardAbstract;
  parentItem: CardAbstract;
  cardList: FirestoreDocAbstract;
  index: number;
}

const SubCard = ({ subItem, parentItem, cardList, index }: SubCardProps) => {
  const { showEditDialog } = useDialogContext();

  const backgroundColor: string = "#2C2C2E";
  const textColor: string = "#FFFFFF";
  const subtitleColor: string = "#8E8E93";

  return (
    <View style={[styles.subCard, { backgroundColor }]}>
      <TouchableOpacity
        testID="subcard"
        style={styles.subCardContent}
        onPress={() => showEditDialog(subItem, parentItem, cardList, false)}
        activeOpacity={0.7}
      >
        <View style={styles.subCardHeader}>
          <Text style={[styles.subCardTitle, { color: textColor }]}>{subItem.name || `Set ${index + 1}`}</Text>
        </View>

        {/* Sub-card specific info */}
        {subItem.getTags().length > 0 && (
          <View style={styles.subCardInfoRow}>
            {subItem.getTags().map((tag, tagIndex) => (
              <Text key={tagIndex} style={[styles.subCardInfo, { color: subtitleColor }]}>
                {tag}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  subCard: {
    marginLeft: 32,
    marginRight: 16,
    marginVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  subCardContent: {
    padding: 12,
  },
  subCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  subCardDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  subCardInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subCardInfo: {
    fontSize: 11,
    fontWeight: "500",
    backgroundColor: "rgba(142, 142, 147, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default SubCard;
