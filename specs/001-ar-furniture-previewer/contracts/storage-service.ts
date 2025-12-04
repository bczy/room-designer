/**
 * Storage Service Contract
 * 
 * Defines the interface for local storage operations including
 * AsyncStorage metadata and react-native-fs file operations.
 * 
 * @version 1.0.0
 * @phase 1 - Design
 */

// =============================================================================
// STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  MODEL_INDEX: '@ar_furniture/model_index',
  SCENE_INDEX: '@ar_furniture/scene_index',
  SETTINGS: '@ar_furniture/settings',
  ONBOARDING: '@ar_furniture/onboarding_complete',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// =============================================================================
// FILE PATHS
// =============================================================================

/**
 * Get paths for model storage.
 */
export interface ModelFilePaths {
  /** Base directory for all models */
  modelsDir: string;
  /** GLB file path for a model */
  glbPath(modelId: string): string;
  /** Thumbnail path for a model */
  thumbnailPath(modelId: string): string;
}

/**
 * Get paths for scene storage.
 */
export interface SceneFilePaths {
  /** Base directory for all scenes */
  scenesDir: string;
  /** Thumbnail path for a scene */
  thumbnailPath(sceneId: string): string;
}

/**
 * Get paths for temporary files.
 */
export interface TempFilePaths {
  /** Temp directory */
  tempDir: string;
  /** Scan session directory */
  scanSessionDir(sessionId: string): string;
  /** Import staging path */
  importStagingPath(filename: string): string;
}

// =============================================================================
// MODEL STORAGE TYPES
// =============================================================================

export interface StoredModel {
  id: string;
  name: string;
  glbPath: string;
  thumbnailPath: string;
  category: ModelCategory;
  isBundled: boolean;
  metadata: ModelMetadata;
  createdAt: number;
  lastUsedAt: number | null;
}

export type ModelCategory =
  | 'CHAIR'
  | 'TABLE'
  | 'SOFA'
  | 'CABINET'
  | 'LAMP'
  | 'CUSTOM';

export interface ModelMetadata {
  fileSize: number;
  vertexCount: number;
  textureResolution: string | null;
  hasAnimations: boolean;
  boundingBox: BoundingBox;
}

export interface BoundingBox {
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  size: [number, number, number];
}

export interface ModelIndex {
  version: number;
  models: StoredModel[];
  lastUpdated: number;
}

// =============================================================================
// SCENE STORAGE TYPES
// =============================================================================

export interface StoredScene {
  id: string;
  name: string;
  thumbnailBase64: string;
  anchorId: string | null;
  anchorType: AnchorType;
  objects: PlacedObject[];
  createdAt: number;
  updatedAt: number;
}

export type AnchorType = 'VPS' | 'DEVICE_RELATIVE' | 'MANUAL';

export interface PlacedObject {
  id: string;
  modelId: string;
  transform: Transform;
  placedAt: number;
}

export interface Transform {
  position: [number, number, number];
  rotation: [number, number, number, number];
  scale: [number, number, number];
}

export interface SceneIndex {
  version: number;
  scenes: StoredScene[];
  lastUpdated: number;
}

// =============================================================================
// SETTINGS TYPES
// =============================================================================

export interface AppSettings {
  version: number;
  theme: 'light' | 'dark' | 'system';
  onboardingComplete: boolean;
  lastARSession: number | null;
  analyticsEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  version: 1,
  theme: 'system',
  onboardingComplete: false,
  lastARSession: null,
  analyticsEnabled: true,
};

// =============================================================================
// STORAGE LIMITS
// =============================================================================

export const STORAGE_LIMITS = {
  /** Maximum number of models in library */
  MAX_MODELS: 50,
  /** Maximum number of saved scenes */
  MAX_SCENES: 20,
  /** Maximum objects per scene */
  MAX_OBJECTS_PER_SCENE: 10,
  /** Maximum GLB file size in bytes (50MB) */
  MAX_GLB_SIZE: 50 * 1024 * 1024,
  /** Maximum thumbnail size in bytes (500KB) */
  MAX_THUMBNAIL_SIZE: 500 * 1024,
  /** Storage quota threshold percentage for warning */
  STORAGE_WARNING_THRESHOLD: 0.8,
} as const;

// =============================================================================
// ERROR TYPES
// =============================================================================

export type StorageErrorCode =
  | 'QUOTA_EXCEEDED'
  | 'FILE_NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'INVALID_DATA'
  | 'MIGRATION_FAILED'
  | 'CORRUPTED_INDEX'
  | 'IO_ERROR'
  | 'UNKNOWN';

export interface StorageError extends Error {
  code: StorageErrorCode;
  details?: Record<string, unknown>;
}

export function createStorageError(
  code: StorageErrorCode,
  message: string,
  details?: Record<string, unknown>
): StorageError {
  const error = new Error(message) as StorageError;
  error.code = code;
  error.details = details;
  return error;
}

// =============================================================================
// MODEL STORAGE SERVICE
// =============================================================================

/**
 * Service for managing furniture model storage.
 */
export interface ModelStorageService {
  /**
   * Initialize storage, run migrations if needed.
   */
  initialize(): Promise<void>;

