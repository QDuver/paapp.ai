import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { Provider as PaperProvider, FAB } from 'react-native-paper';
import CardList from './card/CardList';
import UserAvatar from './auth/UserAvatar';
import EditDialog from './card/EditDialog';
import { useAppContext } from '../contexts/AppContext';

interface MainAppProps { user: any }

const MainApp = ({ user }: MainAppProps) => {
  const { data, currentDate, isLoading, showEditDialog } = useAppContext();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setIsAuthChecking(false);
      setIsLoggedIn(true);
    }, 1000);
  }, []);

  // Loading screen during auth check
  if (isAuthChecking) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color='#fff' />
          <Text style={[styles.loadingText, { color: '#fff' }]}>
            Loading...
          </Text>
        </View>
        <StatusBar style='light' />
      </SafeAreaView>
    );
  }

  // Login screen (simplified)
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
        <View style={styles.loginContainer}>
          <Text style={[styles.title, { color: '#fff' }]}>
            Routine Assistant
          </Text>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => setIsLoggedIn(true)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style='light' />
      </SafeAreaView>
    );
  }

  // Main app interface
  const tabs: Array<{ id: number; name: string; key: string }> = [
    { id: 0, name: 'Routines', key: 'routines' },
    { id: 1, name: 'Exercises', key: 'exercises' },
    { id: 2, name: 'Meals', key: 'meals' }
  ];

console.log('data', data);

  const currentTab = tabs[selectedTab];
  const cardList = data?.[currentTab.key];

  const createNewItem = () => {
    if (!cardList) return;
    
    // Create new item and show dialog
    const newItem = cardList.createNewItem();
    showEditDialog(newItem, cardList, cardList, true);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: '#333' }]}>
          <Text style={[styles.title, { color: '#fff' }]}>Routine Assistant</Text>
          <UserAvatar user={user} />
        </View>

      {/* Date and Actions */}
      <View style={[styles.dateContainer, { borderBottomColor: '#333' }]}>
        <Text style={[styles.dateText, { color: '#fff' }]}>
          {currentDate}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#333' }]}
            // onPress={() => buildItems(currentTab.key)}
            disabled={isLoading}
          >
            <Text style={[styles.actionButtonText, { color: '#fff' }]}>
              Build {currentTab.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { borderBottomColor: '#333' }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            testID={`tab-${tab.name.toLowerCase()}`}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab,
              { backgroundColor: selectedTab === tab.id ? '#333' : 'transparent' }
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === tab.id ? '#fff' : '#ccc' }
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            // onRefresh={loadAllData}
            tintColor='#fff'
          />
        }
      >
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color='#fff' />
            <Text style={[styles.loadingText, { color: '#fff' }]}>
              Loading {currentTab.name.toLowerCase()}...
            </Text>
          </View>
        ) : cardList ? (
          <CardList
            cardList={cardList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: '#ccc' }]}>
              No {currentTab.name.toLowerCase()} found for {currentDate}
            </Text>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#333' }]}
              // onPress={() => buildItems(currentTab.key)}
            >
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                Build {currentTab.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <EditDialog />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={createNewItem}
        testID="add-exercise-fab"
      />
      
      <StatusBar style='light' />
    </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    // Active tab styling handled in component
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingItem: {
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 16,
  },
});

export default MainApp;
