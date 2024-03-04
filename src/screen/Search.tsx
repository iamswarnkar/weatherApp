import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { getWeatherByCity } from "../utils/api/getApis";
import { WeatherType } from "../utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import WeatherData from "../components/WeatherData";

interface WeatherDetailsParams {
  data: WeatherType;
}

export default function Search() {
  const [text, setText] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherType>();
  const [disabled, setDisabled] = useState(false);

  const { navigate } = useNavigation();

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
            } else {
              await AsyncStorage.setItem(
                "favorites",
                JSON.stringify([weatherData])
              );
            }

            ToastAndroid.showWithGravity(
              "congrats! added into favorites",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          } catch (error) {}
        },
      },
      {
        text: "no",
      },
    ]);
  }

  function navigateToWeatherDetails() {
    navigate("WeathersDetails", { data: weatherData });
  }

  return (
    <View style={{ paddingHorizontal: 8 }}>
      <TextInput
        onChangeText={(text) => setText(text)}
        style={{
          borderWidth: 0.5,
          marginTop: 16,
          paddingHorizontal: 12,
          height: 36,
          borderRadius: 8,
        }}
        placeholder="search city"
      />
      <TouchableOpacity
        disabled={disabled}
        onPress={handleSearch}
        style={{
          backgroundColor: "#7ed90f",
          alignItems: "center",
          marginTop: 12,
          paddingVertical: 8,
          borderRadius: 8,
          opacity: disabled ? 0.3 : 1,
        }}
      >
        <Text>{disabled ? "loading..." : "Search"} </Text>
      </TouchableOpacity>
      {weatherData ? (
        <View
          style={{
            marginTop: 16,
            borderWidth: 0.5,
            padding: 8,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <WeatherData weatherData={weatherData} />
          <View>
            <TouchableOpacity
              onPress={handleAddToFav}
              style={{
                backgroundColor: "#DB7093",
                padding: 4,
                borderRadius: 4,
              }}
            >
              <Text>Add to Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={navigateToWeatherDetails}
              style={{
                backgroundColor: "#DB7",
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 4,
                alignSelf: "center",
                marginTop: 4,
              }}
            >
              <Text>know more</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={{ alignSelf: "center", marginTop: 56, fontSize: 24 }}>
          search your city
        </Text>
      )}
    </View>
  );
}
