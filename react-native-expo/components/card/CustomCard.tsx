import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CardAbstract, CardListAbstract, SubCardAbstract } from "../../models/Abstracts";
import { useAppContext } from "../../contexts/AppContext";
import SubCard from "./SubCard";
import EditDialog from "./EditDialog";

interface CustomCardProps {
  cardList: CardListAbstract<any>; // Add this
  item: CardAbstract;
  index: number;
}

const CustomCard = ({ item, index, cardList }: CustomCardProps) => {
  const { onUpdate, refreshCounter } = useAppContext();
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [isSubCardEditDialogVisible, setIsSubCardEditDialogVisible] = useState(false);
  const [newSubCard, setNewSubCard] = useState<SubCardAbstract | null>(null);
  
  const renderSubCards = (): React.ReactNode => {
    if (!item.isExpanded) {
      return null;
    }

    const hasSubCards = item.items && item.items.length > 0;
    const supportsSubCards = item.createNewSubCard() !== null;
    
    // Show subcards container if there are existing subcards OR if this card type supports subcards
    if (!hasSubCards && !supportsSubCards) {
      return null;
    }

    return (
      <View>
        {hasSubCards && item.items!.map((subItem: SubCardAbstract, subIndex: number) => (
          <SubCard
            key={`${refreshCounter}-subcard-${index}-${subIndex}`}
            subItem={subItem}
            parentItem={item}
            cardList={cardList}
            index={subIndex}
          />
        ))}
        
        {/* Add New Subcard Button - only show if this card type supports subcards */}
        {supportsSubCards && (
          <TouchableOpacity
            style={styles.addSubCardButton}
            onPress={() => {
              // Don't create the sub-item yet - just signal that we want to create one
              setNewSubCard(null);
              setIsSubCardEditDialogVisible(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.addSubCardText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
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

            {(item.items && item.items.length > 0) || item.createNewSubCard() !== null ? (
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
            ) : null}
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
        parent={cardList}
        item={item}
        isCreate={false}
      />

      {item.createNewSubCard() !== null && (
        <EditDialog
          visible={isSubCardEditDialogVisible}
          onClose={() => {
            setIsSubCardEditDialogVisible(false);
            setNewSubCard(null);
            onUpdate(cardList); // Update after dialog closes
          }}
          cardList={cardList}
          parent={item}
          item={newSubCard || item.createNewSubCard()!}
          isCreate={true}
        />
      )}
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
  addSubCardButton: {
    marginLeft: 32,
    marginRight: 16,
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#48484A",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#8E8E93",
    borderStyle: "dashed",
  },
  addSubCardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E8E93",
    textAlign: "center",
  },
});

export default CustomCard;
