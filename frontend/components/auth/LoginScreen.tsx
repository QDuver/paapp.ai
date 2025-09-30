import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth } from '../../services/Firebase';

// Web: use signInWithPopup. For native, placeholder until expo-auth-session / play-services added.
export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGooglePress = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Auth not initialized');
      if (Platform.OS === 'web') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        // Native path not yet implemented
        setError('Native Google sign-in not implemented yet');
      }
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: '600', marginBottom: 32 }}>Routine Assistant</Text>
      
      <TouchableOpacity
        disabled={loading}
        onPress={onGooglePress}
        style={{ backgroundColor: '#4285F4', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 6, width: 240 }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '500' }}>Sign in with Google</Text>
        )}
      </TouchableOpacity>
      {error && <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text>}
    </View>
  );
}
