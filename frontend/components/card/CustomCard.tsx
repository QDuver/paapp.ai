import React from "react";
import { StyleSheet, View, Pressable, Text, Platform, TouchableOpacity } from "react-native";
import { Card, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardAbstract, FirestoreDocAbstract, SubCardAbstract, DialogableAbstract } from "../../models/Abstracts";
import { useAppContext } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";

interface CustomCardProps {
  firestoreDoc: FirestoreDocAbstract;
  item: CardAbstract;
  index: number;
  showEditDialog: (
    item: DialogableAbstract,
    parent: FirestoreDocAbstract | CardAbstract,
    firestoreDoc: FirestoreDocAbstract,
    isNew: boolean
  ) => void;
  drag?: () => void;
  isActive?: boolean;
  dragListeners?: any;
  isDragging?: boolean;
}

const CustomCard = ({ item, index, firestoreDoc, showEditDialog, drag, isActive, dragListeners, isDragging }: CustomCardProps) => {
  const { refreshCounter, setRefreshCounter } = useAppContext();

  const cardBackgroundColor = item.isCompleted ? theme.colors.cardCompleted : theme.colors.secondary;
  const hasSubCards = (item.items && item.items.length > 0) || item.createNewSubCard() !== null;
  const description = (item as any).description || (item as any).instructions;
  const titleOpacity = item.isCompleted ? 0.5 : 1;
  const descriptionOpacity = item.isCompleted ? 0.4 : 0.7;

  // Get section color based on collection
  const sectionKey = firestoreDoc.collection as "routines" | "exercises" | "meals";
  const sectionColor = theme.colors.sections[sectionKey]?.icon || theme.colors.accent;
  const sectionBgColor = theme.colors.sections[sectionKey]?.iconBackground || theme.colors.iconBackgrounds.blue;
  const sectionAccentColor = theme.colors.sections[sectionKey]?.accent || theme.colors.accent;
  const iconBackground = item.isCompleted ? sectionBgColor : theme.colors.secondary;
  const iconBorderColor = item.isCompleted ? sectionAccentColor : theme.colors.border;

  const handleCheckbox = (e?: any) => {
    console.log("handleCheckbox");
    e?.stopPropagation?.();
    item.onComplete(firestoreDoc);
    setRefreshCounter(prev => prev + 1);
  };

  const handleToggleExpand = (e?: any) => {
    console.log("handleToggleExpand");
    e?.stopPropagation?.();
    item.onToggleExpand(firestoreDoc);
    setRefreshCounter(prev => prev + 1);
  };

  const handleAddSubCard = (e?: any) => {
    console.log("handleAddSubCard");
    e?.stopPropagation?.();
    const newSubCard = item.createNewSubCard();
    if (item.skipDialogForNewChild()) {
      newSubCard.onSave(firestoreDoc, newSubCard.toFormData(), item, true, setRefreshCounter);
    } else {
      showEditDialog(newSubCard, item, firestoreDoc, true);
    }
  };

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: cardBackgroundColor },
      ]}
      testID="exercise-card"
    >
      <Pressable
        onPress={hasSubCards ? handleToggleExpand : () => showEditDialog(item, firestoreDoc, firestoreDoc, false)}
        onLongPress={() => showEditDialog(item, firestoreDoc, firestoreDoc, false)}
        style={[styles.accordionItem, { backgroundColor: cardBackgroundColor }]}
      >
        <View style={styles.headerContent}>
          <Pressable onPress={handleCheckbox} style={styles.iconContainer} hitSlop={8}>
            <View style={[styles.iconCircle, { backgroundColor: iconBackground, borderColor: iconBorderColor }]}>
              {item.isCompleted ? (
                <MaterialCommunityIcons name="check-bold" size={18} color={sectionAccentColor} />
              ) : (
                <MaterialCommunityIcons name="circle-outline" size={20} color={theme.colors.textMuted} />
              )}
            </View>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.accordionTitle, { opacity: titleOpacity }]}>{item.name || `Item ${index + 1}`}</Text>
            {description ? <Text style={[styles.accordionDescription, { opacity: descriptionOpacity }]}>{description}</Text> : null}
          </View>
          <View style={styles.rightContainer}>
            {hasSubCards && item.createNewSubCard() !== null && (
              <Pressable testID="add-subcard-button" onPress={handleAddSubCard} style={styles.actionIcon} hitSlop={8}>
                <MaterialCommunityIcons name="plus" size={20} color={theme.colors.textSecondary} />
              </Pressable>
            )}
            {hasSubCards && (
              <Pressable onPress={handleToggleExpand} style={styles.actionIcon} hitSlop={8}>
                <MaterialCommunityIcons
                  name={item.isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
            )}
            {(drag || dragListeners) && (
              <TouchableOpacity
                onLongPress={drag}
                delayLongPress={0}
                style={styles.actionIcon}
                hitSlop={8}
                activeOpacity={0.6}
                {...(dragListeners || {})}
              >
                <MaterialCommunityIcons name="drag-vertical" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
      {item.isExpanded &&
        item.items?.map((subItem: SubCardAbstract, subIndex: number) => {
          const tags = subItem.getTags();
          const tagString = tags.length > 0 ? tags.join(" • ") : undefined;
          const isLastItem = subIndex === item.items!.length - 1;

          return (
            <List.Item
              key={`${refreshCounter}-subcard-${index}-${subIndex}`}
              testID="subcard"
              title={subItem.name || `Set ${subIndex + 1}`}
              description={tagString}
              onPress={() => showEditDialog(subItem, item, firestoreDoc, false)}
              style={[styles.subCard, isLastItem && styles.subCardLast]}
              titleStyle={styles.subCardTitle}
              descriptionStyle={styles.subCardDescription}
            />
          );
        })}
    </Card>
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
    marginRight: theme.spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    paddingRight: theme.spacing.md,
    marginLeft: theme.spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  radioContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  actionIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.sm,
    ...(Platform.OS === "web" && {
      cursor: "pointer",
    }),
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
});

export default CustomCard;
