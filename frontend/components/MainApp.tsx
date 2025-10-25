import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { FAB, Appbar, BottomNavigation, Menu, Icon, MD3Colors, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardList from "./card/CardList";
import EditDialog from "./card/EditDialog";
import { getFirebaseAuth } from "../services/Firebase";
import { signOut } from "firebase/auth";
import { CardAbstract, FirestoreDocAbstract, IUIMetadata } from "../models/Abstracts";
import { useAppContext } from "../contexts/AppContext";
import { useDialogContext } from "../contexts/DialogContext";
import { theme, commonStyles } from "../styles/theme";
import { Routines } from "../models/Routines";
import { Exercises } from "../models/Exercises";
import { Meals } from "../models/Meals";


const MainApp = () => {
  const { data, isLoading } = useAppContext();
  const { showEditDialog } = useDialogContext();

  const [navigationIndex, setNavigationIndex] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSignOut = async () => {
      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
      }
    setMenuVisible(false);
  };

  const routes: (IUIMetadata & { color: string })[] = [Routines, Exercises, Meals].map(ModelClass => ({
    ...ModelClass.getUIMetadata(),
    color: theme.colors.sections[ModelClass.getUIMetadata().key as 'routines' | 'exercises' | 'meals']?.accent || theme.colors.accent,
  }));

  const renderScene = ({ route }: { route: { key: string } }) => {
    const cardList: FirestoreDocAbstract = data?.[route.key];
    const sectionColor = theme.colors.sections[route.key as 'routines' | 'exercises' | 'meals']?.accent || theme.colors.accent;
    const currentRoute = routes.find(r => r.key === route.key);

    const createCard = () => {
      if (!cardList) return;
      const newItem = cardList.createCard();
      showEditDialog(newItem, cardList, cardList, true);
    };

    return (
      <View style={styles.sceneContainer}>
        <ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={isLoading} tintColor={sectionColor} />}>
          {isLoading ? (
            <View style={styles.loadingContainer} testID="loading-container">
              <ActivityIndicator size="large" color={sectionColor} />
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
          <View style={styles.fabContainer}>
            <FAB 
              style={[styles.fabButton, { backgroundColor: sectionColor }]} 
              icon="plus" 
              color={theme.colors.secondary}
              customSize={56}
              onPress={createCard} 
              testID="add-fab" 
            />
          </View>
        )}
      </View>
    );
  };

  const currentRoute = routes[navigationIndex];

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
        <Appbar.Header style={styles.appBar}>
          <Appbar.Content title={currentRoute?.title} titleStyle={styles.appBarTitle} />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />
            }
          >
            {currentRoute?.settingsOptions?.map((option, index) => (
              <Menu.Item 
                key={index} 
                onPress={() => {
                  setMenuVisible(false);
                  option.onPress(cardList);
                }} 
                title={option.label} 
              />
            ))}
            {currentRoute?.settingsOptions && <Divider />}
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
              secondaryContainer: routes[navigationIndex].color,
              onSecondaryContainer: theme.colors.secondary,
              onSurfaceVariant: theme.colors.textMuted,
              onSurface: theme.colors.text,
            },
          }}
        />

        <StatusBar style="dark" />
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
  container: commonStyles.container,
  appBar: {
    ...commonStyles.appBar,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  appBarTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: -0.5,
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
    padding: theme.spacing.xxl,
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  bottomNavBar: {
    backgroundColor: theme.colors.secondary,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  fabContainer: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: 20,
    flexDirection: "column",
    gap: theme.spacing.sm,
    zIndex: 9999,
  },
  fabButton: {
    margin: 0,
    ...theme.shadows.fab,
  },
});

export default MainApp;
