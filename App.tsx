import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import DashboardScreen from './src/screens/DashboardScreen';
import RoastDetailScreen from './src/screens/RoastDetailScreen';
import { initDB } from './src/database/db';
import { useSMSListener } from './src/hooks/useSMSListener';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  // Initializes listener only on Android
  useSMSListener();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // The "Figma Swipe" effect
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="RoastDetail" component={RoastDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}