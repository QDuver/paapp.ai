import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Modal, Portal, Text, Button } from "react-native-paper";
import { FirestoreDocAbstract } from "../../models/Abstracts";
import { theme } from "../../styles/theme";
import { sharedDialogStyles, getSectionColor, renderField } from "./shared";

interface BuildWithAiDialogProps {
  visible: boolean;
  firestoreDoc: FirestoreDocAbstract | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
}

const BuildWithAiDialog = ({ visible, firestoreDoc, setIsLoading, setData, onClose }: BuildWithAiDialogProps) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    if (visible && firestoreDoc) {
      setFormData({});
      setErrors({});
    }
  }, [visible, firestoreDoc]);

  const handleInputChange = (fieldName: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleGenerate = async () => {
    if (!firestoreDoc) return;
    setIsLoading(true);
    onClose();
    await firestoreDoc.buildWithAi(formData, setIsLoading, setData);
  };

  if (!visible || !firestoreDoc) {
    return null;
  }

  const sectionColor = getSectionColor(firestoreDoc.collection);
  const generateTitle = (firestoreDoc.constructor as typeof FirestoreDocAbstract).getUIMetadata().generateTitle || "Generate with AI";

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[sharedDialogStyles.modalContainer, { backgroundColor: theme.colors.modalBackground }]}
        testID="build-ai-dialog"
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={sharedDialogStyles.keyboardView}>
          <View style={sharedDialogStyles.titleContainer}>
            <View style={[sharedDialogStyles.titleAccent, { backgroundColor: sectionColor }]} />
            <Text variant="titleMedium" style={sharedDialogStyles.title}>
              {generateTitle}
            </Text>
          </View>

          <ScrollView style={sharedDialogStyles.formContainer} showsVerticalScrollIndicator={false}>
            {firestoreDoc.getEditableFields().map(fieldMetadata =>
              renderField({
                fieldMetadata,
                formData,
                errors,
                collection: firestoreDoc.collection,
                onInputChange: handleInputChange,
              })
            )}
          </ScrollView>

          <View style={sharedDialogStyles.actionContainer}>
            <View style={sharedDialogStyles.actionRow}>
              <View style={sharedDialogStyles.rightActions}>
                <Button testID="cancel-button" mode="text" textColor={theme.colors.textSecondary} onPress={onClose}>
                  Cancel
                </Button>

                <Button testID="generate-button" mode="contained" onPress={handleGenerate} buttonColor={sectionColor}>
                  Generate
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

export default BuildWithAiDialog;
