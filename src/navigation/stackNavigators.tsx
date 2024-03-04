import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screen/Home";
import Search from "../screen/Search";
import WeathersDetails from "../screen/WeathersDetails";

const Stack = createStackNavigator();
export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="WeathersDetails" component={WeathersDetails} />
    </Stack.Navigator>
  );
}
