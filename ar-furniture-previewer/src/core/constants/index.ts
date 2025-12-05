/**
 * Constants Exports
 *
 * Barrel export for all constants.
 *
 * @module core/constants
 */

export {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
  ANIMATION,
  Z_INDEX,
  THEME,
} from './theme';
export type { ThemeMode } from './theme';

export {
  MODEL_LIMITS,
  SCENE_LIMITS,
  AR_LIMITS,
  PERFORMANCE_LIMITS,
  STORAGE_WARNINGS,
  EXPORT,
} from './limits';

export {
  BASE_PATHS,
  APP_PATHS,
  getModelPaths,
  getScenePaths,
  getScanSessionPaths,
  getImportStagingPath,
  BUNDLED_ASSETS,
  STORAGE_KEYS,
} from './paths';

export type { StorageKey } from './paths';
