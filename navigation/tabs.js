import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from '../Screens/DashboardPage';
import HomePage from '../Screens/HomePage';
import SearchUser from '../Screens/SearchUser';
import ChatList from '../Screens/ChatList'
import React from 'react';
import {Alert,Platform } from 'react-native';
import {auth} from '../FirebaseConfig';
import { color } from '../utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//create tab navigator
const Tab = createBottomTabNavigator();

const Tabs = ({navigation, route} ) =>{
    const {type} = route.params;
    let name
    // screen
    if(type === 'giver'){
      name = 'נתרמים'
    }
    else{
      name = 'תורמים'
    }

    return(   
        <Tab.Navigator   
            initialRouteName={"איזור אישי"}   
            screenOptions={({ route }) => ({
            headerTitle: route.name,
            headerShown:true,
            headerTitleAlign:'center',
            headerStyle: {
              backgroundColor: color.TURQUOISE,
            },
            headerTintColor: color.WHITE_GRAY,  
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: color.TURQUOISE,
            tabBarInactiveTintColor: color.GRAY,
            tabBarLabelStyle: {
              fontSize: 10
            },
               
            tabBarItemStyle:{
              backgroundColor:'#f1f1f1',
              margin:3,
              borderRadius:10,
            },
          
            headerRight: () => (
              Platform.OS === 'ios'?
                  console.log("ios")
                  // <MaterialCommunityIcons name={"arrow-right"} size={26} color={color.WHITE_GRAY} 
                  // style = {{right:10,}}
                  // onPress = {() => navigation.goBack()}
                  //   />
                  :
              <Ionicons
                name='log-out-outline'
                size = {26}
                style = {{right:10}}
                color ={color.WHITE_GRAY}
                onPress = {()=>
                  Alert.alert('יציאה','האם אתה בטוח שאתה רוצה לצאת?',[
                  {
                    text:'כן',
                    onPress: ()=>{ 
                      auth.signOut()
                      .then(() => {
                        navigation.navigate("HomeScreen")
                      })
                      .catch(error => alert(error.message))},
                    
                  },{
                    text:'לא',
                    onPress: ()=>{ 
                      return
                    },
                  }
                  ],
                  )
    
                }/>),
            
            headerLeft:()=>(
              Platform.OS === 'ios'?
              <Ionicons
              name='log-out-outline'
              size = {26}
              style = {{left:10}}
              color ={color.WHITE_GRAY}
              onPress = {()=>
                Alert.alert('יציאה','האם אתה בטוח שאתה רוצה לצאת?',[
                {
                  text: 'לא',
                  onPress: ()=>{ 
                      return
                    
                }},{
                  text: 'כן',
                  onPress: ()=>{ 
                        auth
                        .signOut()
                        .then(() => {
                          navigation.navigate("HomeScreen")
                      })
                      .catch(error => alert(error.message))
                    } 
                  
                }
                ],)}/>
              :
              console.log("android")
              // <MaterialCommunityIcons name={"arrow-right"} size={26} color={color.WHITE_GRAY} 
              //   style = {{left:10,}}
              //   onPress = {() => navigation.goBack()}
              //     />
            ),
                 
            
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
                if (route.name === "מפה") {
                  iconName = focused ? 'map' : 'map-outline'; } 
                else if (route.name === name) {
                  iconName = focused ? 'people' : 'people-outline';} 
                else if (route.name === "צ'אט") {
                  iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                }
                else if (route.name === "איזור אישי") {
                  iconName = focused ? 'person' : 'person-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}>

          <Tab.Screen name="מפה" component={HomePage}  />
          <Tab.Screen name={name} component={SearchUser} />
          <Tab.Screen name="צ'אט" component={ChatList} />
          <Tab.Screen name="איזור אישי" component={Dashboard}/>
        </Tab.Navigator>
    );
}  


export default Tabs;

