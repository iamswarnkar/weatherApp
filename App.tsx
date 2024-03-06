import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/stackNavigators";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

export default function App() {
  return (
    <NavigationContainer>
      <GluestackUIProvider config={config}>
        <StackNavigator />
      </GluestackUIProvider>
    </NavigationContainer>
  );
}
