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

interface CardListProps {
  cardList: CardListAbstract;
}

const CardList = ({ cardList }: CardListProps) => {

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
        keyExtractor={(item, index) => `card-${index}`}
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
});

export default CardList;
