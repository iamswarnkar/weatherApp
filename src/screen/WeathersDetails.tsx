import { View, Text } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { WeatherType } from "../utils/types";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  WeatherDetails: { data: WeatherType };
};
export default function WeathersDetails() {
  const { params } =
    useRoute<RouteProp<RootStackParamList, "WeatherDetails">>();

  return (
    <View style={{ marginTop: 8, paddingHorizontal: 8, gap: 8 }}>
      <Text>City name: {params?.data?.name}</Text>
      <Text>City name: {params?.data?.name}</Text>
      <Text>
        City Tempracher:
        {Math.ceil(((params?.data?.main.temp - 32) * 5) / 9)}° C
      </Text>
      <Text>
        today max Tempracher:
        {Math.ceil(((params?.data?.main.temp_max - 32) * 5) / 9)}° C
      </Text>
      <Text>
        today min Tempracher:
        {Math.ceil(((params?.data?.main.temp_min - 32) * 5) / 9)}° C
      </Text>
      <Text>
        Feels Like:
        {Math.ceil(((params?.data?.main?.feels_like - 32) * 5) / 9)}° C
      </Text>
      <Text>wind Speed: {params?.data?.wind?.speed}km/hr</Text>
      <Text>
        today sunrise:
        {new Date(params?.data?.sys?.sunrise * 1000).toLocaleTimeString(
          "en-IN",
          { timeZone: "Asia/Kolkata" }
        )}
      </Text>
      <Text>
        today sunset:
        {new Date(params?.data?.sys?.sunset * 1000).toLocaleTimeString(
          "en-IN",
          { timeZone: "Asia/Kolkata" }
        )}
      </Text>
    </View>
  );
}
