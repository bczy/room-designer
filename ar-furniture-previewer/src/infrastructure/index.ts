/**
 * Infrastructure Barrel Export
 *
 * Central export for infrastructure modules.
 *
 * @module infrastructure
 */

// Filesystem
export { FileSystemAdapter, fileSystem } from './filesystem/FileSystemAdapter';

// Storage
export {
  readFromStorage,
  writeToStorage,
  removeFromStorage,
  getModelIndex,
  saveModelIndex,
  getSceneIndex,
  saveSceneIndex,
  getSettings,
  saveSettings,
  isOnboardingComplete,
  markOnboardingComplete,
  clearAllData,
  addModelToIndex,
  updateModelInIndex,
  removeModelFromIndex,
  addSceneToIndex,
  updateSceneInIndex,
  removeSceneFromIndex,
  DEFAULT_SETTINGS,
  DEFAULT_MODEL_INDEX,
  DEFAULT_SCENE_INDEX,
  StorageError,
  STORAGE_KEYS,
} from './storage/asyncStorageHelpers';

export type { AppSettings } from './storage/asyncStorageHelpers';

// Permissions
export {
  checkPermission,
  requestPermission,
  requestMultiplePermissions,
  checkARPermissions,
  requestARPermissions,
  usePermissions,
} from './permissions';

export type { AppPermission, PermissionStatus, PermissionResult } from './permissions';

// WebView
export { ARWebViewBridge, arWebViewBridge } from './webview/ARWebViewBridge';
export { messageHandlers } from './webview/messageHandlers';
export type { TypedMessageHandler } from './webview/messageHandlers';
