/**
 * Storage Exports
 * 
 * Barrel export for storage utilities.
 * 
 * @module infrastructure/storage
 */

export {
  // Core storage operations
  readFromStorage,
  writeToStorage,
  removeFromStorage,
  // Typed accessors
  getModelIndex,
  saveModelIndex,
  getSceneIndex,
  saveSceneIndex,
  getSettings,
  saveSettings,
  // Helpers
  isOnboardingComplete,
  markOnboardingComplete,
  clearAllData,
  // Model helpers
  addModelToIndex,
  updateModelInIndex,
  removeModelFromIndex,
  // Scene helpers
  addSceneToIndex,
  updateSceneInIndex,
  removeSceneFromIndex,
  // Defaults and types
  DEFAULT_SETTINGS,
  DEFAULT_MODEL_INDEX,
  DEFAULT_SCENE_INDEX,
  StorageError,
  STORAGE_KEYS,
} from './asyncStorageHelpers';

export type { AppSettings } from './asyncStorageHelpers';
