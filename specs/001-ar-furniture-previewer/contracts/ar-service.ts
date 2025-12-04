/**
 * AR Service Contract
 * 
 * Defines the interface for AR operations exposed to React Native.
 * This wraps the WebView bridge with a more ergonomic API.
 * 
 * @version 1.0.0
 * @phase 1 - Design
 */

import type {
  TransformPayload,
  ARCapabilities,
  TrackingState,
  TrackingLimitedReason,
  ARErrorCode,
  ModelErrorCode,
  ScanErrorCode,
  BoundingBoxPayload,
} from './webview-bridge';

// =============================================================================
// AR SESSION STATE
// =============================================================================

export type ARSessionState =
  | 'UNINITIALIZED'
  | 'INITIALIZING'
  | 'READY'
  | 'PAUSED'
  | 'ERROR';

export interface ARSessionInfo {
  state: ARSessionState;
  capabilities: ARCapabilities | null;
  trackingState: TrackingState;
  trackingLimitedReason?: TrackingLimitedReason;
  error?: ARError;
}

export interface ARError {
  code: ARErrorCode;
  message: string;
  recoverable: boolean;
}

// =============================================================================
// PLACED OBJECT
// =============================================================================

export interface ARPlacedObject {
  /** Unique object instance ID */
  objectId: string;
  /** Reference to model in library */
  modelId: string;
  /** Current transform in AR space */
  transform: TransformPayload;
  /** Whether object is currently selected */
  isSelected: boolean;
}

// =============================================================================
// SURFACE DETECTION
// =============================================================================

export interface DetectedSurface {
  type: 'horizontal' | 'vertical';
  position: [number, number, number];
  normal: [number, number, number];
  /** Confidence score 0-1 */
  confidence: number;
}

// =============================================================================
// AR SERVICE INTERFACE
// =============================================================================

/**
 * Main AR service interface for React Native.
 */
export interface ARService {
  // =========================================================================
  // SESSION LIFECYCLE
  // =========================================================================

  /**
   * Initialize AR session.
   * Loads 8th Wall in WebView and starts camera.
   */
  initialize(config: ARInitConfig): Promise<void>;

  /**
   * Pause AR session (app backgrounded).
   */
  pause(): Promise<void>;

  /**
   * Resume AR session (app foregrounded).
   */
  resume(): Promise<void>;

  /**
   * Reset AR session (clear all objects, reset tracking).
   */
  reset(): Promise<void>;

  /**
   * Destroy AR session and cleanup resources.
   */
  destroy(): Promise<void>;

  /**
   * Get current session info.
   */
  getSessionInfo(): ARSessionInfo;

  // =========================================================================
  // MODEL PLACEMENT
  // =========================================================================

  /**
   * Place a model in AR at detected surface.
   * Returns once model is placed and visible.
   * 
   * @throws ModelPlacementError on failure
   */
  placeModel(params: PlaceModelParams): Promise<ARPlacedObject>;

  /**
   * Remove a placed object from the scene.
   */
  removeObject(objectId: string): Promise<void>;

  /**
   * Update transform of a placed object.
   */
  updateTransform(objectId: string, transform: Partial<TransformPayload>): Promise<void>;

  /**
   * Select an object for manipulation.
   */
  selectObject(objectId: string | null): Promise<void>;

  /**
   * Get all currently placed objects.
   */
  getPlacedObjects(): ARPlacedObject[];

  /**
   * Get object count in scene.
   */
  getObjectCount(): number;

  /**
   * Check if can add more objects.
   */
  canAddObject(): boolean;

  // =========================================================================
  // SCENE OPERATIONS
  // =========================================================================

  /**
   * Capture current scene for saving.
   */
  captureScene(options?: CaptureSceneOptions): Promise<CapturedScene>;

  /**
   * Restore a saved scene.
   */
  restoreScene(params: RestoreSceneParams): Promise<RestoreSceneResult>;

  // =========================================================================
  // 3D SCANNING
  // =========================================================================

  /**
   * Start a 3D scanning session.
   */
  startScan(): Promise<ScanSession>;

  /**
   * Capture a photo during scanning.
   */
  capturePhoto(): Promise<CapturedPhoto>;

  /**
   * End scan and process captured photos.
   */
  endScan(): Promise<ScanResult>;

  /**
   * Cancel scan in progress.
   */
  cancelScan(): Promise<void>;

  /**
   * Get current scan session if active.
   */
  getActiveScanSession(): ScanSession | null;

  // =========================================================================
  // EVENT SUBSCRIPTIONS
  // =========================================================================

