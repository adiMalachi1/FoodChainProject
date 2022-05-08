import React from "react";
import RootStackScreen from "./navigation/RootStackScreen";
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';


import { LogBox} from "react-native";

const App = () => {
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
  LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop'])

  return(
    <NavigationContainer>
       
      <RootStackScreen>

      </RootStackScreen>

    </NavigationContainer>
  )
  }
export default App;

