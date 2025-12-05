/**
 * AR Store
 *
 * Zustand store for AR session state.
 * Per T026: Create useARStore skeleton.
 *
 * @module core/stores/useARStore
 */

import { create } from 'zustand';
import type { ARCapabilities, ARErrorCode } from '@core/types/webview.types';
import { AR_LIMITS } from '@core/constants/limits';

/**
 * AR session status.
 */
export type ARStatus = 'IDLE' | 'INITIALIZING' | 'READY' | 'SURFACE_DETECTED' | 'ERROR';

/**
 * Placement mode for AR interactions.
 */
export type PlacementMode = 'NONE' | 'PLACING' | 'ADJUSTING';

/**
 * AR store state.
 */
interface ARState {
  // Session state
  status: ARStatus;
  isInitialized: boolean;
  error: ARErrorCode | null;
  errorMessage: string | null;

  // Capabilities
  capabilities: ARCapabilities | null;

  // Surface detection
  surfaceDetected: boolean;
  surfaceNormal: [number, number, number] | null;

  // Placement mode
  placementMode: PlacementMode;
  modelToPlace: string | null;

  // Performance
  currentFps: number;
  memoryUsage: number; // bytes

  // WebView state
  webViewReady: boolean;
}

/**
 * AR store actions.
 */
interface ARActions {
  // Session lifecycle
  setStatus: (status: ARStatus) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: ARErrorCode | null, message?: string) => void;
  clearError: () => void;

  // Capabilities
  setCapabilities: (capabilities: ARCapabilities) => void;

  // Surface detection
  setSurfaceDetected: (detected: boolean, normal?: [number, number, number]) => void;
  clearSurface: () => void;

  // Placement mode
  startPlacing: (modelId: string) => void;
  startAdjusting: () => void;
  cancelPlacement: () => void;
  confirmPlacement: () => void;

  // Performance monitoring
  updatePerformance: (fps: number, memoryBytes: number) => void;
  isPerformanceOk: () => boolean;

  // WebView state
  setWebViewReady: (ready: boolean) => void;

  // Queries
  canPlaceObject: () => boolean;
  isSessionActive: () => boolean;

  // Reset
  reset: () => void;
}

type ARStore = ARState & ARActions;

const initialState: ARState = {
  status: 'IDLE',
  isInitialized: false,
  error: null,
  errorMessage: null,
  capabilities: null,
  surfaceDetected: false,
  surfaceNormal: null,
  placementMode: 'NONE',
  modelToPlace: null,
  currentFps: 0,
  memoryUsage: 0,
  webViewReady: false,
};

/**
 * AR store.
 */
export const useARStore = create<ARStore>()((set, get) => ({
  ...initialState,

  setStatus: status => set({ status }),

  setInitialized: isInitialized =>
    set({
      isInitialized,
      status: isInitialized ? 'READY' : 'IDLE',
    }),

  setError: (error, errorMessage) =>
    set({
      error,
      errorMessage: errorMessage ?? null,
      status: error !== null ? 'ERROR' : get().status,
    }),

  clearError: () =>
    set({
      error: null,
      errorMessage: null,
      status: get().isInitialized ? 'READY' : 'IDLE',
    }),

  setCapabilities: capabilities => set({ capabilities }),

  setSurfaceDetected: (surfaceDetected, surfaceNormal) =>
    set({
      surfaceDetected,
      surfaceNormal: surfaceNormal ?? null,
      status: surfaceDetected ? 'SURFACE_DETECTED' : 'READY',
    }),

  clearSurface: () =>
    set({
      surfaceDetected: false,
      surfaceNormal: null,
      status: get().isInitialized ? 'READY' : 'IDLE',
    }),

  startPlacing: modelId =>
    set({
      placementMode: 'PLACING',
      modelToPlace: modelId,
    }),

  startAdjusting: () =>
    set({
      placementMode: 'ADJUSTING',
      modelToPlace: null,
    }),

  cancelPlacement: () =>
    set({
      placementMode: 'NONE',
      modelToPlace: null,
    }),

  confirmPlacement: () =>
    set({
      placementMode: 'NONE',
      modelToPlace: null,
    }),

  updatePerformance: (currentFps, memoryUsage) => set({ currentFps, memoryUsage }),

  isPerformanceOk: () => {
    const { currentFps, memoryUsage } = get();
    return (
      currentFps >= AR_LIMITS.TARGET_FPS * 0.8 && // Allow 20% below target
      memoryUsage < AR_LIMITS.MAX_PLACED_OBJECTS * 30 * 1024 * 1024 // ~30MB per object estimate
    );
  },

  setWebViewReady: webViewReady =>
    set({
      webViewReady,
      status: webViewReady ? 'INITIALIZING' : 'IDLE',
    }),

  canPlaceObject: () => {
    const state = get();
    return (
      state.isInitialized &&
      state.surfaceDetected &&
      state.error === null &&
      state.placementMode === 'NONE'
    );
  },

  isSessionActive: () => {
    const state = get();
    return state.isInitialized && state.webViewReady && state.error === null;
  },

  reset: () => set(initialState),
}));

/**
 * Hook to check if AR is ready for placement.
 */
export function useARReady(): boolean {
  return useARStore(
    state =>
      state.isInitialized && state.webViewReady && state.surfaceDetected && state.error === null
  );
}

/**
 * Hook to get current AR error with message.
 */
export function useARError(): { code: ARErrorCode; message: string } | null {
  return useARStore(state =>
    state.error !== null
      ? { code: state.error, message: state.errorMessage ?? 'Unknown error' }
      : null
  );
}

/**
 * Hook to get placement status.
 */
export function usePlacementMode(): {
  mode: PlacementMode;
  modelId: string | null;
} {
  return useARStore(state => ({
    mode: state.placementMode,
    modelId: state.modelToPlace,
  }));
}
