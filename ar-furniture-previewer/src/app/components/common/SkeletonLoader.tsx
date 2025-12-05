/**
 * SkeletonLoader Component
 * 
 * Loading placeholder with shimmer animation.
 * Per T032: Create SkeletonLoader component.
 * 
 * @module app/components/common/SkeletonLoader
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  Easing,
  DimensionValue,
} from 'react-native';
import { THEME } from '@core/constants/theme';

/**
 * Skeleton variant.
 */
export type SkeletonVariant = 'text' | 'rectangular' | 'circular';

/**
 * SkeletonLoader props.
 */
export interface SkeletonLoaderProps {
  /** Shape variant */
  variant?: SkeletonVariant;
  /** Width (number for pixels, string for percentage) */
  width?: DimensionValue;
  /** Height (number for pixels, string for percentage) */
  height?: DimensionValue;
  /** Custom border radius */
  borderRadius?: number;
  /** Enable shimmer animation */
  animated?: boolean;
  /** Custom style */
  style?: ViewStyle | undefined;
}

/**
 * Get variant styles.
 */
function getVariantStyles(
  variant: SkeletonVariant,
  width?: DimensionValue,
  height?: DimensionValue
): ViewStyle {
  switch (variant) {
    case 'text':
      return {
        width: width ?? '100%',
        height: height ?? 16,
        borderRadius: THEME.borderRadius.sm,
      };
    case 'rectangular':
      return {
        width: width ?? '100%',
        height: height ?? 100,
        borderRadius: THEME.borderRadius.md,
      };
    case 'circular':
      const size = typeof width === 'number' ? width : 48;
      return {
        width: size,
        height: size,
        borderRadius: size / 2,
      };
  }
}

/**
 * SkeletonLoader component.
 */
export function SkeletonLoader({
  variant = 'text',
  width,
  height,
  borderRadius,
  animated = true,
  style,
}: SkeletonLoaderProps): React.ReactElement {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const animation = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [animated, shimmerValue]);

  const variantStyles = getVariantStyles(variant, width, height);

  const opacity = shimmerValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        variantStyles,
        borderRadius != null && { borderRadius },
        animated && { opacity },
        style,
      ]}
    />
  );
}

/**
 * Multiple skeleton lines for text blocks.
 */
export function SkeletonText({
  lines = 3,
  spacing = THEME.spacing.sm,
  lastLineWidth = '60%' as DimensionValue,
  style,
}: {
  lines?: number;
  spacing?: number;
  lastLineWidth?: DimensionValue;
  style?: ViewStyle;
}): React.ReactElement {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : '100%'}
          style={index > 0 ? { marginTop: spacing } : undefined}
        />
      ))}
    </View>
  );
}

/**
 * Skeleton for card layout.
 */
export function SkeletonCard({
  showImage = true,
  imageHeight = 150,
  lines = 2,
  style,
}: {
  showImage?: boolean;
  imageHeight?: number;
  lines?: number;
  style?: ViewStyle;
}): React.ReactElement {
  return (
    <View style={[styles.card, style]}>
      {showImage && (
        <SkeletonLoader
          variant="rectangular"
          height={imageHeight}
          style={styles.cardImage}
        />
      )}
      <View style={styles.cardContent}>
        <SkeletonText lines={lines} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: THEME.colors.surfaceVariant,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    ...THEME.shadows.sm,
  },
  cardImage: {
    borderRadius: 0,
  },
  cardContent: {
    padding: THEME.spacing.md,
  },
});

export default SkeletonLoader;
