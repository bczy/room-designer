/**
 * Scene Types
 *
 * Types for saved AR scenes and placed objects.
 * Based on data-model.md specification.
 *
 * @module core/types/scene.types
 */

/**
 * Anchor strategy for scene persistence.
 */
export type AnchorType =
  | 'VPS' // Lightship VPS persistent anchor
  | 'DEVICE_RELATIVE' // Relative to device at save time
  | 'MANUAL'; // User positions manually on restore

/**
 * 3D transformation data for placed objects.
 */
export interface Transform {
  /** Position in AR space [x, y, z] */
  position: [number, number, number];
  /** Rotation as quaternion [w, x, y, z] */
  rotation: [number, number, number, number];
  /** Scale factors [x, y, z] (0.5-3.0 per FR-004) */
  scale: [number, number, number];
}

/**
 * A furniture model placed in an AR scene.
 */
export interface PlacedObject {
  /** Unique instance identifier (UUID) */
  id: string;
  /** Reference to model in library */
  modelId: string;
  /** Position, rotation, scale */
  transform: Transform;
  /** When placed (Unix timestamp) */
  placedAt: number;
}

/**
 * A saved AR scene configuration.
 */
export interface SavedScene {
  /** Unique identifier (UUID) */
  id: string;
  /** Display name (1-100 chars) */
  name: string;
  /** Scene screenshot as base64 JPEG (< 500KB) */
  thumbnailBase64: string;
  /** Lightship VPS anchor ID or null */
  anchorId: string | null;
  /** Anchor strategy used */
  anchorType: AnchorType;
  /** Placed furniture objects (max 10 per FR-006) */
  objects: PlacedObject[];
  /** Creation timestamp (Unix ms) */
  createdAt: number;
  /** Last modification timestamp (Unix ms) */
  updatedAt: number;
}

/**
 * Scene index for AsyncStorage persistence.
 */
export interface SceneIndex {
  /** Schema version for migrations */
  version: number;
  /** All saved scenes */
  scenes: SavedScene[];
  /** Timestamp of last change */
  lastUpdated: number;
}

/**
 * Active AR session state.
 */
export interface ActiveScene {
  /** Currently placed objects */
  objects: PlacedObject[];
  /** Currently selected object ID or null */
  selectedObjectId: string | null;
  /** Scene has unsaved changes */
  isDirty: boolean;
}

/**
 * Scene export format (for sharing).
 * Per FR-032: JSON format.
 */
export interface SceneExport {
  /** Export format version */
  version: string;
  /** Scene name */
  name: string;
  /** Placed objects with model references */
  objects: Array<{
    modelId: string;
    modelName: string;
    transform: Transform;
  }>;
  /** Export timestamp */
  exportedAt: number;
}

// ============================================================================
// Scanning Types
// ============================================================================

/**
 * Status of a scanning session.
 */
export type ScanStatus =
  | 'PREPARING'
  | 'CAPTURING'
  | 'PROCESSING'
  | 'COMPLETE'
  | 'FAILED'
  | 'CANCELLED';

/**
 * Quality rating for a captured photo.
 */
export type PhotoQuality = 'GOOD' | 'BLUR' | 'DARK' | 'OVEREXPOSED';

/**
 * A captured photo during scanning.
 */
export interface CapturedPhoto {
  /** Unique photo identifier */
  photoId: string;
  /** Angle in degrees from starting position */
  angle: number;
  /** Quality assessment */
  quality: PhotoQuality;
  /** Capture timestamp */
  timestamp: number;
}

/**
 * Active object scanning session.
 * Per FR-011 to FR-015.
 */
export interface ScanSession {
  /** Unique session identifier */
  sessionId: string;
  /** Current status */
  status: ScanStatus;
  /** Captured photos */
  photos: CapturedPhoto[];
  /** Coverage percentage (0-100) */
  coverage: number;
  /** Missing angle ranges as [start, end] pairs */
  missingAngles: [number, number][];
  /** Session start timestamp */
  startedAt: number;
}

/**
 * Scan progress for UI updates.
 */
export interface ScanProgress {
  /** Number of photos captured */
  photoCount: number;
  /** Coverage percentage */
  coverage: number;
  /** Missing angle ranges */
  missingAngles: [number, number][];
}
