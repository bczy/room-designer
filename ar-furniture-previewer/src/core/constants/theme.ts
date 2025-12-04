/**
 * Theme Constants
 * 
 * Design system values per FR-036, FR-037, FR-038.
 * 
 * @module core/constants/theme
 */

/**
 * Color palette per FR-036.
 */
export const COLORS = {
  // Primary colors
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Secondary colors
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',

  // Semantic colors
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',

  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',

  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',

  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',

  // Neutral colors (light theme)
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceVariant: '#F3F4F6',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textDisabled: '#9CA3AF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Neutral colors (dark theme)
  dark: {
    background: '#111827',
    surface: '#1F2937',
    surfaceVariant: '#374151',
    border: '#4B5563',
    borderLight: '#374151',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textDisabled: '#6B7280',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

/**
 * Spacing scale per FR-038 (4px base unit).
 */
export const SPACING = {
  /** 0px */
  none: 0,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 24px */
  xl: 24,
  /** 32px */
  xxl: 32,
  /** 48px */
  xxxl: 48,
} as const;

/**
 * Border radius per FR-038.
 */
export const BORDER_RADIUS = {
  /** 0px */
  none: 0,
  /** 4px */
  sm: 4,
  /** 8px - Cards */
  md: 8,
  /** 12px */
  lg: 12,
  /** 16px */
  xl: 16,
  /** 24px - Buttons */
  xxl: 24,
  /** Full circle */
  full: 9999,
} as const;

/**
 * Typography scale.
 */
export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

/**
 * Shadow styles.
 */
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

/**
 * Animation durations (ms).
 */
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Z-index scale.
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
} as const;

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Convenience theme object for quick access.
 * Uses light theme colors by default.
 */
export const THEME = {
  colors: {
    primary: COLORS.primary,
    primaryLight: COLORS.primaryLight,
    primaryDark: COLORS.primaryDark,
    secondary: COLORS.secondary,
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
    info: COLORS.info,
    background: COLORS.light.background,
    surface: COLORS.light.surface,
    surfaceVariant: COLORS.light.surfaceVariant,
    border: COLORS.light.border,
    text: COLORS.light.textPrimary,
    textSecondary: COLORS.light.textSecondary,
    textDisabled: COLORS.light.textDisabled,
    overlay: COLORS.light.overlay,
    primaryContainer: `${COLORS.primary}20`, // 20% opacity
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: {
    h1: {
      fontSize: TYPOGRAPHY.fontSize.xxl,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      lineHeight: TYPOGRAPHY.fontSize.xxl * TYPOGRAPHY.lineHeight.tight,
    },
    h2: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      lineHeight: TYPOGRAPHY.fontSize.xl * TYPOGRAPHY.lineHeight.tight,
    },
    h3: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.normal,
    },
    body: {
      fontSize: TYPOGRAPHY.fontSize.md,
      fontWeight: TYPOGRAPHY.fontWeight.regular,
      lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.normal,
    },
    caption: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.regular,
      lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
    },
    button: {
      fontSize: TYPOGRAPHY.fontSize.md,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.tight,
    },
  },
  shadows: SHADOWS,
  animation: ANIMATION,
  zIndex: Z_INDEX,
} as const;
