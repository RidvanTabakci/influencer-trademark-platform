
import {NavigationContainer} from "@react-navigation/native";
import {RootTabs} from "./src/Routes/navigation";
import {GestureHandlerRootView} from "react-native-gesture-handler";

const App = () => {
  return (
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
            <RootTabs/>
        </NavigationContainer>
      </GestureHandlerRootView>
  )
}
export default App;
