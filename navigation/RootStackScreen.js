import React from 'react';
import {Alert, Platform} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import ForgotPassword from '../Screens/ForgotPassword';
import FormGetter from '../Screens/FormGetter';
import FormGiver from '../Screens/FormGiver';
import Tabs from './Tabs'
import HomePage from '../Screens/HomePage';
import SearchUser from '../Screens/SearchUser';
import Dashboard from '../Screens/DashboardPage';
import EditForm from '../Screens/EditForm';
import EditDetail from '../Screens/EditDetail';
import ChatList from '../Screens/ChatList'
import Chat from '../Screens/Chat';
import SingleChat from '../Screens/SingleChat';
import {auth} from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native'
import ShowProfiles from '../Screens/ShowProfiles';
import { color } from '../utils';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'איזור אישי';

  switch (routeName) {
    case 'איזור אישי':
      return 'איזור אישי';
    case 'נתרמים':
      return 'נתרמים';
    case 'תורמים':
      return 'תורמים';
    case 'מפה':
      return 'מפה';
    case "צ'אט":
    return "צ'אט";
  }
}
const RootStack = createStackNavigator();

const RootStackScreen = () => {
  const navigation = useNavigation();

 const handleSignOut = () => {
  auth
  .signOut()
  .then(() => {
    navigation.navigate("HomeScreen")
  })
  .catch(error => alert(error.message))
} 
return(
  
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
        flexDirection:'row-reverse',
        writingDirection:'rtl'
      },
      headerRight: () => (
          Platform.OS === 'ios'?
              <MaterialCommunityIcons name={"arrow-right"} size={26} color={color.WHITE_GRAY} 
              style = {{right:10,}}
              onPress = {() => navigation.goBack()}
                />
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
          <MaterialCommunityIcons name={"arrow-right"} size={26} color={color.WHITE_GRAY} 
            style = {{left:10,}}
            onPress = {() => navigation.goBack()}
              />
        ),
        }}>
        
        <RootStack.Screen name="HomeScreen" component={HomeScreen}	options={{header: () => null}}/>
        <RootStack.Screen name="LoginScreen" component={LoginScreen}	options={{header: () => null}}/>
        <RootStack.Screen name="מסך הרשמה" component={SignUpScreen}options={{header: () => null}}/>
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword} options={{header: () => null}}/>
        <RootStack.Screen name="שאלון נתרם" component={FormGetter}options={{header: () => null}}/>
        <RootStack.Screen name="שאלון תורם" component={FormGiver}options={{header: () => null}}/>
        <RootStack.Screen name="Tabs"  component={Tabs}
          options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          headerShown: false,
        })}/>
        <RootStack.Screen name="HomePage" component={HomePage}/>
        <RootStack.Screen name="משתמשים" component={SearchUser}/>
        <RootStack.Screen name="Dashboard" component={Dashboard} />
        <RootStack.Screen name="עריכת פרטי הטופס" component={EditForm}/>
        <RootStack.Screen name="עריכת פרטים אישיים" component={EditDetail}/>
        <RootStack.Screen name="הצגת פרופיל" component={ShowProfiles}/>
        <RootStack.Screen name="צ'אט" component={Chat} />
        <RootStack.Screen name="צ'אט פרטי" component={SingleChat}/>
        <RootStack.Screen name="רשימת צ'אט" component={ChatList}/>


    </RootStack.Navigator>
  // {/* </NavigationContainer> */}
);}

export default RootStackScreen;