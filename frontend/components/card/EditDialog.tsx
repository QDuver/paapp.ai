import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Modal, Portal, Text, TextInput, Switch, Button, Divider } from "react-native-paper";
import { useAppContext } from "../../contexts/AppContext";
import { useDialogContext } from "../../contexts/DialogContext";
import { CardAbstract, FirestoreDocAbstract, IFieldMetadata } from "../../models/Abstracts";
import AutocompleteInput from "./AutocompleteInput";
import { theme, commonStyles } from "../../styles/theme";

const EditDialog = () => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const { data, onBuildWithAi, setRefreshCounter } = useAppContext();
  const { dialogSettings, hideEditDialog } = useDialogContext();
  const { visible, item, parent, firestoreDoc, isNew } = dialogSettings;

  useEffect(() => {
    if (visible && item && firestoreDoc) {
      setFormData(item.toFormData());
      setErrors({});
    }
  }, [visible, item, firestoreDoc]);

  const handleInputChange = (fieldName: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to delete this item?");
      if (!confirmed) return;
    }

    item.delete(firestoreDoc, parent);
    hideEditDialog();
  };

  const getSectionColor = () => {
    const collection = firestoreDoc?.collection;
    if (collection === "routines") return theme.colors.sections.routines.accent;
    if (collection === "exercises") return theme.colors.sections.exercises.accent;
    if (collection === "meals") return theme.colors.sections.meals.accent;
    return theme.colors.buttonPrimary;
  };

  const renderField = (fieldMetadata: IFieldMetadata) => {
    if (!firestoreDoc) return null;

    const { field: fieldName, label: fieldLabel, type: fieldType, keyboardType, multiline, suggestions } = fieldMetadata;

    const value = formData[fieldName];
    const displayValue = value === null || value === undefined ? "" : value.toString();
    const hasError = !!errors[fieldName];
    const isMultiline = multiline || false;
    const hasSuggestions = suggestions && suggestions.length > 0;

    // Handle boolean fields with a toggle
    if (fieldType === "boolean") {
      return (
        <View key={fieldName} style={styles.fieldContainer}>
          <View style={styles.toggleContainer}>
            <Text variant="bodyLarge" style={styles.fieldLabel}>
              {fieldLabel}
            </Text>
            <Switch
              value={!!value}
              onValueChange={newValue => handleInputChange(fieldName, newValue)}
              color={getSectionColor()}
            />
          </View>
          {hasError && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors[fieldName]}
            </Text>
          )}
        </View>
      );
    }

    const shouldUseAutocomplete =
      (hasSuggestions && !isMultiline) || (fieldName === "name" && firestoreDoc?.collection === "exercises" && !isMultiline);

    return (
      <View key={fieldName} testID="form-field" style={styles.fieldContainer}>
        {shouldUseAutocomplete ? (
          <AutocompleteInput
            value={displayValue}
            onChangeText={text => handleInputChange(fieldName, text)}
            placeholder={fieldLabel}
            placeholderTextColor={theme.colors.textMuted}
            suggestions={suggestions}
            fallbackSuggestions={data?.uniqueExercises}
            collection={firestoreDoc.collection}
            style={[styles.textInput]}
            keyboardType={keyboardType || "default"}
            inputMode={fieldType === "number" ? "numeric" : "text"}
            autoComplete={fieldType === "number" ? "off" : undefined}
            hasError={hasError}
            borderColor={theme.colors.border}
            backgroundColor={theme.colors.modalSecondary}
            color={theme.colors.text}
            onSuggestionSelect={suggestion => {
              (item as CardAbstract).handleSuggestionSelect(suggestion);
              item.onSave(firestoreDoc, { name: suggestion.name }, parent, isNew, setRefreshCounter);
              hideEditDialog();
            }}
            fieldName={fieldName}
          />
        ) : (
          <TextInput
            testID="form-input"
            mode="outlined"
            style={[styles.textInput, isMultiline && styles.multilineInput]}
            value={displayValue}
            onChangeText={text => handleInputChange(fieldName, text)}
            placeholder={fieldLabel}
            placeholderTextColor={theme.colors.textMuted}
            keyboardType={keyboardType || "default"}
            inputMode={fieldType === "number" ? "numeric" : "text"}
            autoComplete={fieldType === "number" ? "off" : undefined}
            multiline={isMultiline}
            numberOfLines={isMultiline ? 3 : 1}
            error={hasError}
            outlineColor={theme.colors.border}
            activeOutlineColor={getSectionColor()}
          />
        )}

        {hasError && (
          <Text variant="bodySmall" style={styles.errorText}>
            {errors[fieldName]}
          </Text>
        )}
      </View>
    );
  };

  if (!visible || !item || !firestoreDoc || !parent) {
    return null;
  }

  const sectionColor = getSectionColor();

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={hideEditDialog}
        contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.modalBackground }]}
        testID="edit-dialog"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.titleContainer}>
            <View style={[styles.titleAccent, { backgroundColor: sectionColor }]} />
            <Text variant="titleMedium" style={styles.title}>
              {isNew && item instanceof FirestoreDocAbstract && (item.constructor as typeof FirestoreDocAbstract).getUIMetadata().generateTitle
                ? (item.constructor as typeof FirestoreDocAbstract).getUIMetadata().generateTitle
                : isNew ? "New Item" : "Edit Item"}
            </Text>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {(() => {
              const editableFields = item.getEditableFields();
              const filteredFields = editableFields.filter(fieldMetadata => isNew || formData[fieldMetadata.field] != null);
              return filteredFields.map(renderField);
            })()}
          </ScrollView>

          <View style={styles.actionContainer}>
            <View style={styles.actionRow}>
              {!isNew && (
                <Button
                  testID="delete-button"
                  mode="text"
                  textColor={theme.colors.error}
                  onPress={handleDelete}
                >
                  Delete
                </Button>
              )}

              <View style={styles.rightActions}>
                <Button
                  testID="cancel-button"
                  mode="text"
                  textColor={theme.colors.textSecondary}
                  onPress={hideEditDialog}
                >
                  Cancel
                </Button>

                <Button
                  testID="save-button"
                  mode="contained"
                  onPress={() => {
                    if (!(item instanceof FirestoreDocAbstract)) {
                      item.onSave(firestoreDoc, formData, parent, isNew, setRefreshCounter);
                    } else {
                      onBuildWithAi(firestoreDoc, formData);
                    }
                    hideEditDialog();
                  }}
                  buttonColor={sectionColor}
                >
                  Save
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...commonStyles.modalContainer,
    margin: theme.spacing.lg,
    maxHeight: "90%",
    borderRadius: theme.borderRadius.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  keyboardView: {
    flex: 1,
  },
  titleContainer: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
  },
  titleAccent: {
    width: 32,
    height: 3,
    borderRadius: theme.borderRadius.xs,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text,
  },
  formContainer: {
    flex: 1,
    padding: theme.spacing.xxl,
    paddingTop: theme.spacing.md,
  },
  fieldContainer: {
    marginBottom: theme.spacing.lg,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.xs,
  },
  fieldLabel: {
    fontWeight: theme.typography.weights.medium,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
  },
  textInput: {
    backgroundColor: theme.colors.modalSecondary,
  },
  multilineInput: {
    minHeight: 80,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.sizes.sm,
  },
  actionContainer: {
    padding: theme.spacing.xxl,
    paddingTop: theme.spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
});

export default EditDialog;
