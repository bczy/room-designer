/**
 * WebView Bridge Contract
 * 
 * Defines the message protocol between React Native and the 8th Wall WebView.
 * All communication uses postMessage with JSON-encoded WebViewMessage objects.
 * 
 * @version 1.0.0
 * @phase 1 - Design
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
// REACT NATIVE → WEBVIEW MESSAGES
// =============================================================================

/** Initialize AR session with configuration */
export type InitARMessage = WebViewMessage<'INIT_AR', {
  /** 8th Wall API key */
  apiKey: string;
  /** Enable VPS if available */
  enableVPS: boolean;
  /** Show debug overlay in development */
  debugMode: boolean;
}>;

/** Load a 3D model into the scene */
export type LoadModelMessage = WebViewMessage<'LOAD_MODEL', {
  /** Model unique identifier */
  modelId: string;
  /** Base64-encoded GLB data */
  glbData: string;
  /** Initial transform (optional) */
  initialTransform?: TransformPayload;
}>;

/** Remove a model from the scene */
export type RemoveModelMessage = WebViewMessage<'REMOVE_MODEL', {
  /** Placed object ID to remove */
  objectId: string;
}>;

/** Update transform of a placed object */
export type UpdateTransformMessage = WebViewMessage<'UPDATE_TRANSFORM', {
  /** Placed object ID */
  objectId: string;
  /** New transform values */
  transform: TransformPayload;
}>;

/** Capture current scene for saving */
export type CaptureSceneMessage = WebViewMessage<'CAPTURE_SCENE', {
  /** Whether to include screenshot */
  includeScreenshot: boolean;
  /** Whether to create VPS anchor */
  createVPSAnchor: boolean;
}>;

/** Restore a saved scene */
export type RestoreSceneMessage = WebViewMessage<'RESTORE_SCENE', {
  /** Scene configuration to restore */
  scene: ScenePayload;
  /** Models data (id → base64 GLB) */
  models: Record<string, string>;
}>;

/** Start 3D scanning mode */
export type StartScanMessage = WebViewMessage<'START_SCAN', {
  /** Scan session ID */
  sessionId: string;
}>;

/** Capture photo during scan */
export type CaptureScanPhotoMessage = WebViewMessage<'CAPTURE_SCAN_PHOTO', {
  /** Photo ID */
  photoId: string;
}>;

/** End scanning and process */
export type EndScanMessage = WebViewMessage<'END_SCAN', {
  /** Session ID to finalize */
  sessionId: string;
}>;

/** Cancel scan in progress */
export type CancelScanMessage = WebViewMessage<'CANCEL_SCAN', {
  /** Session ID to cancel */
  sessionId: string;
}>;

/** Reset AR session */
export type ResetARMessage = WebViewMessage<'RESET_AR', Record<string, never>>;

/** Pause AR session (app backgrounded) */
export type PauseARMessage = WebViewMessage<'PAUSE_AR', Record<string, never>>;

/** Resume AR session (app foregrounded) */
export type ResumeARMessage = WebViewMessage<'RESUME_AR', Record<string, never>>;

// Union of all RN → WebView messages
export type RNToWebViewMessage =
  | InitARMessage
  | LoadModelMessage
  | RemoveModelMessage
  | UpdateTransformMessage
  | CaptureSceneMessage
  | RestoreSceneMessage
  | StartScanMessage
  | CaptureScanPhotoMessage
  | EndScanMessage
  | CancelScanMessage
  | ResetARMessage
  | PauseARMessage
  | ResumeARMessage;

// =============================================================================
// WEBVIEW → REACT NATIVE MESSAGES
// =============================================================================

/** AR session initialized and ready */
export type ARReadyMessage = WebViewMessage<'AR_READY', {
  /** 8th Wall SDK version */
  sdkVersion: string;
  /** VPS availability */
  vpsAvailable: boolean;
  /** Device AR capabilities */
  capabilities: ARCapabilities;
}>;

/** AR initialization failed */
export type ARErrorMessage = WebViewMessage<'AR_ERROR', {
  /** Error code */
  code: ARErrorCode;
  /** Human-readable message */
  message: string;
  /** Whether error is recoverable */
  recoverable: boolean;
}>;

/** Surface detected for placement */
export type SurfaceDetectedMessage = WebViewMessage<'SURFACE_DETECTED', {
  /** Surface type */
  surfaceType: 'horizontal' | 'vertical';
  /** Surface center point */
  position: [number, number, number];
  /** Surface normal vector */
  normal: [number, number, number];
}>;

/** Model placement confirmed */
export type ModelPlacedMessage = WebViewMessage<'MODEL_PLACED', {
  /** Request model ID */
  modelId: string;
  /** Assigned placed object ID */
  objectId: string;
  /** Final placement transform */
  transform: TransformPayload;
}>;

/** Model loading/placement failed */
export type ModelErrorMessage = WebViewMessage<'MODEL_ERROR', {
  /** Model ID that failed */
  modelId: string;
  /** Error code */
  code: ModelErrorCode;
  /** Human-readable message */
  message: string;
}>;

