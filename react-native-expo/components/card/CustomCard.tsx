import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CardAbstract, CardListAbstract, SubCardAbstract } from "../../models/Abstracts";
import { useAppContext } from "../../contexts/AppContext";
import SubCard from "./SubCard";
import EditDialog from "./EditDialog";

interface CustomCardProps {
  cardList: CardListAbstract; // Add this
  item: CardAbstract;
  index: number;
}

const CustomCard = ({ item, index, cardList }: CustomCardProps) => {
  const { onUpdate } = useAppContext();
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  
  const renderSubCards = (): React.ReactNode => {
    if (!item.isExpanded || !item.items || item.items.length === 0) {
      return null;
    }

    return item.items.map((subItem: SubCardAbstract, subIndex: number) => (
      <SubCard
        key={`subcard-${index}-${subIndex}`}
        subItem={subItem}
        parentItem={item}
        cardList={cardList}
        index={subIndex}
      />
    ));
  };

  const cardBackgroundColor: string = item.isCompleted ? "#2C2C2E" : "#1C1C1E";
  const textColor: string = "#FFFFFF";
  const subtitleColor: string = "#8E8E93";

  return (
    <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
      <TouchableOpacity 
        style={styles.cardHeader} 
        activeOpacity={0.7}
        onPress={() => setIsEditDialogVisible(true)}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <TouchableOpacity
              style={[
                styles.completionButton,
                {
                  backgroundColor: item.isCompleted ? "#34C759" : "#48484A",
                  borderWidth: item.isCompleted ? 0 : 2,
                  borderColor: "#8E8E93",
                },
              ]}
              onPress={() => {
                item.onComplete();
                onUpdate(cardList);
              }}
            >
              <Text
                style={[
                  styles.completionText,
                  {
                    color: item.isCompleted ? "#FFFFFF" : "#8E8E93",
                  },
                ]}
              >
                {item.isCompleted ? "✓" : ""}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: textColor }]}>
              {item.name || `Item ${index + 1}`}
            </Text>

            {item.items && item.items.length > 0 && (
              <TouchableOpacity
                style={styles.expandButtonRight}
                onPress={() => {
                  item.onToggleExpand();
                  onUpdate(cardList);
                }}
              >
                <Text style={[styles.expandText, { color: subtitleColor }]}>
                  {item.isExpanded ? "▼" : "▶"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {((item as any).description || (item as any).instructions) && (
            <Text style={[styles.description, { color: subtitleColor }]}>
              {(item as any).description || (item as any).instructions}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {renderSubCards()}

      <EditDialog
        visible={isEditDialogVisible}
        onClose={() => setIsEditDialogVisible(false)}
        cardList={cardList}
        item={item}
        isCreate={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    padding: 16,
  },
  headerContent: {
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  completionText: {
    fontSize: 18,
    fontWeight: "700",
  },
  expandButtonRight: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  expandText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CustomCard;
