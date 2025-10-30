import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Appbar, BottomNavigation, FAB, IconButton, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../../contexts/AppContext";
import { CardAbstract, DialogableAbstract, FirestoreDocAbstract, IUIMetadata, SectionKey, SettingsAction } from "../../models/Abstracts";
import { Exercises } from "../../models/Exercises";
import { Groceries } from "../../models/Groceries";
import { Meals } from "../../models/Meals";
import { Routines } from "../../models/Routines";
import { getFirebaseAuth } from "../../services/Firebase";
import { commonStyles, theme } from "../../styles/theme";
import UserAvatar from "../auth/UserAvatar";
import CardList from "../cards/CardList";
import BuildWithAiDialog from "../dialogs/BuildWithAiDialog";
import EditItemDialog from "../dialogs/EditItemDialog";
import EditPromptDialog from "../dialogs/EditPromptDialog";
import EmptyState from "../states/EmptyState";

const MainApp = () => {
  const { data, isLoading, setIsLoading, setData, setRefreshCounter } = useAppContext();

  const [navigationIndex, setNavigationIndex] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [autoFocusItemId, setAutoFocusItemId] = useState<string | null>(null);

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

  const handleUserSettings = () => {
    console.log("User settings clicked");
    setMenuVisible(false);
  };

  const handleSettingsAction = (action: SettingsAction, firestoreDoc: FirestoreDocAbstract) => {
    console.log(`[FAB] handleSettingsAction called with action: ${action}, collection: ${firestoreDoc.collection}`);
    setMenuVisible(false);

    switch (action) {
      case "generate":
        console.log(`[FAB] Opening BuildWithAI dialog`);
        setBuildAiFirestoreDoc(firestoreDoc);
        setBuildAiDialogVisible(true);
        break;
      case "editPrompt":
        console.log(`[FAB] Opening EditPrompt dialog`);
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

  const routes: (IUIMetadata & { color: string })[] = [Routines, Exercises, Meals, Groceries].map(ModelClass => ({
    ...ModelClass.getUIMetadata(),
    color: theme.colors.sections[ModelClass.getUIMetadata().key]?.accent || theme.colors.accent,
  }));

  const renderScene = ({ route }: { route: { key: string } }) => {
    const firestoreDoc: FirestoreDocAbstract = data?.[route.key];
    const sectionColor = theme.colors.sections[route.key as SectionKey]?.accent || theme.colors.accent;
    const currentRoute = routes.find(r => r.key === route.key);

    const createCard = () => {
      if (!firestoreDoc) return;
      const newItem = firestoreDoc.createCard();
      const editableFields = newItem.getEditableFields();
      const canInlineEdit = editableFields.length === 1;

      if (canInlineEdit) {
        const itemId = `${Date.now()}`;
        (newItem as any).__tempId = itemId;
        newItem.onSave(firestoreDoc, {}, firestoreDoc, true, setRefreshCounter);
        setAutoFocusItemId(itemId);
        setTimeout(() => setAutoFocusItemId(null), 100);
      } else {
        showEditDialog(newItem, firestoreDoc, firestoreDoc, true);
      }
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
        ) : firestoreDoc.items.length ? (
          <CardList
            firestoreDoc={firestoreDoc}
            showEditDialog={showEditDialog}
            refreshing={isLoading}
            sectionColor={sectionColor}
            autoFocusItemId={autoFocusItemId}
          />
        ) : (
          <EmptyState />
        )}

        {!isLoading && (
          <>
            <View style={styles.settingsMenuContainer}>
              <Menu
                visible={settingsMenuVisible}
                onDismiss={() => setSettingsMenuVisible(false)}
                anchor={
                  <FAB
                    style={[styles.fab, { backgroundColor: sectionColor }]}
                    icon="cog"
                    color={theme.colors.secondary}
                    customSize={56}
                    onPress={() => setSettingsMenuVisible(true)}
                  />
                }
              >
                {currentRoute?.settingsOptions?.map((option, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => {
                      handleSettingsAction(option.action, firestoreDoc);
                      setSettingsMenuVisible(false);
                    }}
                    title={option.label}
                    leadingIcon={option.icon}
                  />
                ))}
              </Menu>
            </View>
            <View style={styles.fabContainer}>
              <FAB
                style={[styles.fab, { backgroundColor: sectionColor }]}
                icon="plus"
                color={theme.colors.secondary}
                customSize={56}
                onPress={createCard}
                testID="add-fab"
              />
            </View>
          </>
        )}
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Header */}
      <Appbar.Header style={styles.appBar}>
        <View style={styles.headerContent}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appBarTitle}>paapp.ai</Text>
        </View>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => setMenuVisible(true)}
            >
              <UserAvatar
                user={getFirebaseAuth()?.currentUser}
                size={36}
              />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={handleUserSettings} title="Settings" leadingIcon="cog" />
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
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  logo: {
    width: 42,
    height: 28,
    marginTop: 5,
  },
  appBarTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: -0.5,
    includeFontPadding: false,
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
  bottomNavBar: {
    backgroundColor: theme.colors.secondary,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  settingsMenuContainer: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: 106,
    zIndex: 9999,
  },
  fabContainer: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: 35,
    zIndex: 9998,
  },
  fab: {
    margin: 0,
  },
  avatarContainer: {
    marginRight: theme.spacing.sm,
  },
});

export default MainApp;
