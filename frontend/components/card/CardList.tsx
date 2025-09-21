import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ListRenderItem
} from "react-native";
import { CardListAbstract, CardAbstract } from "../../models/Abstracts";
import CustomCard from "./CustomCard";
import { useAppContext } from "../../contexts/AppContext";

interface CardListProps {
  cardList: CardListAbstract<any>;
}

const CardList = ({ cardList }: CardListProps) => {
  const { refreshCounter } = useAppContext();

  const renderCard: ListRenderItem<CardAbstract> = ({ item, index }) => (
    <CustomCard
      cardList={cardList}
      item={item}
      index={index}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList<CardAbstract>
        data={cardList.items}
        renderItem={renderCard}
        keyExtractor={(item, index) => `${refreshCounter}-card-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 9999,
  },
  fab: {
    backgroundColor: '#6200EE',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default CardList;
