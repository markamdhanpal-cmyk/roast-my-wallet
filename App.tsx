import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { colors } from './src/theme/colors';
import { initDB } from './src/database/db';
import { useSMSListener } from './src/hooks/useSMSListener';

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function App() {
  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  // Initializes listener only on Android
  useSMSListener();

  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar style="light" backgroundColor={colors.background} />
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
