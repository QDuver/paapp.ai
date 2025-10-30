import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Modal, Portal, Text, TextInput, Button } from "react-native-paper";
import { theme } from "../../styles/theme";
import { sharedDialogStyles, getSectionColor } from "./shared";
import { useAppContext } from "../../contexts/AppContext";

interface EditPromptDialogProps {
  visible: boolean;
  collection: string | null;
  onClose: () => void;
}

const EditPromptDialog = ({ visible, collection, onClose }: EditPromptDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const { data } = useAppContext();

  useEffect(() => {
    if (visible && collection && data?.settings) {
      const modulePrompt = (data.settings as any)[collection]?.prompt || "";
      setPrompt(modulePrompt);
    }
  }, [visible, collection, data?.settings]);

  const handleSave = async () => {
    if (!data?.settings || !collection) return;

    (data.settings as any)[collection].prompt = prompt;
    await data.settings.onSave();
    onClose();
  };

  if (!visible || !collection) {
    return null;
  }

  const sectionColor = getSectionColor(collection);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[sharedDialogStyles.modalContainer, { backgroundColor: theme.colors.modalBackground }]}
        testID="edit-prompt-dialog"
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={sharedDialogStyles.keyboardView}>
          <View style={sharedDialogStyles.titleContainer}>
            <View style={[sharedDialogStyles.titleAccent, { backgroundColor: sectionColor }]} />
            <Text variant="titleMedium" style={sharedDialogStyles.title}>
              Objectives
            </Text>
          </View>

          <ScrollView style={sharedDialogStyles.formContainer} showsVerticalScrollIndicator={false}>
            <TextInput
              testID="prompt-input"
              mode="outlined"
              style={[sharedDialogStyles.textInput, { minHeight: 300 }]}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Enter AI prompt for this collection..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={15}
              outlineColor={theme.colors.border}
              activeOutlineColor={sectionColor}
            />
          </ScrollView>

          <View style={sharedDialogStyles.actionContainer}>
            <View style={sharedDialogStyles.actionRow}>
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

export default EditPromptDialog;
