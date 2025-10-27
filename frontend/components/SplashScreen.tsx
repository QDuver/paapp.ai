import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { BRANDING } from "../constants/branding";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>{BRANDING.appName}</Text>
      <Text
        style={styles.tagline}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {BRANDING.tagline}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.accent,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 50,
    maxWidth: "90%",
  },
});