  /**
   * Subscribe to session state changes.
   */
  onSessionStateChange(callback: (info: ARSessionInfo) => void): Unsubscribe;

  /**
   * Subscribe to tracking state changes.
   */
  onTrackingStateChange(callback: (state: TrackingState, reason?: TrackingLimitedReason) => void): Unsubscribe;

  /**
   * Subscribe to surface detection events.
   */
  onSurfaceDetected(callback: (surface: DetectedSurface) => void): Unsubscribe;

  /**
   * Subscribe to object selection changes.
   */
  onObjectSelected(callback: (objectId: string | null) => void): Unsubscribe;

  /**
   * Subscribe to transform updates from gestures.
   */
  onTransformUpdated(callback: (objectId: string, transform: TransformPayload, gestureType: GestureType) => void): Unsubscribe;

  /**
   * Subscribe to scan progress updates.
   */
  onScanProgress(callback: (progress: ScanProgress) => void): Unsubscribe;
}

export type Unsubscribe = () => void;
export type GestureType = 'drag' | 'rotate' | 'scale';

// =============================================================================
// INITIALIZATION
// =============================================================================

export interface ARInitConfig {
  /** 8th Wall API key */
  apiKey: string;
  /** Enable VPS if available */
  enableVPS?: boolean;
  /** Show debug overlay */
  debugMode?: boolean;
}

// =============================================================================
// MODEL PLACEMENT
// =============================================================================

export interface PlaceModelParams {
  /** Model ID from library */
  modelId: string;
  /** GLB data as base64 */
  glbData: string;
  /** Initial transform (optional, places at surface if not provided) */
  initialTransform?: TransformPayload;
}

export interface ModelPlacementError extends Error {
  code: ModelErrorCode;
}

// =============================================================================
// SCENE CAPTURE & RESTORE
// =============================================================================

export interface CaptureSceneOptions {
  /** Include screenshot in capture */
  includeScreenshot?: boolean;
  /** Attempt to create VPS anchor */
  createVPSAnchor?: boolean;
}

export interface CapturedScene {
  /** All placed objects with transforms */
  objects: ARPlacedObject[];
  /** Screenshot as base64 JPEG (if requested) */
  screenshot: string | null;
  /** VPS anchor ID (if created) */
  vpsAnchorId: string | null;
}

export interface RestoreSceneParams {
  /** Scene configuration to restore */
  sceneConfig: SavedSceneConfig;
  /** Models to load (modelId → base64 GLB) */
  models: Record<string, string>;
}

export interface SavedSceneConfig {
  sceneId: string;
  vpsAnchorId: string | null;
  anchorType: 'VPS' | 'DEVICE_RELATIVE' | 'MANUAL';
  objects: Array<{
    objectId: string;
    modelId: string;
    transform: TransformPayload;
  }>;
}

export interface RestoreSceneResult {
  /** Objects successfully restored */
  restoredObjects: ARPlacedObject[];
  /** Model IDs that failed to restore */
  failedModelIds: string[];
  /** Whether VPS anchor was used */
  usedVPSAnchor: boolean;
}

// =============================================================================
// 3D SCANNING
// =============================================================================

export interface ScanSession {
  sessionId: string;
  status: ScanStatus;
  photos: CapturedPhoto[];
  coverage: number;
  missingAngles: [number, number][];
  startedAt: number;
}

export type ScanStatus =
  | 'PREPARING'
  | 'CAPTURING'
  | 'PROCESSING'
  | 'COMPLETE'
  | 'FAILED'
  | 'CANCELLED';

export interface CapturedPhoto {
  photoId: string;
  angle: number;
  quality: PhotoQuality;
  timestamp: number;
}

export type PhotoQuality = 'GOOD' | 'BLUR' | 'DARK' | 'OVEREXPOSED';

export interface ScanProgress {
  photoCount: number;
  coverage: number;
  missingAngles: [number, number][];
  canFinish: boolean;
}

export interface ScanResult {
  /** Generated GLB as base64 */
  glbData: string;
  /** Model bounding box */
  boundingBox: BoundingBoxPayload;
  /** Estimated vertex count */
  vertexCount: number;
}

export interface ScanError extends Error {
  code: ScanErrorCode;
  recoverable: boolean;
}

// =============================================================================
// AR SERVICE FACTORY
// =============================================================================

/**
 * WebView reference type (platform-agnostic).
 */
export interface WebViewRef {
  postMessage: (message: string) => void;
}

/**
 * Create AR service instance.
 */
export type CreateARService = (webViewRef: { current: WebViewRef | null }) => ARService;
