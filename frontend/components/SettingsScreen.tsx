import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  List,
  Divider,
  TextInput,
  Button,
  Card,
} from "react-native-paper";
import useApi from "../hooks/useApi";

interface SettingsScreenProps {
  onBack: () => void;
}

interface PromptResponse {
  prompt: string;
}

const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const { get, post } = useApi<PromptResponse>();
  const [prompt, setPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPrompt = async () => {
    const response = await get("prompts/exercises");
    if (response?.prompt) {
      setPrompt(response.prompt);
    }
  };

  const savePrompt = async () => {
    setIsSaving(true);
    await post("prompts/exercises", { prompt });
    setIsSaving(false);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchPrompt();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={onBack} iconColor="#fff" />
        <Appbar.Content title="Settings" titleStyle={styles.appBarTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader style={styles.subheader}>
            Exercise Prompt
          </List.Subheader>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={15}
                value={prompt}
                onChangeText={setPrompt}
                editable={isEditing}
                style={styles.textInput}
                outlineColor="#333"
                activeOutlineColor="#6A5ACD"
                textColor="#fff"
                placeholderTextColor="#888"
              />
              <View style={styles.buttonContainer}>
                {!isEditing ? (
                  <Button
                    mode="contained"
                    onPress={() => setIsEditing(true)}
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
                        setIsEditing(false);
                        fetchPrompt();
                      }}
                      style={styles.button}
                      textColor="#fff"
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      onPress={savePrompt}
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
            </Card.Content>
          </Card>
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
  },
  listItem: {
    backgroundColor: "#000",
  },
  listTitle: {
    color: "#fff",
    fontSize: 16,
  },
  listDescription: {
    color: "#888",
    fontSize: 14,
  },
  divider: {
    backgroundColor: "#222",
  },
  sectionDivider: {
    backgroundColor: "#333",
    height: 8,
  },
  card: {
    backgroundColor: "#111",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  textInput: {
    backgroundColor: "#000",
    minHeight: 300,
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

export default SettingsScreen;
