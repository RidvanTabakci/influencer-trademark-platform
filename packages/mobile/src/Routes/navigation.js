import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../Screens/homeScreen';
import {ProfileScreen} from '../Screens/profileScreen';
import { New } from '../Screens/new';
import RegisterScreen from '../Screens/RegisterScreen';
import LoginScreen from '../Screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="homeScreen" component={HomeScreen} />
      <Stack.Screen name="New" component={New} />
    </Stack.Navigator>
  );
}

function RootTabs({ setIsLoggedIn }) {
    return (
<Tab.Navigator
  screenOptions={{
    tabBarStyle: { backgroundColor: '#1c1c1e', borderTopColor: '#333' },
    tabBarActiveTintColor: '#7c58c2',
    tabBarInactiveTintColor: '#aaa',
    headerShown: false,
  }}
>
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Profile">
          {props => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }
  

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
    {isLoggedIn ? (
      <RootTabs setIsLoggedIn={setIsLoggedIn} />  // ✅ burada props geçiyoruz
    ) : (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {props => <RegisterScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
      </Stack.Navigator>
    )}
  </NavigationContainer>
  );
}
