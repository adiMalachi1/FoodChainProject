import React from "react";
import RootStackScreen from './Screens/RootStackScreen';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';

const App = () => {
  return(
    <NavigationContainer>
      <RootStackScreen>
        
      </RootStackScreen>
    </NavigationContainer>
  )
}
export default App;
