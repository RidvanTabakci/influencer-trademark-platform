import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthProvider } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import ProfileScreen from '../Screens/profileScreen';
import CampaignListScreen from '../Screens/CampaignListScreen';
import CampaignDetailScreen from '../Screens/CampaignDetailScreen';
import CreateCampaignScreen from '../Screens/CreateCampaignScreen';
import EditCampaignScreen from '../Screens/EditCampaignScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Campaigns') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7c58c2',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#1c1c1e',
          borderTopColor: '#2c2c2e',
        },
        headerStyle: {
          backgroundColor: '#1c1c1e',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen
        name="Campaigns"
        component={CampaignListScreen}
        options={{ title: 'Kampanyalar' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1c1c1e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Kayıt Ol' }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CampaignDetail"
            component={CampaignDetailScreen}
            options={{ title: 'Kampanya Detayı' }}
          />
          <Stack.Screen
            name="CreateCampaign"
            component={CreateCampaignScreen}
            options={{ title: 'Yeni Kampanya' }}
          />
          <Stack.Screen
            name="EditCampaign"
            component={EditCampaignScreen}
            options={{ title: 'Kampanya Düzenle' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default Navigation;
