import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Card, List, IconButton, Checkbox, TouchableRipple } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardAbstract, FirestoreDocAbstract, SubCardAbstract } from "../../models/Abstracts";
import { useAppContext } from "../../contexts/AppContext";
import { useDialogContext } from "../../contexts/DialogContext";
import { theme } from "../../styles/theme";

interface CustomCardProps {
  cardList: FirestoreDocAbstract;
  item: CardAbstract;
  index: number;
}

const CustomCard = ({ item, index, cardList }: CustomCardProps) => {
  const { refreshCounter, setRefreshCounter } = useAppContext();
  const { showEditDialog } = useDialogContext();

  const cardBackgroundColor = item.isCompleted ? theme.colors.modalSecondary : theme.colors.secondary;
  const hasSubCards = (item.items && item.items.length > 0) || item.createNewSubCard() !== null;
  const description = (item as any).description || (item as any).instructions;

  const handleCheckbox = (e?: any) => {
    e?.stopPropagation?.();
    item.onComplete(cardList);
    setRefreshCounter(prev => prev + 1);
  };

  const handleToggleExpand = (e?: any) => {
    e?.stopPropagation?.();
    item.onToggleExpand(cardList);
    setRefreshCounter(prev => prev + 1);
  };

  const handleAddSubCard = (e?: any) => {
    e?.stopPropagation?.();
    const newSubCard = item.createNewSubCard();
    if (item.skipDialogForNewChild()) {
      newSubCard.onSave(cardList, newSubCard.toFormData(), item, true, setRefreshCounter);
    } else {
      showEditDialog(newSubCard, item, cardList, true);
    }
  };

  // If has subcards, use Card with List.Accordion
  if (hasSubCards) {
    return (
      <Card style={[styles.card, { backgroundColor: cardBackgroundColor }]} testID="exercise-card">
        <List.Accordion
          title={item.name || `Item ${index + 1}`}
          description={description}
          expanded={item.isExpanded}
          onPress={handleToggleExpand}
          onLongPress={() => showEditDialog(item, cardList, cardList, false)}
          style={[styles.accordionItem, { backgroundColor: cardBackgroundColor }]}
          titleStyle={styles.accordionTitle}
          descriptionStyle={styles.accordionDescription}
          left={props => (
            <Pressable 
              onPress={handleCheckbox} 
              style={styles.radioContainer}
              hitSlop={8}
            >
              <Checkbox
                status={item.isCompleted ? "checked" : "unchecked"}
                color={theme.colors.success}
              />
            </Pressable>
          )}
          right={props => (
            <View style={styles.rightContainer}>
              {item.createNewSubCard() !== null && (
                <Pressable 
                  testID="add-subcard-button" 
                  onPress={handleAddSubCard}
                  style={styles.addButton}
                >
                  <MaterialCommunityIcons 
                    name="plus-circle-outline" 
                    size={24} 
                    color={theme.colors.buttonPrimary}
                  />
                </Pressable>
              )}
              <List.Icon {...props} icon={item.isExpanded ? "chevron-up" : "chevron-down"} />
            </View>
          )}
        >
          {item.items?.map((subItem: SubCardAbstract, subIndex: number) => {
            const tags = subItem.getTags();
            const tagString = tags.length > 0 ? tags.join(" • ") : undefined;
            const isLastItem = subIndex === item.items!.length - 1;

            return (
              <List.Item
                key={`${refreshCounter}-subcard-${index}-${subIndex}`}
                testID="subcard"
                title={subItem.name || `Set ${subIndex + 1}`}
                description={tagString}
                onPress={() => showEditDialog(subItem, item, cardList, false)}
                style={[styles.subCard, isLastItem && styles.subCardLast]}
                titleStyle={styles.subCardTitle}
                descriptionStyle={styles.subCardDescription}
              />
            );
          })}
        </List.Accordion>
      </Card>
    );
  }

  // If no subcards, use simple List.Item
  return (
    <List.Item
      testID="exercise-card"
      title={item.name || `Item ${index + 1}`}
      description={description}
      onPress={() => showEditDialog(item, cardList, cardList, false)}
      style={[styles.listItem, { backgroundColor: cardBackgroundColor }]}
      titleStyle={styles.listItemTitle}
      descriptionStyle={styles.listItemDescription}
      left={() => (
        <Pressable onPress={handleCheckbox} hitSlop={8}>
          <Checkbox
            status={item.isCompleted ? "checked" : "unchecked"}
            color={theme.colors.success}
          />
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.lg,
    overflow: "hidden",
  },
  accordionItem: {
    paddingLeft: 0,
  },
  radioContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: -8,
  },
  accordionTitle: {
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text,
  },
  accordionDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
  },
  subCard: {
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || "rgba(0, 0, 0, 0.08)",
    minHeight: 56,
  },
  subCardLast: {
    borderBottomWidth: 0,
  },
  subCardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  subCardDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
    marginTop: 2,
  },
  listItem: {
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.card,
  },
  listItemTitle: {
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text,
  },
  listItemDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
  },
  iconButton: {
    margin: 0,
  },
  addButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomCard;
