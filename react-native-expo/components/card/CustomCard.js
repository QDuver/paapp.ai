import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import SubCard from './SubCard';

const CustomCard = ({ item, collection, index, onUpdate }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isCompleted, setIsCompleted] = useState(item.isCompleted || false);
  const [isExpanded, setIsExpanded] = useState(item.isExpanded || false);

  // Adapt to real data structure
  const cardData = {
    title: item.name || item.title || `${collection} item ${index + 1}`,
    description: item.instructions || item.description || item.notes || '',
    isCompleted: isCompleted,
    items: item.items || [], // subcards
    // Collection-specific fields
    durationMin: item.durationMin,
    routineType: item.routineType,
    calories: item.calories,
    id: item.id, // Important for updates
    ...item
  };

  const handleToggleComplete = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    
    // Update via API if callback is provided
    if (onUpdate) {
      const updatedItem = { ...item, isCompleted: newCompleted };
      onUpdate(updatedItem);
    }
  };

  const handleCardPress = () => {
    // TODO: Open edit dialog
    console.log('Edit card:', cardData.title);
  };

  const handleToggleExpand = () => {
    if (cardData.items && cardData.items.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderSubCards = () => {
    if (!cardData.items || cardData.items.length === 0 || !isExpanded || collection === 'routines') {
      return null;
    }

    return cardData.items.map((subItem, subIndex) => (
      <SubCard
        key={`subcard-${index}-${subIndex}`}
        subItem={subItem}
        parentItem={cardData}
        collection={collection}
        index={subIndex}
        onUpdate={onUpdate}
      />
    ));
  };

  const cardBackgroundColor = isDarkMode 
    ? (isCompleted ? '#2C2C2E' : '#1C1C1E')
    : (isCompleted ? '#F2F2F7' : '#FFFFFF');

  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDarkMode ? '#AEAEB2' : '#6D6D70';

  return (
    <View style={styles.cardContainer}>
      <View style={[
        styles.card,
        { backgroundColor: cardBackgroundColor },
        isCompleted && styles.completedCard
      ]}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={handleCardPress}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            {/* Completion Toggle */}
            <TouchableOpacity
              style={[
                styles.completionToggle,
                {
                  borderColor: isCompleted 
                    ? (isDarkMode ? '#007AFF' : '#007AFF')
                    : (isDarkMode ? '#AEAEB2' : '#C7C7CC'),
                  backgroundColor: isCompleted 
                    ? (isDarkMode ? '#007AFF' : '#007AFF') 
                    : 'transparent'
                }
              ]}
              onPress={handleToggleComplete}
            >
              {isCompleted && (
                <Text style={styles.checkIcon}>✓</Text>
              )}
            </TouchableOpacity>

            {/* Card Content */}
            <View style={styles.cardTextContainer}>
              <Text style={[
                styles.cardTitle,
                { color: textColor },
                isCompleted && styles.completedText
              ]}>
                {cardData.title}
              </Text>
              
              {cardData.description && (
                <Text style={[
                  styles.cardDescription,
                  { color: secondaryTextColor },
                  isCompleted && styles.completedText
                ]}>
                  {cardData.description}
                </Text>
              )}

              {/* Additional metadata based on collection type */}
              {collection === 'routines' && (
                <View style={styles.metadataRow}>
                  {cardData.durationMin > 0 && (
                    <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                      ⏱️ {cardData.durationMin} min
                    </Text>
                  )}
                  {cardData.routineType && cardData.routineType !== 'other' && (
                    <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                      🏷️ {cardData.routineType}
                    </Text>
                  )}
                </View>
              )}
              
              {collection === 'exercises' && cardData.items && cardData.items.length > 0 && (
                <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                  �️ {cardData.items.length} sets
                </Text>
              )}

              {collection === 'meals' && cardData.calories && (
                <Text style={[styles.metadata, { color: secondaryTextColor }]}>
                  🔥 {cardData.calories} cal
                </Text>
              )}
            </View>

            {/* Expand/Collapse button if has subitems */}
            {cardData.items && cardData.items.length > 0 && collection !== 'routines' && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={handleToggleExpand}
              >
                <Text style={[
                  styles.expandIcon,
                  { color: secondaryTextColor }
                ]}>
                  {isExpanded ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Render subcards */}
      {renderSubCards()}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  completedCard: {
    opacity: 0.7,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  completionToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  metadata: {
    fontSize: 12,
    marginBottom: 2,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  expandButton: {
    padding: 4,
    marginLeft: 8,
  },
  expandIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomCard;
