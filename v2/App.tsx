import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { SplashScreen } from './src/screens/SplashScreen';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { MainNavigator } from './src/navigation/MainNavigator';
import { Colors } from './src/theme';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <NavigationContainer>
        <StatusBar style="auto" backgroundColor={Colors.primary} />
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Auth" component={AuthNavigator} />
          <RootStack.Screen name="Main" component={MainNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
