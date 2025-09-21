import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { List, Divider } from 'react-native-paper';

interface SideDrawerProps {
  visible: boolean;
  onDismiss: () => void;
  selectedTab: number;
  onTabSelect: (tabId: number) => void;
  currentDate: string;
  tabs: Array<{ id: number; name: string; key: string }>;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  visible,
  onDismiss,
  selectedTab,
  onTabSelect,
  currentDate,
  tabs,
}) => {
  return (
    <View style={styles.container}>
      {/* Date Section */}
      <View style={styles.dateSection}>
        <Text style={styles.dateLabel}>Current Date</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      
      <Divider style={styles.divider} />
      
      {/* Navigation Tabs */}
      <View style={styles.tabsSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {tabs.map((tab) => (
          <List.Item
            key={tab.id}
            title={tab.name}
            onPress={() => {
              onTabSelect(tab.id);
              onDismiss();
            }}
            style={[
              styles.tabItem,
              selectedTab === tab.id && styles.activeTabItem
            ]}
            titleStyle={[
              styles.tabText,
              selectedTab === tab.id && styles.activeTabText
            ]}
            left={(props) => (
              <List.Icon 
                {...props} 
                icon={getTabIcon(tab.key)} 
                color={selectedTab === tab.id ? '#fff' : '#ccc'}
              />
            )}
          />
        ))}
      </View>
    </View>
  );
};

const getTabIcon = (key: string): string => {
  switch (key) {
    case 'routines':
      return 'clock-outline';
    case 'exercises':
      return 'dumbbell';
    case 'meals':
      return 'food-apple-outline';
    default:
      return 'circle-outline';
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    paddingTop: 16,
  },
  dateSection: {
    padding: 16,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  divider: {
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  tabsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: '#333',
  },
  tabText: {
    color: '#ccc',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SideDrawer;