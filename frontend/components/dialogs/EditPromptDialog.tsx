import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, ActivityIndicator } from "react-native";
import { Modal, Portal, Text, TextInput, Button } from "react-native-paper";
import { Settings } from "../../models/Settings";
import { theme } from "../../styles/theme";
import { sharedDialogStyles, getSectionColor } from "./shared";

interface EditPromptDialogProps {
  visible: boolean;
  collection: string | null;
  onClose: () => void;
}

const EditPromptDialog = ({ visible, collection, onClose }: EditPromptDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (visible && collection) {
        setIsLoading(true);
          const settingsDoc = await Settings.fromApi<Settings>(setSettings);
          const modulePrompt = (settingsDoc as any)[collection]?.prompt || "";
          setPrompt(modulePrompt);
          setIsLoading(false);
      }
    };

    loadSettings();
  }, [visible, collection]);

  const handleSave = async () => {
    if (!settings || !collection) return;

    (settings as any)[collection].prompt = prompt;
    await settings.onSave();
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
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={sharedDialogStyles.keyboardView}>
          <View style={sharedDialogStyles.titleContainer}>
            <View style={[sharedDialogStyles.titleAccent, { backgroundColor: sectionColor }]} />
            <Text variant="titleMedium" style={sharedDialogStyles.title}>
              Edit {collection.charAt(0).toUpperCase() + collection.slice(1)} Prompt
            </Text>
          </View>

          <ScrollView style={sharedDialogStyles.formContainer} showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="large" color={sectionColor} />
              </View>
            ) : (
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
            )}
          </ScrollView>

          <View style={sharedDialogStyles.actionContainer}>
            <View style={sharedDialogStyles.actionRow}>
              <View style={sharedDialogStyles.rightActions}>
                <Button testID="cancel-button" mode="text" textColor={theme.colors.textSecondary} onPress={onClose}>
                  Cancel
                </Button>

                <Button testID="save-button" mode="contained" onPress={handleSave} buttonColor={sectionColor} disabled={isLoading}>
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
