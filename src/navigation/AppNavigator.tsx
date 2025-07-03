import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {Colors, Shadows, BorderRadius} from '../theme';

import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import GalleryScreen from '../screens/GalleryScreen';
import OutfitDetailScreen from '../screens/OutfitDetailScreen';
import AIAnalysisScreen from '../screens/AIAnalysisScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons = {
    Home: focused ? '🏠' : '🏡',
    Camera: focused ? '📸' : '📷',
    Gallery: focused ? '🖼️' : '🖼️',
  };
  
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Text style={[styles.tabIconText, { color: focused ? Colors.primary : Colors.textTertiary }]}>
        {icons[name as keyof typeof icons]}
      </Text>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -4,
        },
        tabBarStyle: [
          styles.tabBar,
          Platform.OS === 'ios' && styles.tabBarIOS,
        ],
        tabBarBackground: () => (
          <View style={styles.tabBarBackground} />
        ),
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          tabBarLabel: 'Camera',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Gallery" 
        component={GalleryScreen}
        options={{
          tabBarLabel: 'Gallery',
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

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 83 : 60,
  },
  tabBarIOS: {
    backgroundColor: 'transparent',
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.glass,
    backdropFilter: 'blur(20px)',
    borderTopWidth: 1,
    borderTopColor: Colors.glass,
    ...Shadows.glass,
  },
  tabIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  tabIconFocused: {
    backgroundColor: Colors.glass,
    transform: [{ scale: 1.1 }],
    ...Shadows.sm,
  },
  tabIconText: {
    fontSize: 20,
  },
});

export default AppNavigator;