import { View, Alert, Keyboard, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { getWeatherByCity, getWeatherByLatAndLog } from "../utils/api/getApis";
import { WeatherType } from "../utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  InputSlot,
  Spinner,
  Input,
  InputField,
  Toast,
  VStack,
  useToast,
  ToastTitle,
  ToastDescription,
  Text,
  HStack,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Entypo, Feather, FontAwesome6 } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function Search() {
  const [text, setText] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherType>();
  const [disabled, setDisabled] = useState(false);
  const [isFav, setIsfav] = useState(false);
  const toast = useToast();

  const checkIsPresent = useCallback((data: WeatherType) => {
    AsyncStorage.getItem("favorites").then((fav) => {
      if (fav) {
        const favorites = JSON.parse(fav);
        const isPresent = favorites.some(
          (item: WeatherType) => item.id === data.id
        );
        setIsfav(isPresent);
      }
    });
  }, []);
  function handleSearch() {
    if (text) {
      setDisabled(true);
      getWeatherByCity(text)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            Alert.alert("Massage", data.message);
          } else {
            setWeatherData(data);
            Keyboard.dismiss();
            checkIsPresent(data);
          }
        })
        .catch(() => {
          Alert.alert(
            "Error",
            "something Want wrong please try after some time"
          );
        })
        .finally(() => setDisabled(false));
    }
  }

  function handleAddToFav() {
    Alert.alert("Massage", "Do you want to add to favorites", [
      {
        text: "Yes",
        onPress: async () => {
          try {
            const oldData = await AsyncStorage.getItem("favorites");
            if (oldData) {
              const newData = [...JSON.parse(oldData), weatherData];
              await AsyncStorage.setItem("favorites", JSON.stringify(newData));
              setIsfav(true);
            } else {
              await AsyncStorage.setItem(
                "favorites",
                JSON.stringify([weatherData])
              );
              setIsfav(true);
            }
            toast.show({
              placement: "bottom",
              render: ({ id }) => {
                const toastId = "toast-" + id;
                return (
                  <Toast nativeID={toastId} action="success" variant="accent">
                    <VStack space="xs">
                      <ToastTitle>congrats!</ToastTitle>
                      <ToastDescription>
                        added into favorites success
                      </ToastDescription>
                    </VStack>
                  </Toast>
                );
              },
            });
          } catch (error) {
            /* empty */
          }
        },
      },
      {
        text: "no",
      },
    ]);
  }

  useEffect(() => {
    async function getLocation() {
      const perm = (await Location.requestForegroundPermissionsAsync()).granted;
      if (perm) {
        try {
          const {
            coords: { latitude, longitude },
          } = await Location.getCurrentPositionAsync({});
          if (latitude && longitude) {
            getWeatherByLatAndLog(
              parseFloat(latitude.toFixed(2)),
              parseFloat(longitude.toFixed(2))
            )
              .then((res) => res.json())
              .then((result) => {
                setWeatherData(result);
                checkIsPresent(result);
              });
          }
        } catch (e) {
          Alert.alert("Error", "something wat to wrong try after some time");
        }
      }
    }
    getLocation();
  }, []);

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
  return (
    <View style={{ paddingHorizontal: 8, paddingBottom: 32 }}>
      <Input
        variant="outline"
        size="md"
        mt={"$2"}
        pr="$2"
        isDisabled={disabled}
      >
        <InputField
          onChangeText={(text) => setText(text)}
          placeholder="Search Your City"
        />
        <InputSlot onPress={handleSearch}>
          {disabled ? (
            <Spinner size="small" color="$emerald600" />
          ) : (
            <Feather name="search" size={24} color="gray" />
          )}
        </InputSlot>
      </Input>

      {weatherData ? (
        <View style={{ marginTop: 12 }}>
          <VStack justifyContent="center">
            <Text textAlign="center" size="2xl">
              {weatherData.name}
            </Text>
            <Text textAlign="center" size="3xl">
              {Math.ceil(weatherData.main.temp - 273)}° C
            </Text>
            <Text textAlign="center">
              H:{Math.ceil(weatherData.main.temp_max - 273)}° C{" "}
              <FontAwesome6
                name="temperature-arrow-up"
                size={20}
                color="gray"
              />
              | L:
              {Math.ceil(weatherData.main.temp_min - 273)}° C{" "}
              <FontAwesome6
                name="temperature-arrow-down"
                size={20}
                color="gray"
              />
            </Text>
            <Image
              style={{
                height: 36,
                width: 36,
                alignSelf: "center",
                marginLeft: 4,
              }}
              source={{
                uri: `https://openweathermap.org/img/w/${weatherData?.weather[0].icon}.png`,
              }}
            />

            <Text textAlign="center" size="lg">
              feel like {weatherData.weather[0]?.description}
            </Text>
            <Text textAlign="center">
              {getDateAndTime(weatherData.dt).dateString}{" "}
              {getDateAndTime(weatherData.dt).timeString}
            </Text>
            <VStack mt={"$2"}>
              <HStack padding={"$1"} justifyContent="space-between">
                <HStack>
                  <Text>
                    sunrise:{" "}
                    {getDateAndTime(weatherData.sys.sunrise).timeString}
                  </Text>
                  <View
                    style={{
                      marginLeft: 4,
                    }}
                  >
                    <Feather name="sunrise" size={20} color="gray" />
                  </View>
                </HStack>

                <HStack>
                  <Text>
                    sunset: {getDateAndTime(weatherData.sys.sunset).timeString}
                  </Text>
                  <View
                    style={{
                      marginLeft: 4,
                    }}
                  >
                    <Feather name="sunset" size={20} color="gray" />
                  </View>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
          <HStack justifyContent="space-between">
            <Text>wind Speed: {weatherData?.wind?.speed} M/H</Text>
            <Text>visibility: {weatherData?.visibility / 10} Miter</Text>
          </HStack>
          <View>
            {isFav ? (
              <HStack mt={"$3"} justifyContent="center">
                <Text color="$red500">Already in your favorites list</Text>
                <Entypo name="heart" size={24} color="red" />
              </HStack>
            ) : (
              <Button
                variant="outline"
                action="positive"
                mt={"$3"}
                onPress={handleAddToFav}
              >
                <ButtonText>
                  <Feather name="heart" size={24} color="red" />
                  <Text>Add</Text>
                </ButtonText>
              </Button>
            )}
          </View>
        </View>
      ) : (
        <>
          <Text size="xl" textAlign="center">
            some popular cities
          </Text>
        </>
      )}
    </View>
  );
}
