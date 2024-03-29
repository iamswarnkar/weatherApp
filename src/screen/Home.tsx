import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { WeatherType } from "../utils/types";
import WeatherData from "../components/WeatherData";

const keyExtractor = (item: WeatherType) => item.id.toString();

export default function Home() {
  const [favorites, setFavorites] = useState<WeatherType[]>();
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const navigateToSearch = () => {
    navigate("Search");
  };

  function itemSeparatorComponent() {
    return <View style={{ height: 12 }} />;
  }

  useEffect(() => {
    AsyncStorage.getItem("favorites").then((fav) => {
      if (fav) {
        setFavorites(JSON.parse(fav));
      }
    });
  }, [favorites]);

  const renderItem = useCallback(
    ({ item }: { item: WeatherType }) => {
      return (
        <View style={{ borderWidth: 0.5, padding: 8, borderRadius: 8 }}>
          <WeatherData weatherData={item} />
        </View>
      );
    },
    [favorites]
  );
  return (
    <View style={{ paddingHorizontal: 8 }}>
      <TouchableOpacity
        onPress={navigateToSearch}
        style={{
          backgroundColor: "#7ed90f",
          paddingVertical: 8,
          paddingHorizontal: 20,
          borderRadius: 8,
          marginTop: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          search weather
        </Text>
      </TouchableOpacity>
      {favorites ? (
        <>
          <Text
            style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}
          >
            My favorites cities
          </Text>
          <FlatList
            data={favorites}
            keyExtractor={keyExtractor}
            style={{ marginTop: 12 }}
            renderItem={renderItem}
            ItemSeparatorComponent={itemSeparatorComponent}
          />
        </>
      ) : (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            no favorites Cities
          </Text>
        </View>
      )}
    </View>
  );
}
