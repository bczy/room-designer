/**
 * AR Screen
 * 
 * Main AR view screen with 8th Wall WebView.
 * Per T022: Create placeholder screen components.
 * 
 * @module app/screens/ARScreen
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { THEME } from '@core/constants/theme';

/**
 * AR screen placeholder component.
 * Will contain WebView with 8th Wall AR experience.
 */
export function ARScreen(): React.ReactElement {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.title}>AR View</Text>
          <Text style={styles.subtitle}>
            8th Wall WebView will be rendered here
          </Text>
          <Text style={styles.description}>
            • Surface detection{'\n'}
            • Model placement{'\n'}
            • Gesture controls{'\n'}
            • Real-time preview
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  placeholder: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.border,
    borderStyle: 'dashed',
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  description: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
  },
});

export default ARScreen;
