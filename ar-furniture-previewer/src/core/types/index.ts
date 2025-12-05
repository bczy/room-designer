/**
 * Type Definitions Barrel Export
 * 
 * Central export for all core types.
 * 
 * @module core/types
 */

// Model types
export type {
  ModelCategory,
  BoundingBox,
  ModelMetadata,
  Model,
  ModelIndex,
  ModelSortField,
  SortDirection,
  ModelFilter,
} from './model.types';

// Scene types
export type {
  AnchorType,
  Transform,
  PlacedObject,
  SavedScene,
  SceneIndex,
  ActiveScene,
  SceneExport,
  ScanStatus,
  PhotoQuality,
  CapturedPhoto,
  ScanSession,
  ScanProgress,
} from './scene.types';

// WebView bridge types
export type {
  WebViewMessage,
  TransformPayload,
  PlacedObjectPayload,
  ScenePayload,
  BoundingBoxPayload,
  PhotoQualityPayload,
  ARCapabilities,
  ARErrorCode,
  ModelErrorCode,
  ScanErrorCode,
  TrackingState,
  TrackingLimitedReason,
  RNToWebViewMessageType,
  WebViewToRNMessageType,
  InitARPayload,
  LoadModelPayload,
  RemoveModelPayload,
  UpdateTransformPayload,
  CaptureScenePayload,
  RestoreScenePayload,
  StartScanPayload,
  CaptureScanPhotoPayload,
  EndScanPayload,
  CancelScanPayload,
  ARReadyPayload,
  ARErrorPayload,
  SurfaceDetectedPayload,
  ModelPlacedPayload,
  ModelErrorPayload,
  TransformUpdatedPayload,
  SceneCapturedPayload,
  SceneRestoredPayload,
  ScanPhotoCapturedPayload,
  ScanProgressPayload,
  ScanCompletePayload,
  ScanFailedPayload,
  TrackingStatePayload,
  WebViewMessageHandler,
  Unsubscribe,
} from './webview.types';
