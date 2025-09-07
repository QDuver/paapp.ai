import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CardListAbstract } from "../../models/Abstracts";

interface EditDialogProps {
  visible: boolean;
  onClose: () => void;
  cardList: CardListAbstract;
  item: any;
  isCreate?: boolean;
  onSave?: (item: any) => void; // Optional callback when item is saved
}

const EditDialog = ({
  visible,
  onClose,
  cardList,
  item,
  isCreate = false,
  onSave,
}: EditDialogProps) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    if (visible && item && cardList) {
      const initialData: { [key: string]: any } = {};
      const fieldNames = item.getEditableFields
        ? item.getEditableFields()
        : Object.keys(item || {}).filter(
            (field) => field !== "isCompleted" && field !== "id"
          );

      fieldNames.forEach((fieldName) => {
        const value = item[fieldName];
        // Keep the original type, don't convert to string
        initialData[fieldName] = value;
      });

      setFormData(initialData);
      setErrors({});
    }
  }, [visible, item, cardList]);

  const handleInputChange = (fieldName: string, value: string) => {
    const fieldType = typeof item[fieldName];
    const currentValue = formData[fieldName];

    const convertedValue = convertInputValue(value, fieldType, currentValue);
    
    // Only update if the value actually changed or is valid
    if (convertedValue !== currentValue) {
      setFormData((prev) => ({ ...prev, [fieldName]: convertedValue }));
    }

    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // For now, just close the dialog since we don't have onDelete callback
          console.log("Item to delete:", item);
          onClose();
        },
      },
    ]);
  };

  const getFieldLabel = (fieldName: string): string => {
    return fieldName
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const typeToKeyboardType = (type: string): any => {
    switch (type) {
      case "number":
        return "number-pad"; // More restrictive than "numeric"
      default:
        return "default";
    }
  };

  const convertInputValue = (value: string, fieldType: string, currentValue: any): any => {
    if (fieldType === "number") {
      // Allow only numbers, decimal points, and negative signs for display
      const numericValue = value.replace(/[^0-9.-]/g, "");
      // Prevent multiple decimal points or negative signs
      const parts = numericValue.split(".");
      const cleanValue =
        parts.length > 2
          ? parts[0] + "." + parts.slice(1).join("")
          : numericValue;
      
      // Convert to actual number for storage
      if (cleanValue === "" || cleanValue === "-") {
        return null; // Keep null for empty or just negative sign
      } else {
        const numValue = Number(cleanValue);
        return isNaN(numValue) ? currentValue : numValue; // Return current value if invalid
      }
    } else if (fieldType === "boolean") {
      return value === "true";
    }
    // For strings, keep as is
    return value;
  };

  const renderField = (fieldName: string) => {
    if (!cardList) return null;

    const fieldType = typeof item[fieldName];

    const value = formData[fieldName];
    // Convert to string for display in TextInput, handling null/undefined
    const displayValue = value === null || value === undefined ? "" : value.toString();
    const hasError = !!errors[fieldName];
    const isMultiline =
      fieldName === "instructions" ||
      fieldName === "description" ||
      fieldName === "notes";
    const fieldLabel = getFieldLabel(fieldName);

    return (
      <View key={fieldName} style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: "#FFFFFF" }]}>
          {fieldLabel}
        </Text>

        <TextInput
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
          onChangeText={(text) => handleInputChange(fieldName, text)}
          placeholder={`Enter ${fieldLabel}`}
          placeholderTextColor="#8E8E93"
          keyboardType={typeToKeyboardType(fieldType)}
          inputMode={fieldType === "number" ? "numeric" : "text"}
          autoComplete={fieldType === "number" ? "off" : undefined}
          multiline={isMultiline}
          numberOfLines={isMultiline ? 3 : 1}
          textAlignVertical={isMultiline ? "top" : "center"}
        />

        {hasError && <Text style={styles.errorText}>{errors[fieldName]}</Text>}
      </View>
    );
  };

  if (!visible || !item || !cardList) {
    return null;
  }

  const fieldNames = item.getEditableFields
    ? item.getEditableFields()
    : Object.keys(item || {}).filter(
        (fieldName) => fieldName !== "isCompleted" && fieldName !== "id"
      );
  const editableFields = fieldNames;

  const modalBackgroundColor = "#1C1C1E";
  const overlayColor = "rgba(0,0,0,0.7)";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.overlay, { backgroundColor: overlayColor }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: modalBackgroundColor },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: "#FFFFFF" }]}>
              {isCreate ? "Add New Item" : "Edit Item"}
            </Text>
          </View>

          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            {editableFields.map(renderField)}
          </ScrollView>

          <View style={styles.actionContainer}>
            <View style={styles.actionRow}>
              {!isCreate && (
                <TouchableOpacity
                  style={[styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}

              <View style={styles.rightActions}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    {
                      backgroundColor: "#2C2C2E",
                    },
                  ]}
                  onPress={onClose}
                >
                  <Text style={[styles.cancelButtonText, { color: "#FFFFFF" }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={async () => {
                    console.log('formData', formData);
                    // Direct assignment since formData already has the correct types
                    const editableFields = item.getEditableFields
                      ? item.getEditableFields()
                      : Object.keys(item || {}).filter(
                          (fieldName) => fieldName !== "isCompleted" && fieldName !== "id"
                        );
                    
                    editableFields.forEach((fieldName) => {
                      if (formData.hasOwnProperty(fieldName)) {
                        const value = formData[fieldName];
                        const fieldType = typeof item[fieldName];
                        
                        // Handle null values for numeric fields by setting to 0 or keeping original
                        if (fieldType === "number" && value === null) {
                          // Keep the original value if new value is null/empty
                          // Or set to 0 if you prefer: item[fieldName] = 0;
                          return;
                        }
                        
                        item[fieldName] = value;
                      }
                    });
                    
                    // Trigger onFieldsUpdated if available (for derived fields)
                    if (typeof item.onFieldsUpdated === "function") {
                      item.onFieldsUpdated();
                    }
                    
                    // Call onSave callback if provided
                    if (onSave) {
                      onSave(item);
                    }
                    
                    onClose();
                  }}
                >
                  <Text style={styles.saveButtonText}>
                    {isCreate ? "Create" : "Save"}
                  </Text>
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
