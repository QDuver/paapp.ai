import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { theme } from "../../styles/theme";



export default function EmptyState() {

    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/logo-sad.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.titleText, { color: theme.colors.text }]}>
          You don't have any items yet
        </Text>
        <Text style={[styles.subText, { color: theme.colors.textMuted }]}>
          Write your objectives here and generate your first program
        </Text>
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
  },
  defaultText: {
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
});
