import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import MainApp from './components/MainApp';
import { AppProvider } from './contexts/AppContext';

export default function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Import and initialize Firebase first
        const { default: initializeFirebase } = await import('./services/Firebase');
        await initializeFirebase();
        setIsFirebaseInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        // Still set initialized to true to avoid eternal loading
        setIsFirebaseInitialized(true);
      }
    };
    
    initializeApp();
  }, []);

  // Show loading screen while Firebase initializes
  if (!isFirebaseInitialized) {
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

  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
