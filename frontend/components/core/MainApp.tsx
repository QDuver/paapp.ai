import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Appbar, Drawer, FAB, IconButton, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../../contexts/AppContext";
import { FirestoreDocAbstract, SettingsAction } from "../../models/Abstracts";
import { getFirebaseAuth } from "../../services/Firebase";
import { commonStyles, theme } from "../../styles/theme";
import UserAvatar from "../auth/UserAvatar";
import CardList from "../cards/CardList";
import BuildWithAiDialog from "../dialogs/BuildWithAiDialog";
import EditItemDialog from "../dialogs/EditItemDialog";
import EditPromptDialog from "../dialogs/EditPromptDialog";
import EmptyState from "../states/EmptyState";

const MainApp = () => {
  const { data, isLoading, setIsLoading, setData, setRefreshCounter, sections, activeSection, setActiveSection, setEditDialogState, setEditableItem } = useAppContext();

  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [buildAiDialogVisible, setBuildAiDialogVisible] = useState(false);
  const [buildAiFirestoreDoc, setBuildAiFirestoreDoc] = useState<FirestoreDocAbstract | null>(null);

  const [editPromptDialogVisible, setEditPromptDialogVisible] = useState(false);
  const [editPromptCollection, setEditPromptCollection] = useState<string | null>(null);


  const firestoreDoc = data?.[activeSection.uiMetadata.key];
  const sectionColor = activeSection.uiMetadata.color;

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
    setMenuVisible(false);

    switch (action) {
      case "generate":
        console.log(`[FAB] Opening BuildWithAI dialog`);
        setBuildAiFirestoreDoc(firestoreDoc);
        setBuildAiDialogVisible(true);
        break;
      case "editPrompt":
        setEditPromptCollection(firestoreDoc.collection);
        setEditPromptDialogVisible(true);
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  const createCard = () => {
    const newCard = firestoreDoc.createCard();
    setEditableItem(newCard);
    setRefreshCounter(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Action icon="menu" onPress={() => setDrawerVisible(true)} />
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

      <View style={styles.mainContent}>
        <View style={styles.sceneContainer}>
          {isLoading ? (
            <View style={[styles.content, styles.loadingContainer]} testID="loading-container">
              <ActivityIndicator size="large" color={sectionColor} />
              <Text style={styles.loadingText} testID="loading-text">
                Building {activeSection.uiMetadata.key}...
              </Text>
            </View>
          ) : firestoreDoc?.items.length ? (
            <CardList
              firestoreDoc={firestoreDoc}
              refreshing={isLoading}
              sectionColor={sectionColor}
            />
          ) : (
            <EmptyState
              onObjectivesPress={() => {
                setEditPromptCollection(firestoreDoc.collection);
                setEditPromptDialogVisible(true);
              }}
              onGeneratePress={() => {
                setBuildAiFirestoreDoc(firestoreDoc);
                setBuildAiDialogVisible(true);
              }}
              sectionColor={sectionColor}
            />
          )}

          {!isLoading && (
            <>
              {activeSection.uiMetadata.settingsOptions && (
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
                    {activeSection.uiMetadata.settingsOptions.map((option, index) => (
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
              )}
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

      </View>

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

      <EditItemDialog />

      {drawerVisible && (
        <TouchableOpacity
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={() => setDrawerVisible(false)}
        />
      )}

      <Drawer.Section
        style={[styles.drawer, drawerVisible && styles.drawerVisible]}
      >
        {drawerVisible && (
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Navigation</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setDrawerVisible(false)}
              />
            </View>
            {sections.map((section) => (
              <Drawer.Item
                key={section.uiMetadata.key}
                label={section.uiMetadata.title}
                icon={activeSection === section ? section.uiMetadata.focusedIcon : section.uiMetadata.unfocusedIcon}
                active={activeSection === section}
                onPress={() => {
                  setActiveSection(section);
                  setDrawerVisible(false);
                }}
                style={[
                  styles.drawerItem,
                  activeSection === section && { backgroundColor: sectionColor + '20' }
                ]}
              />
            ))}
          </View>
        )}
      </Drawer.Section>
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
  mainContent: {
    flex: 1,
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
  settingsMenuContainer: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: 90,
    zIndex: 9999,
  },
  fabContainer: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: 20,
    zIndex: 9998,
  },
  fab: {
    margin: 0,
  },
  avatarContainer: {
    marginRight: theme.spacing.sm,
  },
  drawerBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: -280,
    bottom: 0,
    width: 280,
    backgroundColor: theme.colors.secondary,
    zIndex: 10000,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 16,
  },
  drawerVisible: {
    left: 0,
  },
  drawerContent: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  drawerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  drawerItem: {
    marginVertical: theme.spacing.xs,
  },
});

export default MainApp;
