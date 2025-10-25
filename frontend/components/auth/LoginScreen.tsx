import React, { useCallback, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from "firebase/auth";
import { getFirebaseAuth } from "../../services/Firebase";
import { theme } from "../../styles/theme";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { getOAuthClientIds } from "../../config/firebase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const oauthClientIds = getOAuthClientIds();
  const [request, response, promptAsync] = Google.useAuthRequest({
    ...oauthClientIds,
  });

  useEffect(() => {
    if (request?.redirectUri) {
      console.log("OAuth Redirect URI:", request.redirectUri);
    }
  }, [request]);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const auth = getFirebaseAuth();
      if (auth && id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential).catch((e: any) => {
          setError(e?.message || "Login failed");
          setLoading(false);
        });
      }
    } else if (response?.type === "error") {
      setError("Authentication failed");
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
        <Text style={styles.title}>Routine Assistant 3</Text>
        <Text style={styles.subtitle}>Organize your daily routines, exercises, and meals</Text>

        <TouchableOpacity disabled={loading} onPress={onGooglePress} style={[styles.button, loading && styles.buttonDisabled]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in with Google</Text>}
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}

        {Platform.OS !== "web" && request?.redirectUri && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugLabel}>Redirect URI for Google Console:</Text>
            <Text style={styles.debugText} selectable>{request.redirectUri}</Text>
          </View>
        )}
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
  debugContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: theme.borderRadius.sm,
    width: "100%",
  },
  debugLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.xs,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.weights.semibold,
  },
  debugText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xs,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});
