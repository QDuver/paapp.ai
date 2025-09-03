import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import CustomCard from './CustomCard';

const CardList = ({ data, collection, onBuildItems, onUpdateItem, isLoading }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const handleGenerateItems = async () => {
    if (onBuildItems) {
      await onBuildItems();
    }
  };

  const handleAddNewItem = () => {
    // TODO: Open dialog to add new item
    console.log('Add new item for collection:', collection);
  };

  const renderCard = ({ item, index }) => (
    <CustomCard 
      item={item} 
      collection={collection}
      index={index}
      onUpdate={onUpdateItem}
    />
  );

  if (!data || !data.items || data.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TouchableOpacity
          style={[
            styles.startDayButton,
            { backgroundColor: isDarkMode ? '#6200ee' : '#007AFF' }
          ]}
          onPress={handleGenerateItems}
          disabled={isLoading}
        >
          <Text style={styles.startDayIcon}>✨</Text>
          <Text style={[
            styles.startDayText,
            { color: isDarkMode ? '#ffffff' : '#ffffff' }
          ]}>
            {isLoading ? 'Generating...' : 'Start day'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.items}
        renderItem={renderCard}
        keyExtractor={(item, index) => `${collection}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      />
      
      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fab,
            styles.generateFab,
            { backgroundColor: isDarkMode ? '#6200ee' : '#007AFF' }
          ]}
          onPress={handleGenerateItems}
          disabled={isLoading}
        >
          <Text style={styles.fabIcon}>✨</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.fab,
            styles.addFab,
            { backgroundColor: isDarkMode ? '#03DAC6' : '#34C759' }
          ]}
          onPress={handleAddNewItem}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 100, // Space for FABs
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startDayButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  startDayIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  startDayText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'column',
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  generateFab: {
    marginBottom: 12,
  },
  addFab: {
    // No additional margin needed
  },
  fabIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default CardList;
