/**
 * AsyncStorage Helpers
 *
 * Typed helpers for AsyncStorage operations.
 * Per T018: Storage key constants and helpers.
 *
 * @module infrastructure/storage/asyncStorageHelpers
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, type StorageKey } from '@core/constants/paths';
import type { ModelIndex, Model } from '@core/types/model.types';
import type { SceneIndex, SavedScene } from '@core/types/scene.types';

/**
 * App settings stored in AsyncStorage.
 */
export interface AppSettings {
  version: number;
  theme: 'light' | 'dark' | 'system';
  onboardingComplete: boolean;
  lastARSession: number | null;
  analyticsEnabled: boolean;
}

/**
 * Default app settings.
 */
export const DEFAULT_SETTINGS: AppSettings = {
  version: 1,
  theme: 'system',
  onboardingComplete: false,
  lastARSession: null,
  analyticsEnabled: true,
};

/**
 * Default model index.
 */
export const DEFAULT_MODEL_INDEX: ModelIndex = {
  version: 1,
  models: [],
  lastUpdated: Date.now(),
};

/**
 * Default scene index.
 */
export const DEFAULT_SCENE_INDEX: SceneIndex = {
  version: 1,
  scenes: [],
  lastUpdated: Date.now(),
};

/**
 * Storage error class.
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'READ_ERROR'
      | 'WRITE_ERROR'
      | 'PARSE_ERROR'
      | 'VALIDATION_ERROR'
      | 'UNKNOWN',
    public readonly key?: string
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Generic read from AsyncStorage with JSON parsing.
 */
export async function readFromStorage<T>(key: StorageKey, defaultValue: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return defaultValue;
    }
    return JSON.parse(value) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new StorageError(`Invalid JSON in storage for key: ${key}`, 'PARSE_ERROR', key);
    }
    throw new StorageError(
      `Failed to read from storage: ${error instanceof Error ? error.message : String(error)}`,
      'READ_ERROR',
      key
    );
  }
}

/**
 * Generic write to AsyncStorage with JSON serialization.
 */
export async function writeToStorage<T>(key: StorageKey, value: T): Promise<void> {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
  } catch (error) {
    throw new StorageError(
      `Failed to write to storage: ${error instanceof Error ? error.message : String(error)}`,
      'WRITE_ERROR',
      key
    );
  }
}

/**
 * Remove a key from AsyncStorage.
 */
export async function removeFromStorage(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new StorageError(
      `Failed to remove from storage: ${error instanceof Error ? error.message : String(error)}`,
      'WRITE_ERROR',
      key
    );
  }
}

// =============================================================================
// TYPED ACCESSORS
// =============================================================================

/**
 * Get model index from storage.
 */
export async function getModelIndex(): Promise<ModelIndex> {
  return readFromStorage<ModelIndex>(STORAGE_KEYS.MODEL_INDEX, DEFAULT_MODEL_INDEX);
}

/**
 * Save model index to storage.
 */
export async function saveModelIndex(index: ModelIndex): Promise<void> {
  const updated: ModelIndex = {
    ...index,
    lastUpdated: Date.now(),
  };
  await writeToStorage(STORAGE_KEYS.MODEL_INDEX, updated);
}

/**
 * Get scene index from storage.
 */
export async function getSceneIndex(): Promise<SceneIndex> {
  return readFromStorage<SceneIndex>(STORAGE_KEYS.SCENE_INDEX, DEFAULT_SCENE_INDEX);
}

/**
 * Save scene index to storage.
 */
export async function saveSceneIndex(index: SceneIndex): Promise<void> {
  const updated: SceneIndex = {
    ...index,
    lastUpdated: Date.now(),
  };
  await writeToStorage(STORAGE_KEYS.SCENE_INDEX, updated);
}

/**
 * Get app settings from storage.
 */
export async function getSettings(): Promise<AppSettings> {
  return readFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

/**
 * Save app settings to storage.
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  await writeToStorage(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Check if onboarding is complete.
 */
export async function isOnboardingComplete(): Promise<boolean> {
  const settings = await getSettings();
  return settings.onboardingComplete;
}

/**
 * Mark onboarding as complete.
 */
export async function markOnboardingComplete(): Promise<void> {
  const settings = await getSettings();
  await saveSettings({ ...settings, onboardingComplete: true });
}

/**
 * Clear all app data (for development/testing).
 */
export async function clearAllData(): Promise<void> {
  const keys = Object.values(STORAGE_KEYS);
  await AsyncStorage.multiRemove(keys);
}

// =============================================================================
// MODEL HELPERS
// =============================================================================

/**
 * Add a model to the index.
 */
export async function addModelToIndex(model: Model): Promise<void> {
  const index = await getModelIndex();
  index.models.push(model);
  await saveModelIndex(index);
}

/**
 * Update a model in the index.
 */
export async function updateModelInIndex(model: Model): Promise<void> {
  const index = await getModelIndex();
  const idx = index.models.findIndex(m => m.id === model.id);
  if (idx !== -1) {
    index.models[idx] = model;
    await saveModelIndex(index);
  }
}

/**
 * Remove a model from the index.
 */
export async function removeModelFromIndex(modelId: string): Promise<void> {
  const index = await getModelIndex();
  index.models = index.models.filter(m => m.id !== modelId);
  await saveModelIndex(index);
}

// =============================================================================
// SCENE HELPERS
// =============================================================================

/**
 * Add a scene to the index.
 */
export async function addSceneToIndex(scene: SavedScene): Promise<void> {
  const index = await getSceneIndex();
  index.scenes.push(scene);
  await saveSceneIndex(index);
}

/**
 * Update a scene in the index.
 */
export async function updateSceneInIndex(scene: SavedScene): Promise<void> {
  const index = await getSceneIndex();
  const idx = index.scenes.findIndex(s => s.id === scene.id);
  if (idx !== -1) {
    index.scenes[idx] = scene;
    await saveSceneIndex(index);
  }
}

/**
 * Remove a scene from the index.
 */
export async function removeSceneFromIndex(sceneId: string): Promise<void> {
  const index = await getSceneIndex();
  index.scenes = index.scenes.filter(s => s.id !== sceneId);
  await saveSceneIndex(index);
}

// Re-export storage keys
export { STORAGE_KEYS };
