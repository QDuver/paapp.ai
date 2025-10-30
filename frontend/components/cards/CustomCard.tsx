import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Text, Platform, TouchableOpacity } from "react-native";
import { Card, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardAbstract, FirestoreDocAbstract, SubCardAbstract, DialogableAbstract } from "../../models/Abstracts";
import { useAppContext } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";
import AutocompleteInput from "./AutocompleteInput";

interface CustomCardProps {
  firestoreDoc: FirestoreDocAbstract;
  item: CardAbstract;
  index: number;
  drag?: () => void;
  isActive?: boolean;
  dragListeners?: any;
  isDragging?: boolean;
}

const CustomCard = ({ item, index, firestoreDoc, drag, isActive, dragListeners, isDragging }: CustomCardProps) => {
  const { refreshCounter, setRefreshCounter, data, editDialogState, setEditDialogState, editableItem, setEditableItem } = useAppContext();
  const [inlineEditValue, setInlineEditValue] = useState("");

  const editableFields = item.getEditableFields();
  const canInlineEdit = editableFields.length === 1;
  const singleField = editableFields[0];
  const isInlineEditing = editableItem === item && canInlineEdit && !editDialogState.firestoreDoc;

  useEffect(() => {
    if (isInlineEditing && singleField) {
      const currentValue = (item as any)[singleField.field] || "";
      setInlineEditValue(currentValue);
    }
  }, [isInlineEditing]);

  const cardBackgroundColor = item.isCompleted ? theme.colors.cardCompleted : theme.colors.secondary;
  const hasSubCards = item.items && item.items.length > 0;
  const canAddSubCards = item.createNewSubCard() !== null;
  const description = (item as any).description || (item as any).instructions;
  const titleOpacity = item.isCompleted ? 0.5 : 1;
  const descriptionOpacity = item.isCompleted ? 0.4 : 0.7;

  const sectionKey = firestoreDoc.collection as "routines" | "exercises" | "meals";
  const sectionAccentColor = theme.colors.sections[sectionKey]?.accent || theme.colors.accent;

  const showEditDialog = () => {
    setEditableItem(item);
    setEditDialogState({ parent: firestoreDoc, firestoreDoc, isNew: false });
  };

  const handleCheckbox = (e?: any) => {
    e?.stopPropagation?.();
    item.onComplete(firestoreDoc);
    setRefreshCounter(prev => prev + 1);
  };

  const handleToggleExpand = (e?: any) => {
    e?.stopPropagation?.();
    item.onToggleExpand(firestoreDoc);
    setRefreshCounter(prev => prev + 1);
  };

  const handleAddSubCard = (e?: any) => {
    e?.stopPropagation?.();
    const newSubCard = item.createNewSubCard();
    item.isExpanded = true;
    if (item.skipDialogForNewChild()) {
      newSubCard.onSave(firestoreDoc, newSubCard.toFormData(), item, true, setRefreshCounter);
    } else {
      setEditableItem(newSubCard);
      setEditDialogState({ parent: item, firestoreDoc, isNew: true });
    }
    setRefreshCounter(prev => prev + 1);
  };

  const handleStartInlineEdit = (e?: any) => {
    e?.stopPropagation?.();
    if (!canInlineEdit) return;
    setEditableItem(item);
  };

  const handleSaveInlineEdit = () => {
    if (!singleField) return;

    const trimmedValue = inlineEditValue.trim();
    if (!trimmedValue) {
      const itemIsEmpty = !(item as any)[singleField.field] || (item as any)[singleField.field].trim() === '';
      if (itemIsEmpty && firestoreDoc.items) {
        const index = firestoreDoc.items.indexOf(item as any);
        if (index > -1) {
          firestoreDoc.items.splice(index, 1);
          setRefreshCounter(prev => prev + 1);
        }
      }
      setEditableItem(null);
      return;
    }

    const formData = { [singleField.field]: inlineEditValue };
    item.onSave(firestoreDoc, formData, firestoreDoc, false, setRefreshCounter);
    setEditableItem(null);
  };

  const handleInlineSuggestionSelect = (suggestion: any) => {
    if (!singleField) return;
    (item as CardAbstract).handleSuggestionSelect(suggestion);
    const formData = { [singleField.field]: suggestion.name };
    item.onSave(firestoreDoc, formData, firestoreDoc, false, setRefreshCounter);
    setEditableItem(null);
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
        onLongPress={showEditDialog}
        style={[styles.accordionItem, { backgroundColor: cardBackgroundColor }]}
      >
        <View style={styles.headerContent}>
          <Pressable onPress={handleCheckbox} style={styles.iconContainer} hitSlop={8}>
            {item.isCompleted ? (
              <View style={[styles.completedCircle, { backgroundColor: sectionAccentColor }]}>
                <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
              </View>
            ) : (
              <View style={[styles.emptyCircle, { borderColor: sectionAccentColor }]} />
            )}
          </Pressable>
          <Pressable
            onPress={canInlineEdit ? handleStartInlineEdit : showEditDialog}
            onLongPress={showEditDialog}
            style={styles.headerText}
          >
            {isInlineEditing ? (
              <View onStartShouldSetResponder={() => true}>
                <AutocompleteInput
                  value={inlineEditValue}
                  onChangeText={setInlineEditValue}
                  placeholder={singleField?.placeholder || "Enter value"}
                  fieldName={singleField?.field}
                  collection={firestoreDoc.collection}
                  data={data}
                  textStyle={styles.inlineEditInput}
                  backgroundColor={theme.colors.primary}
                  borderColor={sectionAccentColor}
                  onSuggestionSelect={handleInlineSuggestionSelect}
                  onBlur={handleSaveInlineEdit}
                  onSubmitEditing={handleSaveInlineEdit}
                  autoFocus={true}
                />
              </View>
            ) : (
              <>
                <Text style={[styles.accordionTitle, { opacity: titleOpacity }]}>{item.name || `Item ${index + 1}`}</Text>
                {description ? <Text style={[styles.accordionDescription, { opacity: descriptionOpacity }]}>{description}</Text> : null}
              </>
            )}
          </Pressable>
          {!isInlineEditing && (
            <View style={styles.rightContainer}>
              {canAddSubCards && (
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
                  style={[styles.actionIcon, Platform.OS === "web" && styles.dragHandle]}
                  hitSlop={8}
                  activeOpacity={0.6}
                  {...(Platform.OS === "web" ? dragListeners : {})}
                >
                  <MaterialCommunityIcons name="drag-vertical" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Pressable>
      {item.isExpanded && !isDragging && !isActive &&
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
              onPress={() => {setEditableItem(subItem); setEditDialogState({ parent: item, firestoreDoc, isNew: false })}}
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
    paddingVertical: theme.spacing.md,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  completedCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
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
  dragHandle: Platform.OS === "web"
    ? ({ touchAction: "none" as any, width: 40, height: 40, cursor: "grab" as any } as any)
    : ({ width: 40, height: 40 } as any),
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
  inlineEditInput: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    letterSpacing: -0.3,
  },
});

export default CustomCard;
