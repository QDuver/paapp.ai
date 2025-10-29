import React, { useCallback, useState, useEffect } from "react";
import { TouchableOpacity, ActivityIndicator, Platform, StyleSheet, Text } from "react-native";
import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from "firebase/auth";
import { getFirebaseAuth } from "../../services/Firebase";
import { theme } from "../../styles/theme";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { getOAuthClientIds } from "../../config/firebase";

WebBrowser.maybeCompleteAuthSession();

interface GoogleSignInButtonProps {
  onError?: (error: string) => void;
}

export default function GoogleSignInButton({ onError }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

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
            onError?.(e?.message || "Login failed");
            setLoading(false);
          });
      } else {
        onError?.("Authentication failed: No tokens received");
        setLoading(false);
      }
    } else if (response?.type === "error") {
      onError?.(`Authentication failed: ${(response as any)?.error || "Unknown error"}`);
      setLoading(false);
    } else if (response?.type === "dismiss" || response?.type === "cancel") {
      setLoading(false);
    }
  }, [response, onError]);

  const onGooglePress = useCallback(async () => {
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
      onError?.(e?.message || "Login failed");
      setLoading(false);
    }
  }, [promptAsync, onError]);

  return (
    <TouchableOpacity
      disabled={loading}
      onPress={onGooglePress}
      style={[styles.button, loading && styles.buttonDisabled]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in with Google</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
