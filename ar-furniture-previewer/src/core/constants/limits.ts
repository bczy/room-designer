/**
 * Storage Limits
 *
 * Enforced limits per FR-046, FR-049.
 *
 * @module core/constants/limits
 */

/**
 * Model storage limits.
 */
export const MODEL_LIMITS = {
  /** Maximum number of models in library (FR-046) */
  MAX_MODELS: 50,

  /** Maximum GLB file size in bytes (50MB per FR-049) */
  MAX_GLB_SIZE_BYTES: 50 * 1024 * 1024,

  /** Maximum thumbnail size in bytes (500KB) */
  MAX_THUMBNAIL_SIZE_BYTES: 500 * 1024,

  /** Thumbnail dimensions (256x256 per FR-016) */
  THUMBNAIL_SIZE: 256,

  /** Maximum model name length */
  MAX_NAME_LENGTH: 100,

  /** Minimum photos for scan (FR-015) */
  MIN_SCAN_PHOTOS: 20,

  /** Recommended photos for scan (FR-011) */
  RECOMMENDED_SCAN_PHOTOS: 25,

  /** Maximum photos for scan (FR-011) */
  MAX_SCAN_PHOTOS: 40,
} as const;

/**
 * Scene storage limits.
 */
export const SCENE_LIMITS = {
  /** Maximum number of saved scenes (FR-046) */
  MAX_SCENES: 20,

  /** Maximum objects per scene (FR-006) */
  MAX_OBJECTS_PER_SCENE: 10,

  /** Maximum scene name length */
  MAX_NAME_LENGTH: 100,

  /** Scene thumbnail max size in bytes */
  MAX_THUMBNAIL_SIZE_BYTES: 500 * 1024,

  /** Scene restore timeout in seconds (SC-008) */
  RESTORE_TIMEOUT_SECONDS: 10,
} as const;

/**
 * AR session limits.
 */
export const AR_LIMITS = {
  /** Minimum scale factor (FR-004) */
  MIN_SCALE: 0.5,

  /** Maximum scale factor (FR-004) */
  MAX_SCALE: 3.0,

  /** Maximum objects in AR view (FR-006) */
  MAX_PLACED_OBJECTS: 10,

  /** Target frame rate */
  TARGET_FPS: 30,

  /** Loading state threshold (ms) - show loading after this */
  LOADING_THRESHOLD_MS: 200,

  /** Model load timeout (ms) for files under 10MB (SC-005) */
  MODEL_LOAD_TIMEOUT_MS: 2000,

  /** Surface detection timeout (SC-002) */
  SURFACE_DETECTION_TIMEOUT_MS: 5000,
} as const;

/**
 * Performance limits per constitution.
 */
export const PERFORMANCE_LIMITS = {
  /** Maximum memory usage in bytes (300MB per SC-010) */
  MAX_MEMORY_BYTES: 300 * 1024 * 1024,

  /** App launch time target in ms (SC-006) */
  LAUNCH_TIME_TARGET_MS: 3000,

  /** Scan processing time in minutes (SC-007) */
  SCAN_PROCESSING_MAX_MINUTES: 5,
} as const;

/**
 * Storage warning thresholds.
 */
export const STORAGE_WARNINGS = {
  /** Show warning at this percentage of model quota */
  MODEL_WARNING_THRESHOLD: 0.8,

  /** Show warning at this percentage of scene quota */
  SCENE_WARNING_THRESHOLD: 0.8,

  /** Low battery warning threshold (FR edge case) */
  LOW_BATTERY_THRESHOLD: 0.2,
} as const;

/**
 * Export formats.
 */
export const EXPORT = {
  /** Scene image export dimensions (FR-031) */
  SCENE_IMAGE_WIDTH: 1920,
  SCENE_IMAGE_HEIGHT: 1080,

  /** Scene export format version */
  SCENE_EXPORT_VERSION: '1.0.0',
} as const;
