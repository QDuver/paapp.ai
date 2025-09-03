import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

const SubCard = ({ subItem, parentItem, collection, index, onUpdate }) => {
  const isDarkMode = useColorScheme() === 'dark';

  // Adapt to real data structure
  const subCardData = {
    title: subItem.name || subItem.title || `Set ${index + 1}`,
    description: subItem.description || subItem.notes || '',
    // Collection-specific fields
    weightKg: subItem.weightKg,
    repetitions: subItem.repetitions,
    duration: subItem.duration,
    rest: subItem.rest,
    quantity: subItem.quantity,
    calories: subItem.calories,
    ...subItem
  };

  const handleSubCardPress = () => {
    // TODO: Open edit dialog for subcard
    console.log('Edit sub-card:', subCardData.title);
  };

  const handleDelete = () => {
    // TODO: Show delete confirmation dialog
    console.log('Delete sub-card:', subCardData.title);
    // For future: could use onUpdate to remove this sub-item from parent
    // if (onUpdate) {
    //   const updatedParent = {
    //     ...parentItem,
    //     items: parentItem.items.filter((_, i) => i !== index)
    //   };
    //   onUpdate(updatedParent);
    // }
  };

  const cardBackgroundColor = isDarkMode ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDarkMode ? '#AEAEB2' : '#6D6D70';

  return (
    <View style={styles.subCardContainer}>
      <View style={[
        styles.subCard,
        { backgroundColor: cardBackgroundColor }
      ]}>
        <TouchableOpacity
          style={styles.subCardContent}
          onPress={handleSubCardPress}
          activeOpacity={0.7}
        >
          <View style={styles.subCardHeader}>
            {/* SubCard Content */}
            <View style={styles.subCardTextContainer}>
              <Text style={[
                styles.subCardTitle,
                { color: textColor }
              ]}>
                {subCardData.title}
              </Text>
              
              {subCardData.description && (
                <Text style={[
                  styles.subCardDescription,
                  { color: secondaryTextColor }
                ]}>
                  {subCardData.description}
                </Text>
              )}

              {/* Collection-specific metadata */}
              {collection === 'exercises' && (
                <View style={styles.metadataContainer}>
                  {subCardData.weightKg && (
                    <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                      🏋️ {subCardData.weightKg}kg
                    </Text>
                  )}
                  {subCardData.repetitions && (
                    <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                      � {subCardData.repetitions} reps
                    </Text>
                  )}
                  {subCardData.rest && (
                    <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                      ⏳ {subCardData.rest}s rest
                    </Text>
                  )}
                </View>
              )}

              {collection === 'meals' && (
                <View style={styles.metadataContainer}>
                  {subCardData.quantity && (
                    <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                      📏 {subCardData.quantity}g
                    </Text>
                  )}
                  {subCardData.calories && (
                    <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                      🔥 {subCardData.calories} cal
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Delete button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={[styles.deleteIcon, { color: secondaryTextColor }]}>
                ×
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subCardContainer: {
    marginLeft: 32,
    marginRight: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  subCard: {
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    opacity: 0.9,
  },
  subCardContent: {
    padding: 12,
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subCardTextContainer: {
    flex: 1,
  },
  subCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  subCardDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  metadata: {
    fontSize: 11,
    marginBottom: 1,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubCard;