  /**
   * Get all stored models.
   */
  getAllModels(): Promise<StoredModel[]>;

  /**
   * Get a single model by ID.
   */
  getModel(id: string): Promise<StoredModel | null>;

  /**
   * Import a new model from file path.
   * Validates GLB, extracts metadata, generates thumbnail.
   * 
   * @throws QUOTA_EXCEEDED if at MAX_MODELS limit
   * @throws INVALID_DATA if GLB is invalid or too large
   */
  importModel(params: ImportModelParams): Promise<StoredModel>;

  /**
   * Save a scanned model.
   * 
   * @throws QUOTA_EXCEEDED if at MAX_MODELS limit
   */
  saveScannedModel(params: SaveScannedModelParams): Promise<StoredModel>;

  /**
   * Update model metadata (e.g., name, lastUsedAt).
   */
  updateModel(id: string, updates: Partial<Pick<StoredModel, 'name' | 'lastUsedAt'>>): Promise<StoredModel>;

  /**
   * Delete a model and its files.
   * 
   * @throws Error if model is bundled
   */
  deleteModel(id: string): Promise<void>;

  /**
   * Check if storage quota allows another model.
   */
  canAddModel(): Promise<boolean>;

  /**
   * Get current storage usage statistics.
   */
  getStorageStats(): Promise<StorageStats>;
}

export interface ImportModelParams {
  /** Path to source GLB file */
  sourcePath: string;
  /** Display name for model */
  name: string;
  /** Category assignment */
  category: ModelCategory;
}

export interface SaveScannedModelParams {
  /** Base64-encoded GLB data */
  glbData: string;
  /** Display name */
  name: string;
  /** Pre-computed metadata */
  metadata: ModelMetadata;
}

export interface StorageStats {
  /** Number of models stored */
  modelCount: number;
  /** Number of scenes stored */
  sceneCount: number;
  /** Total bytes used by models */
  modelsSize: number;
  /** Total bytes used by scenes */
  scenesSize: number;
  /** Available storage bytes (approximate) */
  availableSpace: number;
  /** Whether nearing quota limit */
  nearingLimit: boolean;
}

// =============================================================================
// SCENE STORAGE SERVICE
// =============================================================================

/**
 * Service for managing saved scene storage.
 */
export interface SceneStorageService {
  /**
   * Initialize storage, run migrations if needed.
   */
  initialize(): Promise<void>;

  /**
   * Get all saved scenes.
   */
  getAllScenes(): Promise<StoredScene[]>;

  /**
   * Get a single scene by ID.
   */
  getScene(id: string): Promise<StoredScene | null>;

  /**
   * Save a new scene.
   * 
   * @throws QUOTA_EXCEEDED if at MAX_SCENES limit
   */
  saveScene(params: SaveSceneParams): Promise<StoredScene>;

  /**
   * Update an existing scene.
   */
  updateScene(id: string, updates: UpdateSceneParams): Promise<StoredScene>;

  /**
   * Delete a scene.
   */
  deleteScene(id: string): Promise<void>;

  /**
   * Check if storage quota allows another scene.
   */
  canAddScene(): Promise<boolean>;
}

export interface SaveSceneParams {
  /** Scene display name */
  name: string;
  /** Screenshot as base64 JPEG */
  thumbnailBase64: string;
  /** VPS anchor ID if available */
  anchorId: string | null;
  /** Anchor type used */
  anchorType: AnchorType;
  /** Placed objects in scene */
  objects: Omit<PlacedObject, 'id' | 'placedAt'>[];
}

export interface UpdateSceneParams {
  name?: string;
  thumbnailBase64?: string;
  objects?: Omit<PlacedObject, 'id' | 'placedAt'>[];
}

// =============================================================================
// SETTINGS SERVICE
// =============================================================================

/**
 * Service for managing app settings.
 */
export interface SettingsService {
  /**
   * Get current settings, returns defaults if not set.
   */
  getSettings(): Promise<AppSettings>;

  /**
   * Update settings.
   */
  updateSettings(updates: Partial<AppSettings>): Promise<AppSettings>;

  /**
   * Reset to default settings.
   */
  resetSettings(): Promise<AppSettings>;

  /**
   * Check if onboarding is complete.
   */
  isOnboardingComplete(): Promise<boolean>;

  /**
   * Mark onboarding as complete.
   */
  completeOnboarding(): Promise<void>;
}

// =============================================================================
// BUNDLED ASSETS SERVICE
// =============================================================================

/**
 * Service for managing bundled/pre-loaded assets.
 */
export interface BundledAssetsService {
  /**
   * Get list of bundled model IDs.
   */
  getBundledModelIds(): string[];

  /**
   * Copy bundled models to storage on first launch.
   */
  initializeBundledModels(): Promise<void>;

  /**
   * Check if bundled models have been initialized.
   */
  areBundledModelsInitialized(): Promise<boolean>;
}

// =============================================================================
// MIGRATION
// =============================================================================

export interface StorageMigration {
  /** Version this migration upgrades from */
  fromVersion: number;
  /** Version this migration upgrades to */
  toVersion: number;
  /** Migration function */
  migrate(data: unknown): Promise<unknown>;
}
