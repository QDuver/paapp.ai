import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, List, TextInput, Button, Card, Switch } from "react-native-paper";
import { useAppContext } from "../contexts/AppContext";
import { Settings, SettingsModule } from "../models/Settings";

interface SettingsProps {
  onBack: () => void;
}

type ModuleKey = "routines" | "exercises" | "meals";

export const SettingsPage = ({ onBack }: SettingsProps) => {
  const { data, setRefreshCounter } = useAppContext();
  const [editingModule, setEditingModule] = useState<ModuleKey | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const renderModuleSection = (moduleKey: ModuleKey, title: string) => {
    if (!data?.settings) return null;

    const module: SettingsModule = data.settings[moduleKey];
    const isEditing = editingModule === moduleKey;

    return (
      <View key={moduleKey}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerContainer}>
              <List.Subheader style={styles.moduleTitle}>{title}</List.Subheader>
              <Switch
                value={module.enabled}
                onValueChange={() => module.onSave(data.settings, "enabled", !module.enabled, setRefreshCounter)}
                color="#6A5ACD"
              />
            </View>

            {module.enabled && (
              <>
                <TextInput
                  mode="outlined"
                  multiline
                  numberOfLines={10}
                  value={isEditing ? editingText : (module.prompt || "")}
                  onChangeText={setEditingText}
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
                    <Button mode="contained" onPress={() => { setEditingText(module.prompt || ""); setEditingModule(moduleKey); }} style={styles.button} buttonColor="#6A5ACD">
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        mode="outlined"
                        onPress={() => { setEditingModule(null); }}
                        style={styles.button}
                        textColor="#fff"
                      >
                        Cancel
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => { module.onSave(data.settings, "prompt", editingText, setRefreshCounter); setEditingModule(null); }}
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
  card: {
    backgroundColor: "#111",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  moduleTitle: {
    color: "#6A5ACD",
    fontSize: 18,
    fontWeight: "700",
    margin: 0,
    padding: 0,
  },
  textInput: {
    backgroundColor: "#000",
    minHeight: 200,
    marginTop: 8,
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
