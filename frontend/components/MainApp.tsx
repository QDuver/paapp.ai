import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { Provider as PaperProvider, FAB, Appbar, BottomNavigation, Menu } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardList from "./card/CardList";
import UserAvatar from "./auth/UserAvatar";
import EditDialog from "./card/EditDialog";
import { useAppContext } from "../contexts/AppContext";
import { getFirebaseAuth } from "../services/Firebase";
import { signOut } from "firebase/auth";
import Settings from "./Settings";
import { CardAbstract, FirestoreDocAbstract } from "../models/Abstracts";

interface MainAppProps {
  user: any;
}

const MainApp = ({ user }: MainAppProps) => {
  const { data, currentDate, isLoading, showEditDialog } = useAppContext();

  const [navigationIndex, setNavigationIndex] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load persisted view state on mount
  useEffect(() => {
    const loadViewState = async () => {
      const savedView = await AsyncStorage.getItem("@current_view");
      if (savedView === "settings") {
        setShowSettings(true);
      }
    };
    loadViewState();
  }, []);

  // Persist view state when it changes
  useEffect(() => {
    const saveViewState = async () => {
      await AsyncStorage.setItem("@current_view", showSettings ? "settings" : "main");
    };
    saveViewState();
  }, [showSettings]);

  const handleSignOut = async () => {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
    setMenuVisible(false);
  };

  const handleSettings = () => {
    setShowSettings(true);
    setMenuVisible(false);
  };

  // Define navigation routes
  const routes = [
    {
      key: "routines",
      title: "Routines",
      focusedIcon: "clock",
      unfocusedIcon: "clock-outline",
    },
    {
      key: "exercises",
      title: "Exercises",
      focusedIcon: "dumbbell",
      unfocusedIcon: "dumbbell",
    },
    {
      key: "meals",
      title: "Meals",
      focusedIcon: "food-apple",
      unfocusedIcon: "food-apple-outline",
    },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    const cardList: FirestoreDocAbstract = data?.[route.key];

    const createCard = () => {
      if (!cardList) return;
      const newItem = cardList.createCard();
      showEditDialog(newItem, cardList, cardList, true);
    };

    return (
      <View style={styles.sceneContainer}>
        <ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={isLoading} tintColor="#fff" />}>
          {isLoading ? (
            <View style={styles.loadingContainer} testID="loading-container">
              <ActivityIndicator size="large" color="#6A5ACD" />
              <Text style={styles.loadingText} testID="loading-text">
                Loading {route.key}...
              </Text>
            </View>
          ) : cardList ? (
            <CardList cardList={cardList} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: "#ccc" }]}>
                No {route.key} found for {currentDate}
              </Text>
            </View>
          )}
        </ScrollView>

        <EditDialog />

        {!isLoading && (
          <>
            {route.key !== "routines" && (
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
            )}

            <FAB style={styles.fab} icon="plus" onPress={createCard} testID="add-fab" />
          </>
        )}
      </View>
    );
  };

  if (showSettings) {
    return (
      <PaperProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: "#000" }]}>
          <Settings onBack={() => setShowSettings(false)} />
          <StatusBar style="light" />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: "#000" }]}>
        {/* Header */}
        <Appbar.Header style={styles.appBar}>
          <Appbar.Content
            title="Routine Assistant"
            subtitle={currentDate}
            titleStyle={styles.appBarTitle}
            subtitleStyle={styles.appBarSubtitle}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <View style={{ marginRight: 8 }}>
                <UserAvatar user={user} onPress={() => setMenuVisible(true)} />
              </View>
            }
          >
            <Menu.Item onPress={handleSettings} title="Settings" leadingIcon="cog-outline" />
            <Menu.Item onPress={handleSignOut} title="Sign Out" leadingIcon="logout" />
          </Menu>
        </Appbar.Header>

        <BottomNavigation
          navigationState={{ index: navigationIndex, routes }}
          onIndexChange={setNavigationIndex}
          renderScene={renderScene}
          barStyle={styles.bottomNavBar}
          testID="bottom-navigation"
          theme={{
            colors: {
              secondaryContainer: "#333",
            },
          }}
        />

        <StatusBar style="light" />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    elevation: 0,
  },
  appBarTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  appBarSubtitle: {
    color: "#ccc",
    fontSize: 14,
  },
  sceneContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6A5ACD",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  bottomNavBar: {
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  aiFab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 70,
    zIndex: 9999,
    elevation: 16,
    backgroundColor: "#6A5ACD",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 16,
  },
});

export default MainApp;
