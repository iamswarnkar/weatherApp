import { View, Text } from "react-native";
import React from "react";
import { WeatherType } from "../utils/types";

interface Props {
  weatherData: WeatherType;
}

export default function WeatherData({ weatherData }: Props) {
  return (
    <View>
      <Text>City name: {weatherData.name}</Text>
      <Text>
        City Tempracher:
        {Math.ceil(weatherData.main.temp - 273)}° C
      </Text>
      <Text>
        today max Tempracher:
        {Math.ceil(weatherData.main.temp_max - 273)}° C
      </Text>
      <Text>
        today min Tempracher:
        {Math.ceil(weatherData.main.temp_min - 273)}° C
      </Text>
    </View>
  );
}
