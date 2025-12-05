/**
 * Modal Component
 *
 * Reusable modal dialog.
 * Per T031: Create Modal component.
 *
 * @module app/components/common/Modal
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { THEME } from '@core/constants/theme';

/**
 * Modal props.
 */
export interface ModalProps {
  /** Visibility state */
  visible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Content */
  children: React.ReactNode;
  /** Show close button */
  showCloseButton?: boolean;
  /** Close on backdrop press */
  closeOnBackdrop?: boolean;
  /** Animation type */
  animationType?: 'none' | 'slide' | 'fade';
  /** Custom content style */
  contentStyle?: ViewStyle;
  /** Full screen modal */
  fullScreen?: boolean;
}

/**
 * Modal component.
 */
export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  animationType = 'fade',
  contentStyle,
  fullScreen = false,
}: ModalProps): React.ReactElement {
  const handleBackdropPress = (): void => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
        <View style={[styles.container, fullScreen && styles.fullScreen, contentStyle]}>
          {(title !== null || showCloseButton) && (
            <View style={styles.header}>
              {title !== null && <Text style={styles.title}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

/**
 * Modal action bar for buttons.
 * Uses margin-based spacing for React Native compatibility (gap is only supported in RN 0.71+).
 */
export function ModalActions({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}): React.ReactElement {
  // Apply margin to children for spacing (gap is not supported in older React Native versions)
  const spacedChildren = React.Children.map(children, (child, index) => {
    if (index === 0 || !React.isValidElement(child)) {
      return child;
    }
    // Clone child with added marginLeft for spacing between action buttons
    // Flatten any existing style (handles object, array, or undefined)
    type ChildWithStyle = React.ReactElement<{ style?: ViewStyle | ViewStyle[] }>;
    const typedChild = child as ChildWithStyle;
    const existingStyle = typedChild.props?.style;
    const flattenedStyle = existingStyle ? StyleSheet.flatten(existingStyle) : undefined;
    const combinedStyle: ViewStyle = { marginLeft: THEME.spacing.sm, ...flattenedStyle };
    return React.cloneElement(typedChild, { style: combinedStyle });
  });

  return <View style={[styles.actions, style]}>{spacedChildren}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.colors.overlay,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    ...THEME.shadows.lg,
  },
  fullScreen: {
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  title: {
    flex: 1,
    fontSize: THEME.typography.h3.fontSize,
    fontWeight: THEME.typography.h3.fontWeight,
    color: THEME.colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: THEME.spacing.sm,
  },
  closeButtonText: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
  },
  content: {
    padding: THEME.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: THEME.spacing.lg,
  },
});

export default Modal;
