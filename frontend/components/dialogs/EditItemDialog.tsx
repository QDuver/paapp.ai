import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Modal, Portal, Text, Button } from "react-native-paper";
import { useAppContext } from "../../contexts/AppContext";
import { CardAbstract, FirestoreDocAbstract, DialogableAbstract } from "../../models/Abstracts";
import { theme } from "../../styles/theme";
import { sharedDialogStyles, getSectionColor, renderField } from "./shared";

interface EditItemDialogProps {
  visible: boolean;
  item: DialogableAbstract | null;
  parent: FirestoreDocAbstract | CardAbstract | null;
  firestoreDoc: FirestoreDocAbstract | null;
  isNew: boolean;
  onClose: () => void;
}

const EditItemDialog = ({ visible, item, parent, firestoreDoc, isNew, onClose }: EditItemDialogProps) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const { data, setRefreshCounter } = useAppContext();

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
    if (!item || !firestoreDoc || !parent) return;

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to delete this item?");
      if (!confirmed) return;
    }

    item.delete(firestoreDoc, parent);
    onClose();
  };

  const handleSave = () => {
    if (!item || !firestoreDoc || !parent) return;
    item.onSave(firestoreDoc, formData, parent, isNew, setRefreshCounter);
    onClose();
  };

  const handleSuggestionSelect = (suggestion: any) => {
    if (!item || !firestoreDoc || !parent) return;

    (item as CardAbstract).handleSuggestionSelect(suggestion);
    item.onSave(firestoreDoc, { name: suggestion.name }, parent, isNew, setRefreshCounter);
    onClose();
  };

  if (!visible || !item || !firestoreDoc || !parent) {
    return null;
  }

  const sectionColor = getSectionColor(firestoreDoc.collection);

  const editableFields = item.getEditableFields();
  const filteredFields = editableFields.filter(fieldMetadata => isNew || formData[fieldMetadata.field] != null);

  const dialogTitle =
    isNew && item instanceof FirestoreDocAbstract && (item.constructor as typeof FirestoreDocAbstract).getUIMetadata().generateTitle
      ? (item.constructor as typeof FirestoreDocAbstract).getUIMetadata().generateTitle
      : isNew
        ? "New Item"
        : "Edit Item";

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[sharedDialogStyles.modalContainer, { backgroundColor: theme.colors.modalBackground }]}
        testID="edit-dialog"
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={sharedDialogStyles.keyboardView}>
          <View style={sharedDialogStyles.titleContainer}>
            <View style={[sharedDialogStyles.titleAccent, { backgroundColor: sectionColor }]} />
            <Text variant="titleMedium" style={sharedDialogStyles.title}>
              {dialogTitle}
            </Text>
          </View>

          <ScrollView style={sharedDialogStyles.formContainer} showsVerticalScrollIndicator={false}>
            {filteredFields.map(fieldMetadata =>
              renderField({
                fieldMetadata,
                formData,
                errors,
                collection: firestoreDoc.collection,
                data,
                onInputChange: handleInputChange,
                onSuggestionSelect: handleSuggestionSelect,
              })
            )}
          </ScrollView>

          <View style={sharedDialogStyles.actionContainer}>
            <View style={sharedDialogStyles.actionRow}>
              {!isNew && (
                <Button testID="delete-button" mode="text" textColor={theme.colors.error} onPress={handleDelete}>
                  Delete
                </Button>
              )}

              <View style={sharedDialogStyles.rightActions}>
                <Button testID="cancel-button" mode="text" textColor={theme.colors.textSecondary} onPress={onClose}>
                  Cancel
                </Button>

                <Button testID="save-button" mode="contained" onPress={handleSave} buttonColor={sectionColor}>
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

export default EditItemDialog;
