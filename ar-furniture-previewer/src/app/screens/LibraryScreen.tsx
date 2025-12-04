/**
 * Library Screen
 * 
 * Model library management screen.
 * Per T022: Create placeholder screen components.
 * 
 * @module app/screens/LibraryScreen
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { THEME } from '@core/constants/theme';

/**
 * Library screen placeholder component.
 * Will display model grid with import/scan options.
 */
export function LibraryScreen(): React.ReactElement {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Model Library</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.title}>Your Models</Text>
          <Text style={styles.subtitle}>
            GLB models and scanned objects appear here
          </Text>
          <Text style={styles.description}>
            • Import GLB files{'\n'}
            • Scan real objects{'\n'}
            • Bundled furniture{'\n'}
            • Search & filter
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
  header: {
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },
  headerTitle: {
    fontSize: THEME.typography.h2.fontSize,
    fontWeight: THEME.typography.h2.fontWeight,
    color: THEME.colors.text,
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
    fontSize: THEME.typography.h1.fontSize,
    fontWeight: THEME.typography.h1.fontWeight,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: THEME.typography.body.fontSize,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: THEME.typography.caption.fontSize,
    color: THEME.colors.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
  },
});

export default LibraryScreen;
