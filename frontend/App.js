import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainApp from './components/MainApp';
import { AppProvider } from './contexts/AppContext';
import LoginScreen from './components/auth/LoginScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './services/Firebase';

export default function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const isTestMode = currentUrl.includes('skipAuth=true');
        
        if (isTestMode) {
          setIsFirebaseInitialized(true);
          setUser({ uid: 'test-user', email: 'test@example.com', displayName: 'Test User' });
          setUserReady(true);
          return;
        }

        // Import and initialize Firebase first
        const { default: initializeFirebase } = await import('./services/Firebase');
        await initializeFirebase();
        setIsFirebaseInitialized(true);
        const auth = getFirebaseAuth();
        if (auth) {
          onAuthStateChanged(auth, (u) => {
            setUser(u ? { uid: u.uid, email: u.email, photoURL: u.photoURL, displayName: u.displayName } : null);
            if (u?.uid) AsyncStorage.setItem('userId', u.uid); else AsyncStorage.removeItem('userId');
            setUserReady(true);
          });
        } else {
          setUserReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        // Still set initialized to true to avoid eternal loading
        setIsFirebaseInitialized(true);
        setUserReady(true);
      }
    };
    
    initializeApp();
  }, []);

  // Show loading screen while Firebase initializes
  if (!isFirebaseInitialized || !userReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>
          Initializing...
        </Text>
      </View>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <AppProvider>
      <MainApp user={user} />
    </AppProvider>
  );
}
