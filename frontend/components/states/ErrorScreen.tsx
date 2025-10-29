import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { theme } from "../../styles/theme";

interface ErrorScreenProps {
}

export default function ErrorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection Error</Text>
      <Text style={styles.message}>Please Try Again Later</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});
