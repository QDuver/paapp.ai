import React, { useCallback, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from "firebase/auth";
import { getFirebaseAuth } from "../../services/Firebase";
import { theme } from "../../styles/theme";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType } from "expo-auth-session";
import { getOAuthClientIds } from "../../config/firebase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const oauthClientIds = getOAuthClientIds();

  console.log("=== OAuth Configuration ===");
  console.log("Platform:", Platform.OS);
  console.log("Web Client ID:", oauthClientIds.webClientId);
  console.log("Android Client ID:", oauthClientIds.androidClientId);
  console.log("iOS Client ID:", oauthClientIds.iosClientId);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: oauthClientIds.webClientId,
    androidClientId: oauthClientIds.androidClientId,
    iosClientId: oauthClientIds.iosClientId,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (request) {
      console.log("=== OAuth Request Object ===");
      console.log("Request URL:", request.url);
      console.log("Request Redirect URI:", request.redirectUri);
      console.log("Request Client ID:", request.clientId);
      console.log("Request Response Type:", request.responseType);
      console.log("Request Code Challenge:", request.codeChallenge);
      console.log("\nFull Request:", JSON.stringify(request, null, 2));
    }
  }, [request]);

  useEffect(() => {
    console.log("=== OAuth Response ===");
    console.log("Response Type:", response?.type);
    console.log("Full Response:", JSON.stringify(response, null, 2));

    if (response?.type === "success") {
      console.log("✅ OAuth Success!");

      const params = response.params as any;
      console.log("Response params:", Object.keys(params));
      console.log("ID Token:", params.id_token ? "Present" : "Missing");
      console.log("Access Token:", params.access_token ? "Present" : "Missing");
      console.log("Auth Code:", params.code ? "Present" : "Missing");

      const auth = getFirebaseAuth();

      if (params.id_token) {
        const credential = GoogleAuthProvider.credential(params.id_token, params.access_token);
        signInWithCredential(auth, credential)
          .then(() => {
            console.log("✅ Firebase sign-in successful");
            setLoading(false);
          })
          .catch((e: any) => {
            console.error("❌ Firebase sign-in error:", e);
            setError(e?.message || "Login failed");
            setLoading(false);
          });
      } else {
        console.error("❌ No tokens in response");
        setError("Authentication failed: No tokens received");
        setLoading(false);
      }
    } else if (response?.type === "error") {
      console.error("❌ OAuth Error Response:", response);
      console.error("Error Code:", (response as any)?.error);
      console.error("Error Params:", (response as any)?.params);
      setError(`Authentication failed: ${(response as any)?.error || "Unknown error"}`);
      setLoading(false);
    } else if (response?.type === "dismiss" || response?.type === "cancel") {
      console.log("ℹ️ OAuth dismissed/cancelled");
      setLoading(false);
    }
  }, [response]);

  const onGooglePress = useCallback(async () => {
    console.log("=== Google Sign-In Button Pressed ===");
    setError(null);
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Auth not initialized");

      if (Platform.OS === "web") {
        console.log("Using web popup flow");
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        console.log("Using native mobile flow");
        console.log("Calling promptAsync");
        const result = await promptAsync();
        console.log("promptAsync result:", JSON.stringify(result, null, 2));
      }
    } catch (e: any) {
      console.error("❌ Google Sign-In Error:", e);
      console.error("Error details:", JSON.stringify(e, null, 2));
      setError(e?.message || "Login failed");
      setLoading(false);
    }
  }, [promptAsync]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Routine Assistant 4</Text>
        <Text style={styles.subtitle}>Organize your daily routines, exercises, and meals</Text>

        <TouchableOpacity disabled={loading} onPress={onGooglePress} style={[styles.button, loading && styles.buttonDisabled]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in with Google</Text>}
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}

        {Platform.OS !== "web" && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugLabel}>Debug Info:</Text>
            <Text style={styles.debugText} selectable>
              Platform: {Platform.OS}
            </Text>
            <Text style={styles.debugText} selectable>
              Redirect URI: {request?.redirectUri || "Loading..."}
            </Text>
            <Text style={styles.debugText} selectable>
              Client ID: {request?.clientId || "Loading..."}
            </Text>
            <Text style={styles.debugText} selectable>
              Response Type: {request?.responseType || "Loading..."}
            </Text>
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