/** Transform updated via gesture */
export type TransformUpdatedMessage = WebViewMessage<'TRANSFORM_UPDATED', {
  /** Object that was transformed */
  objectId: string;
  /** New transform values */
  transform: TransformPayload;
  /** Type of gesture */
  gestureType: 'drag' | 'rotate' | 'scale';
}>;

/** Scene capture complete */
export type SceneCapturedMessage = WebViewMessage<'SCENE_CAPTURED', {
  /** All placed objects with transforms */
  objects: PlacedObjectPayload[];
  /** Screenshot as base64 JPEG */
  screenshot: string | null;
  /** VPS anchor ID if created */
  vpsAnchorId: string | null;
}>;

/** Scene restore complete */
export type SceneRestoredMessage = WebViewMessage<'SCENE_RESTORED', {
  /** Number of objects restored */
  objectCount: number;
  /** Any objects that failed */
  failedObjects: string[];
}>;

/** Scan photo captured */
export type ScanPhotoCapturedMessage = WebViewMessage<'SCAN_PHOTO_CAPTURED', {
  /** Photo ID from request */
  photoId: string;
  /** Base64 image data */
  imageData: string;
  /** Capture angle */
  angle: number;
  /** Quality assessment */
  quality: PhotoQualityPayload;
}>;

/** Scan coverage updated */
export type ScanProgressMessage = WebViewMessage<'SCAN_PROGRESS', {
  /** Session ID */
  sessionId: string;
  /** Photos captured so far */
  photoCount: number;
  /** Coverage percentage 0-100 */
  coverage: number;
  /** Missing angle ranges */
  missingAngles: [number, number][];
}>;

/** Scan processing complete */
export type ScanCompleteMessage = WebViewMessage<'SCAN_COMPLETE', {
  /** Session ID */
  sessionId: string;
  /** Generated GLB as base64 */
  glbData: string;
  /** Model bounding box */
  boundingBox: BoundingBoxPayload;
  /** Estimated vertex count */
  vertexCount: number;
}>;

/** Scan failed */
export type ScanFailedMessage = WebViewMessage<'SCAN_FAILED', {
  /** Session ID */
  sessionId: string;
  /** Error code */
  code: ScanErrorCode;
  /** Human-readable message */
  message: string;
  /** Whether can retry */
  recoverable: boolean;
}>;

/** Tracking state changed */
export type TrackingStateMessage = WebViewMessage<'TRACKING_STATE', {
  /** Current tracking state */
  state: TrackingState;
  /** Reason if limited/not available */
  reason?: TrackingLimitedReason;
}>;

// Union of all WebView → RN messages
export type WebViewToRNMessage =
  | ARReadyMessage
  | ARErrorMessage
  | SurfaceDetectedMessage
  | ModelPlacedMessage
  | ModelErrorMessage
  | TransformUpdatedMessage
  | SceneCapturedMessage
  | SceneRestoredMessage
  | ScanPhotoCapturedMessage
  | ScanProgressMessage
  | ScanCompleteMessage
  | ScanFailedMessage
  | TrackingStateMessage;

// =============================================================================
// SHARED PAYLOAD TYPES
// =============================================================================

export interface TransformPayload {
  position: [number, number, number];
  rotation: [number, number, number, number]; // quaternion
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

export type TrackingState =
  | 'NOT_AVAILABLE'
  | 'LIMITED'
  | 'NORMAL';

export type TrackingLimitedReason =
  | 'INITIALIZING'
  | 'EXCESSIVE_MOTION'
  | 'INSUFFICIENT_FEATURES'
  | 'RELOCALIZING';

// =============================================================================
// BRIDGE INTERFACE
// =============================================================================

/**
 * Interface for the React Native side bridge implementation.
 */
export interface WebViewBridge {
  /** Send message to WebView */
  send(message: RNToWebViewMessage): void;
  
  /** Register handler for WebView messages */
  onMessage(handler: (message: WebViewToRNMessage) => void): () => void;
  
  /** Send message and wait for response */
  sendAndWait<R extends WebViewToRNMessage>(
    message: RNToWebViewMessage,
    responseType: R['type'],
    timeout?: number
  ): Promise<R>;
}

/**
 * Interface for the WebView side bridge implementation.
 */
export interface WebViewBridgeClient {
  /** Send message to React Native */
  send(message: WebViewToRNMessage): void;
  
  /** Register handler for RN messages */
  onMessage(handler: (message: RNToWebViewMessage) => void): () => void;
}

// =============================================================================
// MESSAGE FACTORIES
// =============================================================================

let messageCounter = 0;

/**
 * Create a message with auto-generated ID and timestamp.
 */
export function createMessage<T extends string, P>(
  type: T,
  payload: P
): WebViewMessage<T, P> {
  return {
    type,
    payload,
    messageId: `msg_${Date.now()}_${++messageCounter}`,
    timestamp: Date.now(),
  };
}
