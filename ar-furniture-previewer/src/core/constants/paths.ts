/**
 * File Paths
 * 
 * Storage paths per research.md and FR-018.
 * 
 * @module core/constants/paths
 */

import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

/**
 * Base directories for app storage.
 */
export const BASE_PATHS = {
  /** Main app documents directory */
  get documents(): string {
    return RNFS.DocumentDirectoryPath;
  },

  /** Temporary files directory */
  get temp(): string {
    return RNFS.TemporaryDirectoryPath;
  },

  /** Cache directory */
  get cache(): string {
    return RNFS.CachesDirectoryPath;
  },

  /** Bundled assets directory */
  get bundle(): string {
    return Platform.OS === 'ios'
      ? RNFS.MainBundlePath
      : RNFS.DocumentDirectoryPath;
  },
} as const;

/**
 * AR Furniture app directory structure.
 * Per FR-018: /Documents/ARFurniture/
 */
export const APP_PATHS = {
  /** Root app directory */
  get root(): string {
    return `${BASE_PATHS.documents}/ARFurniture`;
  },

  /** Models storage directory */
  get models(): string {
    return `${this.root}/models`;
  },

  /** Model thumbnails directory */
  get modelThumbnails(): string {
    return `${this.root}/models/thumbnails`;
  },

  /** Saved scenes directory */
  get scenes(): string {
    return `${this.root}/scenes`;
  },

  /** Scene thumbnails directory */
  get sceneThumbnails(): string {
    return `${this.root}/scenes/thumbnails`;
  },

  /** Temporary scan sessions directory */
  get scanSessions(): string {
    return `${BASE_PATHS.temp}/scan_sessions`;
  },

  /** Import staging directory */
  get importStaging(): string {
    return `${BASE_PATHS.temp}/import_staging`;
  },
} as const;

/**
 * Generate file paths for a specific model.
 */
export function getModelPaths(modelId: string): {
  glb: string;
  thumbnail: string;
} {
  return {
    glb: `${APP_PATHS.models}/${modelId}.glb`,
    thumbnail: `${APP_PATHS.modelThumbnails}/${modelId}.jpg`,
  };
}

/**
 * Generate file paths for a specific scene.
 */
export function getScenePaths(sceneId: string): {
  thumbnail: string;
} {
  return {
    thumbnail: `${APP_PATHS.sceneThumbnails}/${sceneId}.jpg`,
  };
}

/**
 * Generate paths for a scan session.
 */
export function getScanSessionPaths(sessionId: string): {
  root: string;
  photo: (photoId: string) => string;
  result: string;
} {
  const sessionRoot = `${APP_PATHS.scanSessions}/${sessionId}`;
  return {
    root: sessionRoot,
    photo: (photoId: string) => `${sessionRoot}/${photoId}.jpg`,
    result: `${sessionRoot}/result.glb`,
  };
}

/**
 * Generate import staging path.
 */
export function getImportStagingPath(filename: string): string {
  return `${APP_PATHS.importStaging}/${filename}`;
}

/**
 * Bundled assets paths (readonly).
 */
export const BUNDLED_ASSETS = {
  /** Bundled models directory */
  get models(): string {
    return Platform.OS === 'ios'
      ? `${RNFS.MainBundlePath}/assets/models`
      : 'asset:/assets/models';
  },

  /** Get path for a bundled model */
  model: (filename: string): string => {
    return Platform.OS === 'ios'
      ? `${RNFS.MainBundlePath}/assets/models/${filename}`
      : `asset:/assets/models/${filename}`;
  },

  /** Get path for a bundled thumbnail */
  thumbnail: (filename: string): string => {
    return Platform.OS === 'ios'
      ? `${RNFS.MainBundlePath}/assets/models/thumbnails/${filename}`
      : `asset:/assets/models/thumbnails/${filename}`;
  },
} as const;

/**
 * AsyncStorage keys for metadata.
 */
export const STORAGE_KEYS = {
  /** Model index */
  MODEL_INDEX: '@ar_furniture/model_index',
  /** Scene index */
  SCENE_INDEX: '@ar_furniture/scene_index',
  /** App settings */
  SETTINGS: '@ar_furniture/settings',
  /** Onboarding completion flag */
  ONBOARDING: '@ar_furniture/onboarding_complete',
  /** Last AR session timestamp */
  LAST_AR_SESSION: '@ar_furniture/last_ar_session',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
