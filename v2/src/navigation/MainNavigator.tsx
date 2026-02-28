import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { DiaryScreen } from '../screens/DiaryScreen';
import { DiaryEditorScreen } from '../screens/DiaryEditorScreen';
import { RecommendationsScreen } from '../screens/RecommendationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { InterestsScreen } from '../screens/InterestsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Stack for Home tab (Home → DiaryEditor) ─────────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary,
        headerTitleStyle: { ...Typography.h4, color: Colors.textPrimary },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Dear Diary' }} />
      <Stack.Screen name="DiaryEditor" component={DiaryEditorScreen} options={{ title: 'Diary Entry' }} />
      <Stack.Screen name="Interests" component={InterestsScreen} options={{ title: 'My Interests' }} />
    </Stack.Navigator>
  );
}

// ─── Stack for Diary tab ─────────────────────────────────────────────────────
function DiaryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary,
        headerTitleStyle: { ...Typography.h4, color: Colors.textPrimary },
      }}
    >
      <Stack.Screen name="DiaryList" component={DiaryScreen} options={{ title: 'My Diary' }} />
      <Stack.Screen name="DiaryEditor" component={DiaryEditorScreen} options={{ title: 'Diary Entry' }} />
    </Stack.Navigator>
  );
}

// ─── Stack for Profile tab ────────────────────────────────────────────────────
function ProfileStack({ navigation: rootNav }: { navigation: any }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary,
        headerTitleStyle: { ...Typography.h4, color: Colors.textPrimary },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        options={{ title: 'Profile' }}
      >
        {(props) => <ProfileScreen {...props} navigation={{ ...props.navigation, replace: rootNav.replace }} />}
      </Stack.Screen>
      <Stack.Screen name="Interests" component={InterestsScreen} options={{ title: 'My Interests' }} />
    </Stack.Navigator>
  );
}

// ─── Tab icon helper ──────────────────────────────────────────────────────────
function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

// ─── Main tab navigator ───────────────────────────────────────────────────────
export function MainNavigator({ navigation }: { navigation: any }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: { ...Typography.caption, marginBottom: 4 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="💡" focused={focused} />,
          headerShown: true,
          headerTitle: 'Recommendations',
          headerStyle: { backgroundColor: Colors.surface },
          headerTitleStyle: { ...Typography.h4, color: Colors.textPrimary },
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      >
        {(props) => <ProfileStack {...props} navigation={{ ...props.navigation, replace: navigation.replace }} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 62,
    paddingTop: 6,
  },
});
