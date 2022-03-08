import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignupScreen';
import SignUpConScreen from './SignUpConScreen';
import ForgotPassword from './ForgotPassword';
import FormGetter from './FormGetter';
import FormGiver from './FormGiver';
import Tabs from '../navigation/tabs'
import HomePage from './HomePage';
import GettersPage from './GettersPage';
import Dashboard from './DashboardPage';
const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator  screenOptions={{
        headerShown: false
      }}>
        <RootStack.Screen name="HomeScreen" component={HomeScreen}/>
        <RootStack.Screen name="LoginScreen" component={LoginScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <RootStack.Screen name="SignUpConScreen" component={SignUpConScreen}/>
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <RootStack.Screen name="FormGetter" component={FormGetter}/>
        <RootStack.Screen name="FormGiver" component={FormGiver}/>
        <RootStack.Screen name="Tabs" component={Tabs}/>
        <RootStack.Screen name="HomePage" component={HomePage}/>
        <RootStack.Screen name="GettersPage" component={GettersPage}/>
        <RootStack.Screen name="Dashboard" component={Dashboard}/>


    </RootStack.Navigator>
);

export default RootStackScreen;