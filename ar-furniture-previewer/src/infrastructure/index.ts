/**
 * Infrastructure Barrel Export
 * 
 * Central export for infrastructure modules.
 * 
 * @module infrastructure
 */

// Filesystem
export {
  FileSystemAdapter,
  fileSystem,
} from './filesystem/FileSystemAdapter';

// Storage
export {
  getItem,
  setItem,
  removeItem,
  clear,
  getModelIndex,
  setModelIndex,
  getSceneIndex,
  setSceneIndex,
  getAppSettings,
  setAppSettings,
} from './storage/asyncStorageHelpers';

// Permissions
export {
  checkPermission,
  requestPermission,
  requestMultiplePermissions,
  checkARPermissions,
  requestARPermissions,
  usePermissions,
} from './permissions';

export type {
  AppPermission,
  PermissionStatus,
  PermissionResult,
} from './permissions';

// WebView
export { WebViewBridge } from './webview/ARWebViewBridge';
export { MessageHandlerRegistry } from './webview/messageHandlers';
