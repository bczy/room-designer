/**
 * Root Navigator
 * 
 * Bottom tab navigation structure per plan.md.
 * Per T021: Create RootNavigator with bottom tabs.
 * 
 * @module app/navigation/RootNavigator
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '@core/constants/theme';

// Placeholder screens - will be replaced with actual implementations
import { ARScreen } from '../screens/ARScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { ScenesScreen } from '../screens/ScenesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

/**
 * Tab parameter list for type safety.
 */
export type RootTabParamList = {
  AR: undefined;
  Library: undefined;
  Scenes: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * Placeholder icon component.
 * Will be replaced with actual icons (Ionicons or custom).
 */
function TabIcon({ name, focused }: { name: string; focused: boolean }): React.ReactElement {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        {name.charAt(0)}
      </Text>
    </View>
  );
}

/**
 * Root navigator component.
 */
export function RootNavigator(): React.ReactElement {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="AR"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: THEME.colors.primary,
          tabBarInactiveTintColor: THEME.colors.textSecondary,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="AR"
          component={ARScreen}
          options={{
            tabBarLabel: 'AR View',
            tabBarIcon: ({ focused }) => <TabIcon name="AR" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarLabel: 'Library',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="Library" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Scenes"
          component={ScenesScreen}
          options={{
            tabBarLabel: 'Scenes',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="Scenes" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="Settings" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.colors.surface,
    borderTopColor: THEME.colors.border,
    borderTopWidth: 1,
    paddingTop: THEME.spacing.xs,
    height: 60,
  },
  tabBarLabel: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: '500',
    marginBottom: THEME.spacing.xs,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconFocused: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  iconText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  iconTextFocused: {
    color: THEME.colors.primary,
  },
});

export default RootNavigator;
