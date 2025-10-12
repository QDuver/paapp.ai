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

  const cardBackgroundColor = item.isCompleted ? theme.colors.cardCompleted : theme.colors.secondary;
  const hasSubCards = (item.items && item.items.length > 0) || item.createNewSubCard() !== null;
  const description = (item as any).description || (item as any).instructions;
  const titleOpacity = item.isCompleted ? 0.5 : 1;
  const descriptionOpacity = item.isCompleted ? 0.4 : 0.7;
  
  // Get section color based on collection
  const sectionKey = cardList.collection as 'routines' | 'exercises' | 'meals';
  const sectionColor = theme.colors.sections[sectionKey]?.icon || theme.colors.accent;
  const sectionBgColor = theme.colors.sections[sectionKey]?.iconBackground || theme.colors.iconBackgrounds.blue;

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
          titleStyle={[styles.accordionTitle, { opacity: titleOpacity }]}
          descriptionStyle={[styles.accordionDescription, { opacity: descriptionOpacity }]}
          left={props => (
            <Pressable 
              onPress={handleCheckbox} 
              style={styles.iconContainer}
              hitSlop={8}
            >
              <View style={[styles.iconCircle, { backgroundColor: sectionBgColor }]}>
                <MaterialCommunityIcons 
                  name={item.isCompleted ? "check" : cardList.collection === 'routines' ? "clock-outline" : cardList.collection === 'exercises' ? "dumbbell" : "food-apple-outline"}
                  size={20} 
                  color={sectionColor}
                />
              </View>
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
                    color={sectionColor}
                  />
                </Pressable>
              )}
              <View style={styles.chevronContainer}>
                <MaterialCommunityIcons 
                  name={item.isExpanded ? "chevron-up" : "chevron-down"}
                  size={24} 
                  color={theme.colors.textSecondary}
                />
              </View>
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
        <Pressable onPress={handleCheckbox} hitSlop={8} style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: sectionBgColor }]}>
            <MaterialCommunityIcons 
              name={item.isCompleted ? "check" : cardList.collection === 'routines' ? "clock-outline" : cardList.collection === 'exercises' ? "dumbbell" : "food-apple-outline"}
              size={20} 
              color={sectionColor}
            />
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
    overflow: "hidden",
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.card,
  },
  accordionItem: {
    paddingLeft: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
  },
  radioContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: -4,
  },
  accordionTitle: {
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  accordionDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  subCard: {
    paddingLeft: theme.spacing.xxl,
    paddingRight: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    minHeight: 60,
  },
  subCardLast: {
    borderBottomWidth: 0,
    paddingBottom: theme.spacing.lg,
  },
  subCardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  subCardDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    marginTop: 3,
  },
  listItem: {
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.xs,
    ...theme.shadows.card,
  },
  listItemTitle: {
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  listItemDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  iconButton: {
    margin: 0,
  },
  addButton: {
    padding: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
  },
});

export default CustomCard;
