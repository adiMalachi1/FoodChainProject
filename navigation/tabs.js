import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Dashboard from '../Screens/DashboardPage';
import HomePage from '../Screens/HomePage';
import GettersPage from '../Screens/GettersPage';

const Tab = createBottomTabNavigator();

const Tabs = () =>
{
    return(
        // <NavigationContainer  independent={true}>
            <Tab.Navigator 
            
            initialRouteName={"בית"}
            screenOptions={({ route }) => ({
          
                backgroundColor:'blue',
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: "gray",
                // tabBarLabelPosition: 'beside-icon',
                // tabBarActiveBackgroundColor:"blue",
                // tabBarStyle:{
                //         borderRadius:50,
                //         backgroundColor:'yellow',
                // },
                tabBarLabelStyle: {
                //   paddingBottom: 5,
                  fontSize: 10
                },
               
                // activeTintColor: 'green',
                // inactiveTintColor: 'gray',
                // labelStyle: { paddingBottom: 5, fontSize: 10 },
                // borderRadius:15,
                // backgroundColor: 'blue',
                // tabBarShowLabel: false,
                // tabBarHideOnKeyboard: true,
                // style: {
                //     borderRadius: 15,
                //     height: 90,
                // },
                
                
                // tabBarStyle:{
                //     borderRadius: 15,
                //     backgroundColor:'red',

                // //     height: 90,
                //   },
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
            {/* // tabBarOptions={{ */}
            {/* //     activeTintColor: 'green',
            //     inactiveTintColor: 'gray',
            //     labelStyle: { fontSize: 10, },
            //     // style: { padding: 10, height: 70, }
            //   }}> */}
                 <Tab.Screen name="בית" component={HomePage} />
                 <Tab.Screen name="נתרמים" component={GettersPage} />
                 <Tab.Screen name="איזור אישי" component={Dashboard} />
            </Tab.Navigator>
        // </NavigationContainer>
    );
}  


export default Tabs;