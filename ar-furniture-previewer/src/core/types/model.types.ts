/**
 * Model Types
 * 
 * Core types for 3D furniture models in the library.
 * Based on data-model.md specification.
 * 
 * @module core/types/model.types
 */

/**
 * Furniture category enumeration.
 * Per FR-020: Chair, Table, Sofa, Cabinet, Lamp, Custom
 */
export type ModelCategory =
  | 'CHAIR'
  | 'TABLE'
  | 'SOFA'
  | 'CABINET'
  | 'LAMP'
  | 'CUSTOM';

/**
 * Axis-aligned bounding box for model dimensions.
 */
export interface BoundingBox {
  /** Minimum corner coordinates [x, y, z] */
  min: [number, number, number];
  /** Maximum corner coordinates [x, y, z] */
  max: [number, number, number];
  /** Center point coordinates [x, y, z] */
  center: [number, number, number];
  /** Dimensions [width, height, depth] */
  size: [number, number, number];
}

/**
 * Technical metadata extracted from GLB file.
 */
export interface ModelMetadata {
  /** File size in bytes (max 50MB per FR-049) */
  fileSize: number;
  /** Total vertex count */
  vertexCount: number;
  /** Largest texture dimensions (format: "WxH") or null */
  textureResolution: string | null;
  /** Whether model contains animations */
  hasAnimations: boolean;
  /** Model bounding box */
  boundingBox: BoundingBox;
}

/**
 * Represents a 3D furniture model in the user's library.
 */
export interface Model {
  /** Unique identifier (UUID) */
  id: string;
  /** Display name (1-100 chars) */
  name: string;
  /** Path to GLB file */
  glbPath: string;
  /** Path to 256x256 JPEG thumbnail */
  thumbnailPath: string;
  /** Furniture category */
  category: ModelCategory;
  /** True for pre-loaded bundled models (cannot be deleted) */
  isBundled: boolean;
  /** Technical metadata */
  metadata: ModelMetadata;
  /** Creation timestamp (Unix ms) */
  createdAt: number;
  /** Last AR placement timestamp or null */
  lastUsedAt: number | null;
}

/**
 * Model index for AsyncStorage persistence.
 */
export interface ModelIndex {
  /** Schema version for migrations */
  version: number;
  /** All models in library */
  models: Model[];
  /** Timestamp of last change */
  lastUpdated: number;
}

/**
 * Sort options for model library.
 * Per FR-022: Name, Date, Size, Category
 */
export type ModelSortField = 'name' | 'createdAt' | 'fileSize' | 'category';

/**
 * Sort direction.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Filter options for model library.
 */
export interface ModelFilter {
  /** Filter by category */
  category?: ModelCategory;
  /** Search by name (case-insensitive) */
  searchQuery?: string;
  /** Include bundled models */
  includeBundled?: boolean;
}
