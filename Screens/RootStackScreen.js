import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignupScreen';
import ForgotPassword from './ForgotPassword';
import FormGetter from './FormGetter';
import FormGiver from './FormGiver';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator  screenOptions={{
        headerShown: false
      }}>
        <RootStack.Screen name="HomeScreen" component={HomeScreen}/>
        <RootStack.Screen name="LoginScreen" component={LoginScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <RootStack.Screen name="FormGetter" component={FormGetter}/>
        <RootStack.Screen name="FormGiver" component={FormGiver}/>


    </RootStack.Navigator>
);

export default RootStackScreen;