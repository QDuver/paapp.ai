import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  List,
  TextInput,
  Button,
  Card,
  Switch,
} from "react-native-paper";
import { useAppContext } from "../contexts/AppContext";
import { ISettings } from "../models/Settings";

interface SettingsProps {
  onBack: () => void;
}

type ModuleKey = "routines" | "exercises" | "meals";

const Settings = ({ onBack }: SettingsProps) => {
  const { settings, updateSettings } = useAppContext();
  const [localSettings, setLocalSettings] = useState<ISettings | null>(
    settings
  );
  const [editingModule, setEditingModule] = useState<ModuleKey | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = async () => {
    if (!localSettings) return;
    setIsSaving(true);
    await updateSettings(localSettings);
    setIsSaving(false);
    setEditingModule(null);
  };

  const toggleModule = async (module: ModuleKey) => {
    if (!localSettings) return;
    const updatedSettings = {
      ...localSettings,
      [module]: {
        ...localSettings[module],
        enabled: !localSettings[module].enabled,
      },
    };
    setLocalSettings(updatedSettings);
    await updateSettings(updatedSettings);
  };

  const updatePrompt = (module: ModuleKey, prompt: string) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      [module]: {
        ...localSettings[module],
        prompt,
      },
    });
  };

  const renderModuleSection = (module: ModuleKey, title: string) => {
    if (!localSettings) return null;

    const moduleData = localSettings[module];
    const isEditing = editingModule === module;

    return (
      <View key={module}>
        <List.Subheader style={styles.subheader}>{title}</List.Subheader>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.toggleContainer}>
              <List.Item
                title="Enabled"
                titleStyle={styles.toggleTitle}
                right={() => (
                  <Switch
                    value={moduleData.enabled}
                    onValueChange={() => toggleModule(module)}
                    color="#6A5ACD"
                  />
                )}
                style={styles.toggleItem}
              />
            </View>

            {moduleData.enabled && (
              <>
                <TextInput
                  mode="outlined"
                  multiline
                  numberOfLines={10}
                  value={moduleData.prompt || ""}
                  onChangeText={text => updatePrompt(module, text)}
                  editable={isEditing}
                  style={styles.textInput}
                  outlineColor="#333"
                  activeOutlineColor="#6A5ACD"
                  textColor="#fff"
                  placeholderTextColor="#888"
                  placeholder="Enter prompt..."
                />
                <View style={styles.buttonContainer}>
                  {!isEditing ? (
                    <Button
                      mode="contained"
                      onPress={() => setEditingModule(module)}
                      style={styles.button}
                      buttonColor="#6A5ACD"
                    >
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          setEditingModule(null);
                          setLocalSettings(settings);
                        }}
                        style={styles.button}
                        textColor="#fff"
                      >
                        Cancel
                      </Button>
                      <Button
                        mode="contained"
                        onPress={saveSettings}
                        loading={isSaving}
                        disabled={isSaving}
                        style={styles.button}
                        buttonColor="#6A5ACD"
                      >
                        Save
                      </Button>
                    </>
                  )}
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={onBack} iconColor="#fff" />
        <Appbar.Content title="Settings" titleStyle={styles.appBarTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <List.Section>
          {renderModuleSection("routines", "Routines")}
          {renderModuleSection("exercises", "Exercises")}
          {renderModuleSection("meals", "Meals")}
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  appBar: {
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    elevation: 0,
  },
  appBarTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  subheader: {
    color: "#6A5ACD",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
  },
  card: {
    backgroundColor: "#111",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  toggleContainer: {
    marginBottom: 8,
  },
  toggleItem: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  toggleTitle: {
    color: "#fff",
    fontSize: 16,
  },
  textInput: {
    backgroundColor: "#000",
    minHeight: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  button: {
    marginLeft: 8,
  },
});

export default Settings;
