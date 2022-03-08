import React from "react";
import RootStackScreen from './Screens/RootStackScreen';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import Tabs from './navigation/tabs'
const App = () => {
  return(
    <NavigationContainer>
      <RootStackScreen>
        {/* <Tabs/> */}
      </RootStackScreen>
    </NavigationContainer>
  )
}
export default App;
