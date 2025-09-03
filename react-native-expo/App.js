import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { useAppData } from './hooks/useAppData';
import initializeFirebase from './services/Firebase';
import { CardList } from './components/card';
import { DataConverter } from './utils/DataConverter';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isLoading, data, currentDate, loadAllData, buildItems, updateDocument, error } = useAppData();
  
  // Auth and navigation state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Convert API data to typed models
  const [typedData, setTypedData] = useState(null);

  // Initialize Firebase and check auth when app starts
  useEffect(() => {
    const initializeApp = async () => {
      await initializeFirebase();
      // Simulate auth check
      setTimeout(() => {
        setIsAuthChecking(false);
        setIsLoggedIn(true); // Simplified - assume logged in
      }, 2000);
    };
    
    initializeApp();
  }, []);

  // Convert API data to typed models when data changes
  useEffect(() => {
    if (data.routines || data.exercises || data.meals) {
      try {
        const converted = DataConverter.convertToTypedModels(data);
        setTypedData(converted);
      } catch (error) {
        console.error('Error converting data to typed models:', error);
      }
    } else {
      setTypedData(null);
    }
  }, [data]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
    flex: 1,
  };

  // Auth loading screen (migrated from Flutter AuthWrapper)
  if (isAuthChecking) {
    return (
      <SafeAreaView style={[backgroundStyle, styles.authLoadingContainer]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.authLoadingContent}>
          <Text style={styles.authLoadingIcon}>🏃‍♂️</Text>
          <Text style={[styles.authLoadingTitle, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
            Life Automation
          </Text>
          <ActivityIndicator 
            size="large" 
            color={isDarkMode ? '#ffffff' : '#000000'} 
            style={styles.authLoadingSpinner}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Login screen (simplified)
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.loginContainer}>
          <Text style={[styles.title, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
            Life Automation
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => setIsLoggedIn(true)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const tabs = [
    { label: 'Routines', icon: '🏃‍♂️', key: 'routines' },
    { label: 'Exercises', icon: '💪', key: 'exercises' },
    { label: 'Meals', icon: '🍽️', key: 'meals' }
  ];

  const renderTabContent = () => {
    const currentTab = tabs[selectedTab];
    
    // Show loading if data is not available
    if (!typedData) {
      if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDarkMode ? '#ffffff' : '#000000'} />
            <Text style={[styles.loadingText, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
              Loading {currentTab.label.toLowerCase()}...
            </Text>
          </View>
        );
      }
      
      // No data and not loading - show empty state
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
            No data available for {currentDate}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }]}
            onPress={loadAllData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const tabData = typedData[currentTab.key];

    return (
      <View style={styles.tabContentContainer}>
        {/* Collection metadata */}
        {tabData && (
          <View style={styles.metadataContainer}>
            {currentTab.key === 'routines' && tabData.wakeupTime && (
              <Text style={[styles.metadataText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
                ⏰ Wakeup: {tabData.wakeupTime}
              </Text>
            )}
            {currentTab.key === 'exercises' && (
              <View style={styles.metadataRow}>
                {tabData.atHome !== undefined && (
                  <Text style={[styles.metadataText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
                    🏠 {tabData.atHome ? 'At home' : 'At gym'}
                  </Text>
                )}
                {tabData.availableTimeMin && (
                  <Text style={[styles.metadataText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
                    ⏱️ {tabData.availableTimeMin} min
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
        
        <CardList 
          data={tabData} 
          collection={currentTab.key}
          onBuildItems={() => buildItems(currentTab.key)}
          onUpdateItem={(item) => updateDocument(currentTab.key, item)}
          isLoading={isLoading}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* App Bar with settings button */}
      <View style={styles.appBar}>
        <Text style={[styles.appBarTitle, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
          Life Automation
        </Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Text style={[styles.settingsButtonText, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
            ⚙️
          </Text>
        </TouchableOpacity>
      </View>

      {/* Linear progress indicator */}
      {isLoading && (
        <View style={styles.progressBar}>
          <ActivityIndicator size="small" color={isDarkMode ? '#ffffff' : '#000000'} />
        </View>
      )}

      {/* Main content */}
      <View style={styles.mainContent}>
        <Text style={[styles.dateText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
          📅 {currentDate}
        </Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, {color: isDarkMode ? '#FF6B6B' : '#D32F2F'}]}>
              ⚠️ {error}
            </Text>
          </View>
        )}
        
        {renderTabContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              selectedTab === index && styles.selectedTabButton
            ]}
            onPress={() => setSelectedTab(index)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              {color: selectedTab === index ? '#6200ee' : '#757575'}
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Modal (Drawer equivalent) */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSettings(false)}
      >
        <SafeAreaView style={backgroundStyle}>
          <View style={styles.settingsHeader}>
            <Text style={[styles.settingsTitle, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
              Settings
            </Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={[styles.closeButton, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingsContent}>
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={() => {
                setIsLoggedIn(false);
                setShowSettings(false);
              }}
            >
              <Text style={[styles.settingsItemText, {color: isDarkMode ? '#ffffff' : '#000000'}]}>
                🚪 Logout
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Auth loading styles
  authLoadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  authLoadingContent: {
    alignItems: 'center',
  },
  authLoadingIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  authLoadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  authLoadingSpinner: {
    marginTop: 24,
  },
  
  // Login styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // App Bar styles
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.3)',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 5,
  },
  settingsButtonText: {
    fontSize: 24,
  },

  // Progress bar
  progressBar: {
    paddingVertical: 5,
    alignItems: 'center',
  },

  // Main content
  mainContent: {
    flex: 1,
    paddingTop: 10,
  },
  tabContentContainer: {
    flex: 1,
  },
  metadataContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  metadataRow: {
    flexDirection: 'row',
    gap: 15,
  },
  metadataText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Tab content
  tabContent: {
    width: '100%',
    alignItems: 'center',
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // Cards
  card: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    width: '100%',
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  // Error handling
  errorContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  selectedTabButton: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Settings Modal
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.3)',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    padding: 5,
  },
  settingsContent: {
    flex: 1,
    padding: 20,
  },
  settingsItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  settingsItemText: {
    fontSize: 16,
  },

  // Legacy styles (kept for compatibility)
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
});
