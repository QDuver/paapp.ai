import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { Provider as PaperProvider, FAB, Appbar, BottomNavigation, Menu } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardList from "./card/CardList";
import UserAvatar from "./auth/UserAvatar";
import EditDialog from "./card/EditDialog";
import { getFirebaseAuth } from "../services/Firebase";
import { signOut } from "firebase/auth";
import { CardAbstract, FirestoreDocAbstract } from "../models/Abstracts";
import { SettingsPage } from "./SettingsPage";
import { useAppContext } from "../contexts/AppContext";
import { useDialogContext } from "../contexts/DialogContext";
import { theme, commonStyles } from "../styles/theme";

interface MainAppProps {
  user: any;
}

const MainApp = ({ user }: MainAppProps) => {
  const { data, isLoading } = useAppContext();
  const { showEditDialog } = useDialogContext();

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
        <ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={isLoading} tintColor={theme.colors.accent} />}>
          {isLoading ? (
            <View style={styles.loadingContainer} testID="loading-container">
              <ActivityIndicator size="large" color={theme.colors.accent} />
              <Text style={styles.loadingText} testID="loading-text">
                Loading {route.key}...
              </Text>
            </View>
          ) : cardList ? (
            <CardList cardList={cardList} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No {route.key} found</Text>
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
        <SafeAreaView style={styles.container}>
          <SettingsPage onBack={() => setShowSettings(false)} />
          <StatusBar style="dark" />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Appbar.Header style={styles.appBar}>
          <Appbar.Content title="Routine Assistant" titleStyle={styles.appBarTitle} />
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
              secondaryContainer: theme.colors.tertiary,
            },
          }}
        />

        <StatusBar style="dark" />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: commonStyles.container,
  appBar: commonStyles.appBar,
  appBarTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
  },
  appBarSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
  },
  sceneContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.accent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  bottomNavBar: {
    backgroundColor: theme.colors.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  aiFab: {
    position: "absolute",
    margin: theme.spacing.lg,
    right: 0,
    bottom: 70,
    zIndex: 9999,
    elevation: 16,
    backgroundColor: theme.colors.accent,
  },
  fab: {
    position: "absolute",
    margin: theme.spacing.lg,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 16,
  },
});

export default MainApp;
