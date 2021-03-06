import React from "react";
import RootStackScreen from "./navigation/RootStackScreen";
import {NavigationContainer} from '@react-navigation/native';
import "react-native-gesture-handler";

import {LogBox} from "react-native";

const App = () => {
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
  LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop'])
  LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release.'])
  LogBox.ignoreLogs(['PermissionsAndroid" module works only for Android platform.'])
  LogBox.ignoreLogs(["Warning: Can't perform a React state update on an unmounted component"])
  LogBox.ignoreLogs(["VirtualizedLists should never be nested inside plain"])

  return(
    <NavigationContainer>      
      <RootStackScreen>
      </RootStackScreen>
    </NavigationContainer>
  )}
export default App;

