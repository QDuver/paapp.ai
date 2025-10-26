import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Appbar, BottomNavigation, Menu, Icon, MD3Colors, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardList from "./card/CardList";
import BuildWithAiDialog from "./dialogs/BuildWithAiDialog";
import EditItemDialog from "./dialogs/EditItemDialog";
import EditPromptDialog from "./dialogs/EditPromptDialog";
import { getFirebaseAuth } from "../services/Firebase";
import { signOut } from "firebase/auth";
import { CardAbstract, FirestoreDocAbstract, IUIMetadata, SettingsAction, DialogableAbstract } from "../models/Abstracts";
import { useAppContext } from "../contexts/AppContext";
import { theme, commonStyles } from "../styles/theme";
import { Routines } from "../models/Routines";
import { Exercises } from "../models/Exercises";
import { Meals } from "../models/Meals";

const MainApp = () => {
  const { data, isLoading, setIsLoading, setData, setRefreshCounter } = useAppContext();

  const [navigationIndex, setNavigationIndex] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);

  const [buildAiDialogVisible, setBuildAiDialogVisible] = useState(false);
  const [buildAiFirestoreDoc, setBuildAiFirestoreDoc] = useState<FirestoreDocAbstract | null>(null);

  const [editPromptDialogVisible, setEditPromptDialogVisible] = useState(false);
  const [editPromptCollection, setEditPromptCollection] = useState<string | null>(null);

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editDialogItem, setEditDialogItem] = useState<DialogableAbstract | null>(null);
  const [editDialogParent, setEditDialogParent] = useState<FirestoreDocAbstract | CardAbstract | null>(null);
  const [editDialogFirestoreDoc, setEditDialogFirestoreDoc] = useState<FirestoreDocAbstract | null>(null);
  const [editDialogIsNew, setEditDialogIsNew] = useState(false);

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      await signOut(auth);
    }
    setMenuVisible(false);
  };

  const handleSettingsAction = (action: SettingsAction, firestoreDoc: FirestoreDocAbstract) => {
    setMenuVisible(false);

    switch (action) {
      case "generate":
        setBuildAiFirestoreDoc(firestoreDoc);
        setBuildAiDialogVisible(true);
        break;
      case "editPrompt":
        setEditPromptCollection(firestoreDoc.collection);
        setEditPromptDialogVisible(true);
        break;
      case "duplicate":
        console.log(`Duplicating ${firestoreDoc.collection}...`);
        break;
      case "delete":
        console.log(`Deleting ${firestoreDoc.collection}...`);
        break;
      case "configure":
        console.log(`Configuring ${firestoreDoc.collection}...`);
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  const showEditDialog = (
    item: DialogableAbstract,
    parent: FirestoreDocAbstract | CardAbstract,
    firestoreDoc: FirestoreDocAbstract,
    isNew: boolean
  ) => {
    setEditDialogItem(item);
    setEditDialogParent(parent);
    setEditDialogFirestoreDoc(firestoreDoc);
    setEditDialogIsNew(isNew);
    setEditDialogVisible(true);
  };

  const routes: (IUIMetadata & { color: string })[] = [Routines, Exercises, Meals].map(ModelClass => ({
    ...ModelClass.getUIMetadata(),
    color: theme.colors.sections[ModelClass.getUIMetadata().key as "routines" | "exercises" | "meals"]?.accent || theme.colors.accent,
  }));

  const renderScene = ({ route }: { route: { key: string } }) => {
    const firestoreDoc: FirestoreDocAbstract = data?.[route.key];
    const sectionColor = theme.colors.sections[route.key as "routines" | "exercises" | "meals"]?.accent || theme.colors.accent;
    const currentRoute = routes.find(r => r.key === route.key);

    const createCard = () => {
      if (!firestoreDoc) return;
      const newItem = firestoreDoc.createCard();
      showEditDialog(newItem, firestoreDoc, firestoreDoc, true);
    };

    return (
      <View style={styles.sceneContainer}>
        {isLoading ? (
          <View style={[styles.content, styles.loadingContainer]} testID="loading-container">
            <ActivityIndicator size="large" color={sectionColor} />
            <Text style={styles.loadingText} testID="loading-text">
              Loading {route.key}...
            </Text>
          </View>
        ) : firestoreDoc ? (
          <CardList
            firestoreDoc={firestoreDoc}
            showEditDialog={showEditDialog}
            refreshing={isLoading}
            sectionColor={sectionColor}
          />
        ) : (
          <View style={[styles.content, styles.emptyContainer]}>
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No {route.key} found</Text>
          </View>
        )}

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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Header */}
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title={currentRoute?.title} titleStyle={styles.appBarTitle} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
        >
          {currentRoute?.settingsOptions?.map((option, index) => (
            <Menu.Item
              key={index}
              onPress={() => handleSettingsAction(option.action, data[currentRoute.key])}
              title={option.label}
              leadingIcon={option.icon}
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

      <BuildWithAiDialog
        visible={buildAiDialogVisible}
        firestoreDoc={buildAiFirestoreDoc}
        setIsLoading={setIsLoading}
        setData={setData}
        onClose={() => setBuildAiDialogVisible(false)}
      />

      <EditPromptDialog
        visible={editPromptDialogVisible}
        collection={editPromptCollection}
        onClose={() => setEditPromptDialogVisible(false)}
      />

      <EditItemDialog
        visible={editDialogVisible}
        item={editDialogItem}
        parent={editDialogParent}
        firestoreDoc={editDialogFirestoreDoc}
        isNew={editDialogIsNew}
        onClose={() => setEditDialogVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: commonStyles.container,
  appBar: {
    ...commonStyles.appBar,
    shadowColor: "#000",
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
    shadowColor: "#000",
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
