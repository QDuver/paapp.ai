import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-paper";
import { useAppContext } from "../../contexts/AppContext";
import { CardAbstract, FirestoreDocAbstract, IFieldMetadata } from "../../models/Abstracts";
import AutocompleteInput from "./AutocompleteInput";

const EditDialog = () => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const { onUpdate, onBuildItems, dialogSettings, hideEditDialog } = useAppContext();
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

    if (item.delete(parent)) {
      onUpdate(cardList);
    }

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
            <Text style={[styles.fieldLabel, { color: "#FFFFFF", flex: 1 }]}>{fieldLabel}</Text>
            <Switch
              value={!!value}
              onValueChange={newValue => handleInputChange(fieldName, newValue)}
              thumbColor="#FFFFFF"
              trackColor={{ false: "#3A3A3C", true: "#007AFF" }}
            />
          </View>
          {hasError && <Text style={styles.errorText}>{errors[fieldName]}</Text>}
        </View>
      );
    }

    const shouldUseAutocomplete =
      (hasSuggestions && !isMultiline) || (fieldName === "name" && cardList?.collection === "exercises" && !isMultiline);

    return (
      <View key={fieldName} testID="form-field" style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: "#FFFFFF" }]}>{fieldLabel}</Text>

        {shouldUseAutocomplete ? (
          <AutocompleteInput
            value={displayValue}
            onChangeText={text => handleInputChange(fieldName, text)}
            placeholder={`Enter ${fieldLabel}`}
            placeholderTextColor="#8E8E93"
            suggestions={suggestions}
            style={[styles.textInput]}
            keyboardType={keyboardType || "default"}
            inputMode={fieldType === "number" ? "numeric" : "text"}
            autoComplete={fieldType === "number" ? "off" : undefined}
            hasError={hasError}
            borderColor="#48484A"
            backgroundColor="#2C2C2E"
            color="#FFFFFF"
            onSuggestionSelect={suggestion => {
              (item as CardAbstract).handleSuggestionSelect(suggestion);
              item.onSave({ name: suggestion.name }, parent, isNew);
              onUpdate(cardList);
              hideEditDialog();
            }}
            fieldName={fieldName}
          />
        ) : (
          <TextInput
            testID="form-input"
            style={[
              styles.textInput,
              isMultiline && styles.multilineInput,
              {
                backgroundColor: "#2C2C2E",
                borderColor: hasError ? "#FF3B30" : "#48484A",
                color: "#FFFFFF",
              },
            ]}
            value={displayValue}
            onChangeText={text => handleInputChange(fieldName, text)}
            placeholder={`Enter ${fieldLabel}`}
            placeholderTextColor="#8E8E93"
            keyboardType={keyboardType || "default"}
            inputMode={fieldType === "number" ? "numeric" : "text"}
            autoComplete={fieldType === "number" ? "off" : undefined}
            multiline={isMultiline}
            numberOfLines={isMultiline ? 3 : 1}
            textAlignVertical={isMultiline ? "top" : "center"}
          />
        )}

        {hasError && <Text style={styles.errorText}>{errors[fieldName]}</Text>}
      </View>
    );
  };

  if (!visible || !item || !cardList || !parent) {
    return null;
  }

  const modalBackgroundColor = "#1C1C1E";
  const overlayColor = "rgba(0,0,0,0.7)";

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={hideEditDialog} testID="edit-dialog">
      <KeyboardAvoidingView
        style={[styles.overlay, { backgroundColor: overlayColor }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.modalContainer, { backgroundColor: modalBackgroundColor }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: "#FFFFFF" }]}>Edit Item</Text>
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
                <TouchableOpacity testID="delete-button" style={[styles.deleteButton]} onPress={handleDelete}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}

              <View style={styles.rightActions}>
                <TouchableOpacity
                  testID="cancel-button"
                  style={[
                    styles.cancelButton,
                    {
                      backgroundColor: "#2C2C2E",
                    },
                  ]}
                  onPress={hideEditDialog}
                >
                  <Text style={[styles.cancelButtonText, { color: "#FFFFFF" }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="save-button"
                  style={styles.saveButton}
                  onPress={() => {
                    if (!(item instanceof FirestoreDocAbstract)) {
                      item.onSave(formData, parent, isNew);
                      console.log("cardList", cardList);
                      onUpdate(cardList);
                    } else {
                      onBuildItems(cardList, formData);
                    }
                    hideEditDialog();
                  }}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
  },
  multilineInput: {
    minHeight: 80,
    maxHeight: 120,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  actionContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "500",
  },
  rightActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditDialog;
