import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { List, Divider } from "react-native-paper";

interface SideDrawerProps {
  visible: boolean;
  onDismiss: () => void;
  currentDate: string;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  visible,
  onDismiss,
  currentDate,
}) => {
  return (
    <View style={styles.container}>
      {/* Date Section */}
      <View style={styles.dateSection}>
        <Text style={styles.dateLabel}>Current Date</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Settings Section - Placeholder for future features */}
      <View style={styles.tabsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <List.Item
          title="Preferences"
          style={styles.tabItem}
          titleStyle={styles.tabText}
          left={props => (
            <List.Icon {...props} icon="cog-outline" color="#ccc" />
          )}
          onPress={() => {
            // TODO: Add preferences functionality
            onDismiss();
          }}
        />
        <List.Item
          title="Profile"
          style={styles.tabItem}
          titleStyle={styles.tabText}
          left={props => (
            <List.Icon {...props} icon="account-outline" color="#ccc" />
          )}
          onPress={() => {
            // TODO: Add profile functionality
            onDismiss();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    paddingTop: 16,
  },
  dateSection: {
    padding: 16,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  divider: {
    backgroundColor: "#333",
    marginHorizontal: 16,
  },
  tabsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: "#333",
  },
  tabText: {
    color: "#ccc",
    fontSize: 16,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default SideDrawer;
