import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../Screens/homeScreen";
import {ProfileScreen} from "../Screens/profileScreen";
import {New} from "../Screens/new";
import RegisterScreen from '../Screens/RegisterScreen';
import LoginScreen from '../Screens/LoginScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator initialRouteName="homeScreen">
            <Stack.Screen name="homeScreen" component={HomeScreen} />
            <Stack.Screen name="New" component={New} />
            <Stack.Screen name='RegisterScreen' component={RegisterScreen}/>
            <Stack.Screen name='LoginScreen' component={LoginScreen}/>
        </Stack.Navigator>
    );
}

export function RootTabs() {
    return (
        <Tab.Navigator id="MyTabs">
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{ headerShown: false }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Register" component={RegisterScreen} />
            <Tab.Screen name='Login' component={LoginScreen}/>
        </Tab.Navigator>
    );
}

