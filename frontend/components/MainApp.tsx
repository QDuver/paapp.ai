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
import { Provider as PaperProvider, FAB, Appbar, Drawer } from 'react-native-paper';
import CardList from './card/CardList';
import UserAvatar from './auth/UserAvatar';
import EditDialog from './card/EditDialog';
import SideDrawer from './SideDrawer';
import { useAppContext } from '../contexts/AppContext';

interface MainAppProps { user: any }

const MainApp = ({ user }: MainAppProps) => {
  const { data, currentDate, isLoading, showEditDialog } = useAppContext();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAuthChecking(false);
      setIsLoggedIn(process.env.NODE_ENV === 'test');
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

  // Main app interface
  const tabs: Array<{ id: number; name: string; key: string }> = [
    { id: 0, name: 'Routines', key: 'routines' },
    { id: 1, name: 'Exercises', key: 'exercises' },
    { id: 2, name: 'Meals', key: 'meals' }
  ];

  const currentTab = tabs[selectedTab];
  const cardList = data?.[currentTab.key];

  const createChild = () => {
    if (!cardList) return;
    
    // Create new item and show dialog
    const newItem = cardList.createChild();
    showEditDialog(newItem, cardList, cardList, true);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
        {/* Side Drawer Overlay */}
        <Modal
          visible={drawerVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setDrawerVisible(false)}
        >
          <View style={styles.drawerOverlay}>
            <View style={styles.drawerContent}>
              <SideDrawer
                visible={drawerVisible}
                onDismiss={() => setDrawerVisible(false)}
                selectedTab={selectedTab}
                onTabSelect={setSelectedTab}
                currentDate={currentDate}
                tabs={tabs}
              />
            </View>
            <TouchableOpacity
              style={styles.drawerBackdrop}
              onPress={() => setDrawerVisible(false)}
            />
          </View>
        </Modal>
        
        {/* Simplified Header */}
        <Appbar.Header style={styles.appBar}>
          <Appbar.Action 
            icon="menu" 
            onPress={() => setDrawerVisible(true)}
            iconColor="#fff"
          />
          <Appbar.Content 
            title="Routine Assistant" 
            titleStyle={styles.appBarTitle}
          />
          <UserAvatar user={user} />
        </Appbar.Header>

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
          </View>
        )}
      </ScrollView>

      <EditDialog />
      
      <FAB
        style={styles.aiFab}
        icon="auto-fix"
        onPress={() => {
          if (cardList) {
            showEditDialog(cardList, cardList, cardList, true);
          }
        }}
        testID="ai-fab"
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={createChild}
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
  // New styles for the simplified header
  appBar: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    elevation: 0,
  },
  appBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Drawer styles
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    width: 280,
    backgroundColor: '#000',
    borderRightWidth: 1,
    borderRightColor: '#333',
    height: '100%',
  },
  drawerBackdrop: {
    flex: 1,
  },
  // Content and loading styles
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
  // Auth styles
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
  // FAB
  aiFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 70,
    zIndex: 9999,
    elevation: 16,
    backgroundColor: '#6A5ACD', // SlateBlue - complements the #007AFF theme
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
