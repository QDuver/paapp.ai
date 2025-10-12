import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, List, TextInput, Button, Card, Switch } from "react-native-paper";
import { useAppContext } from "../contexts/AppContext";
import { Settings, SettingsModule } from "../models/Settings";
import { theme, commonStyles } from "../styles/theme";

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
                color={theme.colors.accent}
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
                  outlineColor={theme.colors.border}
                  activeOutlineColor={theme.colors.accent}
                  textColor={theme.colors.text}
                  placeholderTextColor={theme.colors.textMuted}
                  placeholder="Enter prompt..."
                />
                <View style={styles.buttonContainer}>
                  {!isEditing ? (
                    <Button mode="contained" onPress={() => { setEditingText(module.prompt || ""); setEditingModule(moduleKey); }} style={styles.button} buttonColor={theme.colors.accent}>
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        mode="outlined"
                        onPress={() => { setEditingModule(null); }}
                        style={styles.button}
                        textColor={theme.colors.text}
                      >
                        Cancel
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => { module.onSave(data.settings, "prompt", editingText, setRefreshCounter); setEditingModule(null); }}
                        style={styles.button}
                        buttonColor={theme.colors.accent}
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
        <Appbar.BackAction onPress={onBack} iconColor={theme.colors.text} />
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
  container: commonStyles.container,
  appBar: {
    ...commonStyles.appBar,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  appBarTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.secondary,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.card,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  moduleTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    margin: 0,
    padding: 0,
    letterSpacing: -0.3,
  },
  textInput: {
    backgroundColor: theme.colors.primary,
    minHeight: 200,
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.sizes.sm,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  button: {
    marginLeft: theme.spacing.sm,
  },
});
