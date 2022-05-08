import React from 'react';
import {Alert} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignInScreen from '../Screens/SignInScreen';
import SignUpScreen from '../Screens/SignupScreen';
import ForgotPassword from '../Screens/ForgotPassword';
import FormGetter from '../Screens/FormGetter';
import FormGiver from '../Screens/FormGiver';
import Tabs from './Tabs'
import HomePage from '../Screens/HomePage';
import GettersPage from '../Screens/GettersPage';
import Dashboard from '../Screens/DashboardPage';
import EditProfile from '../Screens/EditProfile';
import EditDetail from '../Screens/EditDetail';
// import TabsGetter from './TabsGetter'
import {auth, db, storage} from '../FirebaseConfig';

import DrawerNavigator from './DrawerNavigator';
import DashboardGetter from '../Screens/DashboardGetter';
import { NavigationContainer } from '@react-navigation/native';
import ShowProfiles from '../Screens/ShowProfiles';
import { color } from '../utils';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function getHeaderTitle(route) {
  
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'איזור אישי';

  switch (routeName) {
    case 'איזור אישי':
      return 'איזור אישי';
    case 'נתרמים':
      return 'נתרמים';
    case 'תורמים':
      return 'תורמים';
    case 'בית':
      return 'בית';
  }
}
const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => {
 const handleSignOut = () => {
  auth
    .signOut()
    .then(() => {
      navigation.navigate("HomeScreen")
    })
    .catch(error => alert(error.message))
} 
  return(
    //  <NavigationContainer  independent={true}> 
   <RootStack.Navigator  screenOptions={{
        headerShown: true,
        headerTitleAlign:'center',
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: color.TURQUOISE,
        },
        headerTintColor: '#fff',  
        headerTitleStyle: {
          fontWeight: 'bold',
          // height:20,
          // margin:10,
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
              // {
              //   cancelable:false,
              // },
              )

            }/>),
        
      }}>
        
        <RootStack.Screen name="HomeScreen" component={HomeScreen}	options={{header: () => null}}/>
        <RootStack.Screen name="LoginScreen" component={LoginScreen}	options={{header: () => null}}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <RootStack.Screen name="FormGetter" component={FormGetter}/>
        <RootStack.Screen name="FormGiver" component={FormGiver}/>
        <RootStack.Screen name="Tabs"  component={Tabs}
          options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          headerShown: false,
        })}/>
        {/* <RootStack.Screen name="איזור אישי" component={TabsGetter}/> */}
        <RootStack.Screen name="HomePage" component={HomePage}/>
        <RootStack.Screen name="GettersPage" component={GettersPage}/>
        <RootStack.Screen name="Dashboard" component={Dashboard} />
        {/* <RootStack.Screen name="DashboardGetter" component={DashboardGetter}options={{header: () => null}}/> */}
        <RootStack.Screen name="Drawer" component={DrawerNavigator}/>
        <RootStack.Screen name="EditProfile" component={EditProfile}/>
        <RootStack.Screen name="עריכת פרטים אישיים" component={EditDetail}/>
        <RootStack.Screen name="ShowProfiles" component={ShowProfiles}/>

    </RootStack.Navigator>
  // {/* </NavigationContainer> */}
);}

export default RootStackScreen;