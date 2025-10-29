import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { BRANDING } from "../../constants/branding";
import ShimmerLogo from "../../assets/ShimmerLogo";
import GoogleSignInButton from "../auth/GoogleSignInButton";

interface LoginScreenProps {
  showButton?: boolean;
}

export default function LoginScreen({ showButton = true }: LoginScreenProps) {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleButtonPress = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ShimmerLogo loading={false} style={styles.logo} source={require("../../assets/logo.png")} />
        <Text style={styles.title}>{BRANDING.appName}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {BRANDING.tagline}
        </Text>

        <View style={[styles.buttonContainer, !showButton && styles.hidden]}>
          {showButton && (
            <View onTouchStart={handleButtonPress}>
              <GoogleSignInButton onError={handleError} />
            </View>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xxl,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.accent,
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: theme.spacing.xxxl,
    textAlign: "center",
    lineHeight: 22,
    width: "100%",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  hidden: {
    opacity: 0,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing.lg,
    textAlign: "center",
    fontSize: theme.typography.sizes.sm,
  },
});
