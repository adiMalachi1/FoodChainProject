import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from '../Screens/DashboardPage';
import DashboardGetter from '../Screens/DashboardGetter';
import HomePage from '../Screens/HomePage';
import GettersPage from '../Screens/GettersPage';
import React from 'react';
import { View, Text,StyleSheet, Button, Alert, } from 'react-native';
import {Icon} from 'react-native-elements'

import { Directions, TouchableOpacity } from 'react-native-gesture-handler';
import {auth} from '../FirebaseConfig';
import { color } from '../utils';
import SignInScreen from '../Screens/SignInScreen';

const Tab = createBottomTabNavigator();

const Tabs = ({navigation, route} ) =>{
    const {type} = route.params;
  let name
  // screen
  if(type === 'giver'){
    name = 'נתרמים'
    // screen = Dashboard
  }
  else{
    name = 'תורמים'
    // screen = DashboardGetter
  }
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("HomeScreen")
      })
      .catch(error => alert(error.message))
  }
    return(
            <Tab.Navigator 
            
            initialRouteName={"איזור אישי"}
          
            screenOptions={({ route }) => ({
              
           
            
            headerTitle: route.name,
            headerShown:true,
             
                headerStyle: {
                  backgroundColor: color.TURQUOISE,
                },
                headerTintColor: color.WHITE,  
                headerTitleStyle: {
                  fontWeight: 'bold',
                 
                },
                headerRight: () => (
                  <Ionicons
                    name='log-out-outline'
                    size = {26}
                    style = {{right:10}}
                    color ={color.WHITE}
                    onPress = {()=>
                      Alert.alert('יציאה','האם אתה בטוח שאתה רוצה לצאת?',[
                      {
                        text:'כן',
                        onPress: ()=>{ auth
                          .signOut()
                          .then(() => {
                            navigation.navigate("HomeScreen")
                          })
                          .catch(error => alert(error.message))},
                        
                      },{
                        text:'לא',
                      }
                      ],
                     
                      )
        
                    }/>),
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: color.TURQUOISE,
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
      
                  } else if (route.name === name) {
                    iconName = focused ? 'people' : 'people-outline';
      
                  } else if (route.name === "איזור אישי") {
                    iconName = focused ? 'person' : 'person-outline';
                  }
      
                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}>
        
                 <Tab.Screen name="בית" component={HomePage}  />
                 <Tab.Screen name={name} component={GettersPage} />
                 <Tab.Screen name="איזור אישי" component={Dashboard} />
 

            </Tab.Navigator>

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