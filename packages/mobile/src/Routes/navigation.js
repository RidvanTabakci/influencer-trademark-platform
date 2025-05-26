import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import ProfileScreen from '../Screens/profileScreen';
import UserProfileScreen from '../Screens/UserProfileScreen';
import CampaignListScreen from '../Screens/CampaignListScreen';
import CampaignDetailScreen from '../Screens/CampaignDetailScreen';
import CreateCampaignScreen from '../Screens/CreateCampaignScreen';
import EditCampaignScreen from '../Screens/EditCampaignScreen';
import HomeIcon from '../Assets/icons/home.png';
import UserIcon from '../Assets/icons/user.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;
          if (route.name === 'Campaigns') {
            iconSource = HomeIcon;
          } else if (route.name === 'Profile') {
            iconSource = UserIcon;
          }
          return (
            <Image
              source={iconSource}
              style={{
                width: size,
                height: size,
                tintColor: color,
                opacity: focused ? 1 : 0.7,
              }}
              resizeMode="contain"
            />
          );
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
          <Stack.Screen
            name="UserProfile"
            component={UserProfileScreen}
            options={{ title: 'Kullanıcı Profili' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default Navigation;
