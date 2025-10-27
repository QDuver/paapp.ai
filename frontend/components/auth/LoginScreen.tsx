import React, { useCallback, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from "firebase/auth";
import { getFirebaseAuth } from "../../services/Firebase";
import { theme } from "../../styles/theme";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType } from "expo-auth-session";
import { getOAuthClientIds } from "../../config/firebase";
import { BRANDING } from "../../constants/branding";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const oauthClientIds = getOAuthClientIds();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: oauthClientIds.webClientId,
    androidClientId: oauthClientIds.androidClientId,
    iosClientId: oauthClientIds.iosClientId,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const params = response.params as any;
      const auth = getFirebaseAuth();

      if (params.id_token) {
        const credential = GoogleAuthProvider.credential(params.id_token, params.access_token);
        signInWithCredential(auth, credential)
          .then(() => {
            setLoading(false);
          })
          .catch((e: any) => {
            setError(e?.message || "Login failed");
            setLoading(false);
          });
      } else {
        setError("Authentication failed: No tokens received");
        setLoading(false);
      }
    } else if (response?.type === "error") {
      setError(`Authentication failed: ${(response as any)?.error || "Unknown error"}`);
      setLoading(false);
    } else if (response?.type === "dismiss" || response?.type === "cancel") {
      setLoading(false);
    }
  }, [response]);

  const onGooglePress = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Auth not initialized");

      if (Platform.OS === "web") {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        await promptAsync();
      }
    } catch (e: any) {
      setError(e?.message || "Login failed");
      setLoading(false);
    }
  }, [promptAsync]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{BRANDING.appName}</Text>
        <Text style={styles.subtitle}>{BRANDING.tagline}</Text>

        <TouchableOpacity disabled={loading} onPress={onGooglePress} style={[styles.button, loading && styles.buttonDisabled]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in with Google</Text>}
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
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
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxxl,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    width: "100%",
    maxWidth: 280,
    ...theme.shadows.card,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing.lg,
    textAlign: "center",
    fontSize: theme.typography.sizes.sm,
  },
});
