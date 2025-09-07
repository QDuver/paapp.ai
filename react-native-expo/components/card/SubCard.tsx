import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import EditDialog from './EditDialog';
import { CardAbstract, SubCardAbstract, CardListAbstract } from '../../models/Abstracts';
import { useAppContext } from '../../contexts/AppContext';

// Type definitions for the component props
interface SubCardProps {
  subItem: SubCardAbstract;
  parentItem: CardAbstract;
  cardList: CardListAbstract;
  index: number;
}

const SubCard = ({ 
  subItem, 
  parentItem, 
  cardList,
  index, 
}: SubCardProps) => {
  const { onUpdate } = useAppContext();
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);


  const backgroundColor: string = '#2C2C2E';
  const textColor: string = '#FFFFFF';
  const subtitleColor: string = '#8E8E93';

  return (
    <View style={[styles.subCard, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.subCardContent}
        onPress={() => setShowEditDialog(true)}
        activeOpacity={0.7}
      >
        <View style={styles.subCardHeader}>
          <Text style={[styles.subCardTitle, { color: textColor }]}>
            {subItem.name || `Set ${index + 1}`}
          </Text>
        </View>

        {/* Sub-card specific info */}
        {subItem.getTags().length > 0 && (
          <View style={styles.subCardInfoRow}>
            {subItem.getTags().map((tag, tagIndex) => (
              <Text key={tagIndex} style={[styles.subCardInfo, { color: subtitleColor }]}>
                {tag}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>

      <EditDialog
        visible={showEditDialog}
        item={subItem}
        cardList={cardList}
        onClose={() => setShowEditDialog(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subCard: {
    marginLeft: 32,
    marginRight: 16,
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  subCardContent: {
    padding: 12,
  },
  subCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  subCardDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  subCardInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subCardInfo: {
    fontSize: 11,
    fontWeight: '500',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default SubCard;
