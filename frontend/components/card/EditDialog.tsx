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

  const { onBuildWithAi, setRefreshCounter } = useAppContext();
  const { dialogSettings, hideEditDialog } = useDialogContext();
  const { visible, item, parent, cardList, isNew } = dialogSettings;

  useEffect(() => {
    if (visible && item && cardList) {
      setFormData(item.toFormData());
      setErrors({});
    }
  }, [visible, item, cardList]);

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

    item.delete(cardList, parent);
    hideEditDialog();
  };

  const renderField = (fieldMetadata: IFieldMetadata) => {
    if (!cardList) return null;

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
      (hasSuggestions && !isMultiline) || (fieldName === "name" && cardList?.collection === "exercises" && !isMultiline);

    return (
      <View key={fieldName} testID="form-field" style={styles.fieldContainer}>
        <Text variant="bodyLarge" style={styles.fieldLabel}>
          {fieldLabel}
        </Text>

        {shouldUseAutocomplete ? (
          <AutocompleteInput
            value={displayValue}
            onChangeText={text => handleInputChange(fieldName, text)}
            placeholder={`Enter ${fieldLabel}`}
            placeholderTextColor={theme.colors.textMuted}
            suggestions={suggestions}
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
              item.onSave(cardList, { name: suggestion.name }, parent, isNew, setRefreshCounter);
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
            placeholder={`Enter ${fieldLabel}`}
            placeholderTextColor={theme.colors.textMuted}
            keyboardType={keyboardType || "default"}
            inputMode={fieldType === "number" ? "numeric" : "text"}
            autoComplete={fieldType === "number" ? "off" : undefined}
            multiline={isMultiline}
            numberOfLines={isMultiline ? 3 : 1}
            error={hasError}
            outlineColor={theme.colors.border}
            activeOutlineColor={theme.colors.buttonPrimary}
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

  if (!visible || !item || !cardList || !parent) {
    return null;
  }

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
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>
              Edit Item
            </Text>
          </View>

          <Divider />

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {(() => {
              const editableFields = item.getEditableFields();
              const filteredFields = editableFields.filter(fieldMetadata => isNew || formData[fieldMetadata.field] != null);
              return filteredFields.map(renderField);
            })()}
          </ScrollView>

          <Divider />

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
                  mode="outlined"
                  onPress={hideEditDialog}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>

                <Button
                  testID="save-button"
                  mode="contained"
                  onPress={() => {
                    if (!(item instanceof FirestoreDocAbstract)) {
                      item.onSave(cardList, formData, parent, isNew, setRefreshCounter);
                    } else {
                      onBuildWithAi(cardList, formData);
                    }
                    hideEditDialog();
                  }}
                  buttonColor={theme.colors.buttonPrimary}
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
    borderRadius: theme.borderRadius.xl,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.xl,
  },
  title: {
    textAlign: "center",
    fontWeight: theme.typography.weights.semibold,
  },
  formContainer: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  fieldContainer: {
    marginBottom: theme.spacing.xl,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.sm,
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
  },
  actionContainer: {
    padding: theme.spacing.xl,
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
  cancelButton: {
    borderColor: theme.colors.border,
  },
});

export default EditDialog;
