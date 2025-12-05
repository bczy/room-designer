/**
 * WebView Bridge Types
 *
 * Message protocol between React Native and 8th Wall WebView.
 * Based on contracts/webview-bridge.ts specification.
 *
 * @module core/types/webview.types
 */

// =============================================================================
// MESSAGE ENVELOPE
// =============================================================================

/**
 * Base message structure for all bridge communication.
 */
export interface WebViewMessage<T extends string = string, P = unknown> {
  /** Message type identifier */
  type: T;
  /** Message payload */
  payload: P;
  /** Unique message ID for request/response correlation */
  messageId: string;
  /** Unix timestamp when message was created */
  timestamp: number;
}

// =============================================================================
// SHARED PAYLOAD TYPES
// =============================================================================

export interface TransformPayload {
  position: [number, number, number];
  rotation: [number, number, number, number]; // quaternion [w, x, y, z]
  scale: [number, number, number];
}

export interface PlacedObjectPayload {
  objectId: string;
  modelId: string;
  transform: TransformPayload;
}

export interface ScenePayload {
  sceneId: string;
  vpsAnchorId: string | null;
  anchorType: 'VPS' | 'DEVICE_RELATIVE' | 'MANUAL';
  objects: PlacedObjectPayload[];
}

export interface BoundingBoxPayload {
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  size: [number, number, number];
}

export interface PhotoQualityPayload {
  quality: 'GOOD' | 'BLUR' | 'DARK' | 'OVEREXPOSED';
  score: number; // 0-1 confidence
}

export interface ARCapabilities {
  surfaceDetection: boolean;
  lightEstimation: boolean;
  vps: boolean;
  scanning: boolean;
  maxObjects: number;
}

// =============================================================================
// ERROR CODES
// =============================================================================

export type ARErrorCode =
  | 'CAMERA_PERMISSION_DENIED'
  | 'WEBGL_NOT_SUPPORTED'
  | 'XRWEB_INIT_FAILED'
  | 'VPS_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export type ModelErrorCode =
  | 'INVALID_GLB'
  | 'MODEL_TOO_LARGE'
  | 'TEXTURE_ERROR'
  | 'PLACEMENT_FAILED'
  | 'MAX_OBJECTS_REACHED'
  | 'UNKNOWN';

export type ScanErrorCode =
  | 'INSUFFICIENT_PHOTOS'
  | 'POOR_COVERAGE'
  | 'PROCESSING_FAILED'
  | 'INSUFFICIENT_LIGHTING'
  | 'OBJECT_TOO_LARGE'
  | 'TIMEOUT'
  | 'UNKNOWN';

// =============================================================================
// TRACKING STATE
// =============================================================================

export type TrackingState = 'NOT_AVAILABLE' | 'LIMITED' | 'NORMAL';

export type TrackingLimitedReason =
  | 'INITIALIZING'
  | 'EXCESSIVE_MOTION'
  | 'INSUFFICIENT_FEATURES'
  | 'RELOCALIZING';

// =============================================================================
// REACT NATIVE → WEBVIEW MESSAGE TYPES
// =============================================================================

export type RNToWebViewMessageType =
  | 'INIT_AR'
  | 'LOAD_MODEL'
  | 'REMOVE_MODEL'
  | 'UPDATE_TRANSFORM'
  | 'CAPTURE_SCENE'
  | 'RESTORE_SCENE'
  | 'START_SCAN'
  | 'CAPTURE_SCAN_PHOTO'
  | 'END_SCAN'
  | 'CANCEL_SCAN'
  | 'RESET_AR'
  | 'PAUSE_AR'
  | 'RESUME_AR';

// =============================================================================
// WEBVIEW → REACT NATIVE MESSAGE TYPES
// =============================================================================

export type WebViewToRNMessageType =
  | 'AR_READY'
  | 'AR_ERROR'
  | 'SURFACE_DETECTED'
  | 'MODEL_PLACED'
  | 'MODEL_ERROR'
  | 'TRANSFORM_UPDATED'
  | 'SCENE_CAPTURED'
  | 'SCENE_RESTORED'
  | 'SCAN_PHOTO_CAPTURED'
  | 'SCAN_PROGRESS'
  | 'SCAN_COMPLETE'
  | 'SCAN_FAILED'
  | 'TRACKING_STATE';

// =============================================================================
// MESSAGE PAYLOADS (RN → WebView)
// =============================================================================

export interface InitARPayload {
  apiKey: string;
  enableVPS: boolean;
  debugMode: boolean;
}

export interface LoadModelPayload {
  modelId: string;
  glbData: string;
  initialTransform?: TransformPayload;
}

export interface RemoveModelPayload {
  objectId: string;
}

export interface UpdateTransformPayload {
  objectId: string;
  transform: TransformPayload;
}

export interface CaptureScenePayload {
  includeScreenshot: boolean;
  createVPSAnchor: boolean;
}

export interface RestoreScenePayload {
  scene: ScenePayload;
  models: Record<string, string>;
}

export interface StartScanPayload {
  sessionId: string;
}

export interface CaptureScanPhotoPayload {
  photoId: string;
}

export interface EndScanPayload {
  sessionId: string;
}

export interface CancelScanPayload {
  sessionId: string;
}

// =============================================================================
// MESSAGE PAYLOADS (WebView → RN)
// =============================================================================

export interface ARReadyPayload {
  sdkVersion: string;
  vpsAvailable: boolean;
  capabilities: ARCapabilities;
}

export interface ARErrorPayload {
  code: ARErrorCode;
  message: string;
  recoverable: boolean;
}

export interface SurfaceDetectedPayload {
  surfaceType: 'horizontal' | 'vertical';
  position: [number, number, number];
  normal: [number, number, number];
}

export interface ModelPlacedPayload {
  modelId: string;
  objectId: string;
  transform: TransformPayload;
}

export interface ModelErrorPayload {
  modelId: string;
  code: ModelErrorCode;
  message: string;
}

export interface TransformUpdatedPayload {
  objectId: string;
  transform: TransformPayload;
  gestureType: 'drag' | 'rotate' | 'scale';
}

export interface SceneCapturedPayload {
  objects: PlacedObjectPayload[];
  screenshot: string | null;
  vpsAnchorId: string | null;
}

export interface SceneRestoredPayload {
  objectCount: number;
  failedObjects: string[];
}

export interface ScanPhotoCapturedPayload {
  photoId: string;
  imageData: string;
  angle: number;
  quality: PhotoQualityPayload;
}

export interface ScanProgressPayload {
  sessionId: string;
  photoCount: number;
  coverage: number;
  missingAngles: [number, number][];
}

export interface ScanCompletePayload {
  sessionId: string;
  glbData: string;
  boundingBox: BoundingBoxPayload;
  vertexCount: number;
}

export interface ScanFailedPayload {
  sessionId: string;
  code: ScanErrorCode;
  message: string;
  recoverable: boolean;
}

export interface TrackingStatePayload {
  state: TrackingState;
  reason?: TrackingLimitedReason;
}

// =============================================================================
// BRIDGE INTERFACE
// =============================================================================

/**
 * Handler for incoming WebView messages.
 */
export type WebViewMessageHandler = (message: WebViewMessage) => void;

/**
 * Unsubscribe function returned by message subscriptions.
 */
export type Unsubscribe = () => void;
