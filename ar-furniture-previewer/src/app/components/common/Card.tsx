/**
 * Card Component
 * 
 * Reusable card container with variants.
 * Per T030: Create Card component.
 * 
 * @module app/components/common/Card
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { THEME } from '@core/constants/theme';

/**
 * Card variants.
 */
export type CardVariant = 'elevated' | 'outlined' | 'filled';

/**
 * Card props.
 */
export interface CardProps {
  /** Visual variant */
  variant?: CardVariant;
  /** Enable press interaction */
  onPress?: () => void;
  /** Custom padding */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Custom style */
  style?: ViewStyle;
  /** Children content */
  children: React.ReactNode;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}

/**
 * Get padding value.
 */
function getPadding(padding: CardProps['padding']): number {
  switch (padding) {
    case 'none':
      return 0;
    case 'small':
      return THEME.spacing.sm;
    case 'medium':
      return THEME.spacing.md;
    case 'large':
      return THEME.spacing.lg;
    default:
      return THEME.spacing.md;
  }
}

/**
 * Get variant styles.
 */
function getVariantStyles(variant: CardVariant): ViewStyle {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: THEME.colors.surface,
        ...THEME.shadows.md,
      };
    case 'outlined':
      return {
        backgroundColor: THEME.colors.surface,
        borderWidth: 1,
        borderColor: THEME.colors.border,
      };
    case 'filled':
      return {
        backgroundColor: THEME.colors.surfaceVariant,
      };
  }
}

/**
 * Card component.
 */
export function Card({
  variant = 'elevated',
  onPress,
  padding = 'medium',
  style,
  children,
  accessibilityLabel,
  testID,
}: CardProps): React.ReactElement {
  const variantStyles = getVariantStyles(variant);
  const paddingValue = getPadding(padding);

  const cardStyle: ViewStyle = {
    ...styles.container,
    ...variantStyles,
    padding: paddingValue,
    ...(style as object),
  };

  if (onPress != null) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} accessibilityLabel={accessibilityLabel} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
  },
});

export default Card;
