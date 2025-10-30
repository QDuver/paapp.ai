import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { theme } from "../../styles/theme";

interface EmptyStateProps {
  onObjectivesPress: () => void;
  onGeneratePress: () => void;
  sectionColor: string;
}

export default function EmptyState({ onObjectivesPress, onGeneratePress, sectionColor }: EmptyStateProps) {

    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/logo-sad.png")}
          style={[styles.logo, { tintColor: sectionColor }]}
          resizeMode="contain"
        />
        <Text style={[styles.titleText, { color: theme.colors.text }]}>
          You don't have any items yet
        </Text>
        <Text style={[styles.subText, { color: theme.colors.textMuted }]}>
          Write your objectives here and generate your first program
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onObjectivesPress}
            style={[styles.button, { borderColor: sectionColor }]}
            labelStyle={[styles.buttonLabel, { color: sectionColor }]}
            contentStyle={styles.buttonContent}
            icon="text-box-edit-outline"
          >
            Objectives
          </Button>
          <Button
            mode="contained"
            onPress={onGeneratePress}
            style={[styles.button, { backgroundColor: sectionColor }]}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
            icon="auto-fix"
          >
            Generate
          </Button>
        </View>
      </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xxl,
  },
  logo: {
    width: 120,
    height: 80,
    marginBottom: theme.spacing.xl,
    opacity: 0.6,
  },
  titleText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  subText: {
    fontSize: theme.typography.sizes.md,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  defaultText: {
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  button: {
    minWidth: 140,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
});
