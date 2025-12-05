/**
 * Button Component
 *
 * Reusable button with variants and states.
 * Per T029: Create Button component.
 *
 * @module app/components/common/Button
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { THEME } from '@core/constants/theme';

/**
 * Button variants.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Button sizes.
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button props.
 */
export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Button text */
  title: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to show before text */
  icon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
}

/**
 * Get variant styles.
 */
function getVariantStyles(
  variant: ButtonVariant,
  disabled: boolean
): { container: ViewStyle; text: TextStyle } {
  if (disabled) {
    return {
      container: {
        backgroundColor: THEME.colors.surfaceVariant,
        borderWidth: 0,
      },
      text: {
        color: THEME.colors.textDisabled,
      },
    };
  }

  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: THEME.colors.primary,
          borderWidth: 0,
        },
        text: {
          color: '#FFFFFF',
        },
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: THEME.colors.secondary,
          borderWidth: 0,
        },
        text: {
          color: '#FFFFFF',
        },
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: THEME.colors.primary,
        },
        text: {
          color: THEME.colors.primary,
        },
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
        text: {
          color: THEME.colors.primary,
        },
      };
  }
}

/**
 * Get size styles.
 */
function getSizeStyles(size: ButtonSize): {
  container: ViewStyle;
  text: TextStyle;
} {
  switch (size) {
    case 'small':
      return {
        container: {
          paddingVertical: THEME.spacing.xs,
          paddingHorizontal: THEME.spacing.md,
          minHeight: 32,
        },
        text: {
          fontSize: 14,
        },
      };
    case 'medium':
      return {
        container: {
          paddingVertical: THEME.spacing.sm,
          paddingHorizontal: THEME.spacing.lg,
          minHeight: 44,
        },
        text: {
          fontSize: 16,
        },
      };
    case 'large':
      return {
        container: {
          paddingVertical: THEME.spacing.md,
          paddingHorizontal: THEME.spacing.xl,
          minHeight: 52,
        },
        text: {
          fontSize: 18,
        },
      };
  }
}

/**
 * Button component.
 */
export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  style,
  textStyle,
  onPress,
  ...rest
}: ButtonProps): React.ReactElement {
  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(variant, isDisabled);
  const sizeStyles = getSizeStyles(size);

  const handlePress = useCallback(
    (event: Parameters<NonNullable<typeof onPress>>[0]) => {
      if (!isDisabled && onPress) {
        onPress(event);
      }
    },
    [isDisabled, onPress]
  );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.text.color} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              variantStyles.text,
              sizeStyles.text,
              icon !== null && styles.textWithIcon,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.borderRadius.xxl,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: THEME.spacing.sm,
  },
});

export default Button;
