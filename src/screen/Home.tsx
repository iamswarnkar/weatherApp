import {
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Image,
  Alert,
  Linking,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  ParamListBase,
  NavigationProp,
  useIsFocused,
} from "@react-navigation/native";
import { WeatherType } from "../utils/types";
import {
  Box,
  Button,
  Center,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import {
  haze,
  sunny,
  snow,
  rainy,
  normal,
} from "../../assets/backgroundImages";
import { ButtonText } from "@gluestack-ui/themed";
import * as Location from "expo-location";

const keyExtractor = (item: WeatherType) => item.id.toString();

export default function Home() {
  const [favorites, setFavorites] = useState<WeatherType[]>();
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const isFocused = useIsFocused();

  const navigateToSearch = () => {
    navigate("Search");
  };

  function itemSeparatorComponent() {
    return <View style={{ height: 12 }} />;
  }

  function getDateAndTime(time: number) {
    const dateObject = new Date(time * 1000);

    const timeString = dateObject.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();

    const dateString = `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;

    return { dateString, timeString };
  }

  useEffect(() => {
    AsyncStorage.getItem("favorites").then((fav) => {
      if (fav) {
        setFavorites(JSON.parse(fav));
      }
    });
  }, [isFocused]);

  function removeFromLocalStorage(id: number) {
    const filtered = favorites?.filter((item) => item.id !== id);
    setFavorites(filtered);
    AsyncStorage.setItem("favorites", JSON.stringify(filtered));
  }

  const renderItem = useCallback(
    ({ item }: { item: WeatherType }) => {
      function getBackgroundImg(weather: string) {
        if (weather === "Snow") return snow;
        if (weather === "Clear") return sunny;
        if (weather === "Rain") return rainy;
        if (weather === "Haze") return haze;
        return normal;
      }
      return (
        <ImageBackground
          source={getBackgroundImg(item.weather[0].main)}
          imageStyle={{
            borderRadius: 8,
            objectFit: "cover",
            opacity: 0.5,
            backgroundColor: "rgba(52, 52, 52, 0.8)",
          }}
        >
          <Box
            borderRadius="$lg"
            borderColor="$black"
            borderWidth="$1"
            px={12}
            py={8}
          >
            <HStack justifyContent="space-between">
              <VStack>
                <Text color="$white" size="3xl">
                  {item.name}
                </Text>
                <HStack>
                  <Text color="$white" size="3xl">
                    {Math.ceil(item.main.temp - 273)}° C
                  </Text>
                  <Image
                    style={{
                      height: 36,
                      width: 36,
                      alignSelf: "center",
                      marginLeft: 4,
                    }}
                    source={{
                      uri: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`,
                    }}
                  />
                </HStack>
                <Text color="$white" bold>{`${
                  getDateAndTime(item.dt).dateString
                }, ${getDateAndTime(item.dt).timeString}`}</Text>
                <Text color="$white" bold>
                  {item.weather[0].description}
                </Text>
              </VStack>
              <VStack>
                <Text color="$white" bold>
                  H:{Math.ceil(item.main.temp_max - 273)}° C | L:
                  {Math.ceil(item.main.temp_min - 273)}° C
                </Text>
                <Text color="$white" size="sm" bold>
                  sunrise:
                  {getDateAndTime(item.sys.sunrise).timeString}
                </Text>
                <Text color="$white" size="sm" bold>
                  sunset:{getDateAndTime(item.sys.sunset).timeString}
                </Text>
                <Text color="$white" size="sm" bold>
                  wind speed:{Math.ceil(item.wind.speed)} M/H
                </Text>
              </VStack>
            </HStack>
            <Button
              size="xs"
              variant="link"
              action="negative"
              onPress={() => removeFromLocalStorage(item.id)}
            >
              <ButtonText size="sm">remove</ButtonText>
            </Button>
          </Box>
        </ImageBackground>
      );
    },
    [favorites]
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Massage",
          "allow Location Permission to get weather update",
          [
            {
              text: "ok",
              onPress: Linking.openSettings,
            },
          ]
        );
        return;
      }
    })();
  }, [isFocused]);

  return (
    <View style={{ paddingHorizontal: 8, height: "100%", paddingBottom: 12 }}>
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
          <Text bold size="2xl" textAlign="center">
            My favorites cities
          </Text>
          <FlatList
            data={favorites}
            keyExtractor={keyExtractor}
            style={{ marginTop: 12 }}
            renderItem={renderItem}
            ItemSeparatorComponent={itemSeparatorComponent}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <Center>
          <Text bold size="2xl" color="$blue300">
            no favorites Cities
          </Text>
        </Center>
      )}
    </View>
  );
}
