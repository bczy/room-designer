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
  SCAN_LIMITS,
  STORAGE_KEYS,
} from './limits';

export {
  APP_PATHS,
  FILE_PATHS,
  getModelPath,
  getThumbnailPath,
  getScanSessionPaths,
} from './paths';
