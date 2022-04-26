import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from '../Screens/DashboardPage';
import HomePage from '../Screens/HomePage';
import GettersPage from '../Screens/GettersPage';
import React from 'react';
import { View, Text,StyleSheet, Button, } from 'react-native';
import {Icon} from 'react-native-elements'

import { Directions, TouchableOpacity } from 'react-native-gesture-handler';
import {auth} from '../FirebaseConfig';

const Tab = createBottomTabNavigator();

const Tabs = ({navigation} ) =>
{
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("HomeScreen")
      })
      .catch(error => alert(error.message))
  }
    return(
          // <NavigationContainer>
            <Tab.Navigator 
            
            initialRouteName={"איזור אישי"}
          
            screenOptions={({ route }) => ({
              
           
            
            headerTitle: route.name,
              headerRight: () => (
                
                <TouchableOpacity  onPress={handleSignOut}>
                  <Icon
                  type = "material-community"
                  margin = {10}
                  name = "menu"
                  color = "#009387"
                  size = {30}
              
                    />
                </TouchableOpacity>
              ),
                
                // headerTitleAlign:'left',
                headerStyle: {
                  backgroundColor: 'blue',
                  // height:80,
                },
                headerTintColor: '#fff',  
                headerTitleStyle: {
                  fontWeight: 'bold',
                  // height:20,
                  // margin:10,
                },
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: {
                  fontSize: 10
                },
               
                  tabBarItemStyle:{
                    backgroundColor:'#f1f1f1',
                    margin:3,
                    borderRadius:10 },
                    
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === "בית") {
                    iconName = focused ? 'home' : 'home-outline';
      
                  } else if (route.name === "נתרמים") {
                    iconName = focused ? 'people' : 'people-outline';
      
                  } else if (route.name === "איזור אישי") {
                    iconName = focused ? 'person' : 'person-outline';
                  }
      
                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}>
        
                 <Tab.Screen name="בית" component={HomePage}  />
                 <Tab.Screen name="נתרמים" component={GettersPage} />
                 <Tab.Screen name="איזור אישי" component={Dashboard} />
            </Tab.Navigator>
            // {/* </NavigationContainer> */}

    );
}  


export default Tabs;
const Styles = StyleSheet.create({
  container: {
      flex: 1,
      // backgroundColor: '#009387',
      backgroundColor: "#fff",
      margin:10,
      // alignItems: 'center',
      paddingTop: 10, 
    },
  })