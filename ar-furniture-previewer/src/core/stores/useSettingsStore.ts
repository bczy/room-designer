/**
 * Settings Store
 *
 * Zustand store for app settings and onboarding state.
 * Per T023: Create useSettingsStore.
 *
 * @module core/stores/useSettingsStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from '@core/constants/theme';

/**
 * Settings state.
 */
interface SettingsState {
  // Theme
  theme: ThemeMode;

  // Onboarding
  onboardingComplete: boolean;

  // Session
  lastARSession: number | null;

  // Analytics
  analyticsEnabled: boolean;

  // Loading state
  isHydrated: boolean;
}

/**
 * Settings actions.
 */
interface SettingsActions {
  // Theme
  setTheme: (theme: ThemeMode) => void;

  // Onboarding
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Session
  updateLastARSession: () => void;

  // Analytics
  setAnalyticsEnabled: (enabled: boolean) => void;

  // Hydration
  setHydrated: () => void;

  // Reset
  reset: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const initialState: SettingsState = {
  theme: 'system',
  onboardingComplete: false,
  lastARSession: null,
  analyticsEnabled: true,
  isHydrated: false,
};

/**
 * Settings store with persistence.
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      ...initialState,

      setTheme: theme => set({ theme }),

      completeOnboarding: () => set({ onboardingComplete: true }),

      resetOnboarding: () => set({ onboardingComplete: false }),

      updateLastARSession: () => set({ lastARSession: Date.now() }),

      setAnalyticsEnabled: enabled => set({ analyticsEnabled: enabled }),

      setHydrated: () => set({ isHydrated: true }),

      reset: () => set(initialState),
    }),
    {
      name: 'ar-furniture-settings',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
      partialize: state => ({
        theme: state.theme,
        onboardingComplete: state.onboardingComplete,
        lastARSession: state.lastARSession,
        analyticsEnabled: state.analyticsEnabled,
      }),
    }
  )
);

/**
 * Hook to check if settings are loaded.
 */
export function useSettingsHydrated(): boolean {
  return useSettingsStore(state => state.isHydrated);
}

/**
 * Hook to get current theme.
 */
export function useTheme(): ThemeMode {
  return useSettingsStore(state => state.theme);
}

/**
 * Hook to check if onboarding is complete.
 */
export function useOnboardingComplete(): boolean {
  return useSettingsStore(state => state.onboardingComplete);
}
