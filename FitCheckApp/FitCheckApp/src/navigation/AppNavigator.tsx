import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import GalleryScreen from '../screens/GalleryScreen';
import OutfitDetailScreen from '../screens/OutfitDetailScreen';
import AIAnalysisScreen from '../screens/AIAnalysisScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e1e1e1',
        },
      }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <span>🏠</span>,
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          tabBarLabel: 'Camera',
          tabBarIcon: () => <span>📸</span>,
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Gallery" 
        component={GalleryScreen}
        options={{
          tabBarLabel: 'Gallery',
          tabBarIcon: () => <span>📱</span>,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{gestureEnabled: true}}>
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="OutfitDetail" 
          component={OutfitDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="AIAnalysis" 
          component={AIAnalysisScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;