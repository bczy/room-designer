/**
 * WebView Message Handlers
 * 
 * Registry and handlers for WebView messages.
 * Per T020: Create message handler registry.
 * 
 * @module infrastructure/webview/messageHandlers
 */

import type {
  WebViewMessage,
  WebViewToRNMessageType,
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
} from '@core/types/webview.types';
import { arWebViewBridge } from './ARWebViewBridge';

/**
 * Typed message handler for a specific message type.
 */
export type TypedMessageHandler<P> = (payload: P, message: WebViewMessage) => void;

/**
 * Message handler registry for type-safe handler registration.
 */
class MessageHandlerRegistry {
  private initialized = false;

  /**
   * Initialize the registry and set up default logging.
   */
  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Log all messages in development
    if (__DEV__) {
      arWebViewBridge.onAny(message => {
        console.log('[WebView Message]', message.type, message.payload);
      });
    }
  }

  /**
   * Register handler for AR_READY.
   */
  onARReady(handler: TypedMessageHandler<ARReadyPayload>): () => void {
    return arWebViewBridge.on('AR_READY', message => {
      handler(message.payload as ARReadyPayload, message);
    });
  }

  /**
   * Register handler for AR_ERROR.
   */
  onARError(handler: TypedMessageHandler<ARErrorPayload>): () => void {
    return arWebViewBridge.on('AR_ERROR', message => {
      handler(message.payload as ARErrorPayload, message);
    });
  }

  /**
   * Register handler for SURFACE_DETECTED.
   */
  onSurfaceDetected(handler: TypedMessageHandler<SurfaceDetectedPayload>): () => void {
    return arWebViewBridge.on('SURFACE_DETECTED', message => {
      handler(message.payload as SurfaceDetectedPayload, message);
    });
  }

  /**
   * Register handler for MODEL_PLACED.
   */
  onModelPlaced(handler: TypedMessageHandler<ModelPlacedPayload>): () => void {
    return arWebViewBridge.on('MODEL_PLACED', message => {
      handler(message.payload as ModelPlacedPayload, message);
    });
  }

  /**
   * Register handler for MODEL_ERROR.
   */
  onModelError(handler: TypedMessageHandler<ModelErrorPayload>): () => void {
    return arWebViewBridge.on('MODEL_ERROR', message => {
      handler(message.payload as ModelErrorPayload, message);
    });
  }

  /**
   * Register handler for TRANSFORM_UPDATED.
   */
  onTransformUpdated(handler: TypedMessageHandler<TransformUpdatedPayload>): () => void {
    return arWebViewBridge.on('TRANSFORM_UPDATED', message => {
      handler(message.payload as TransformUpdatedPayload, message);
    });
  }

  /**
   * Register handler for SCENE_CAPTURED.
   */
  onSceneCaptured(handler: TypedMessageHandler<SceneCapturedPayload>): () => void {
    return arWebViewBridge.on('SCENE_CAPTURED', message => {
      handler(message.payload as SceneCapturedPayload, message);
    });
  }

  /**
   * Register handler for SCENE_RESTORED.
   */
  onSceneRestored(handler: TypedMessageHandler<SceneRestoredPayload>): () => void {
    return arWebViewBridge.on('SCENE_RESTORED', message => {
      handler(message.payload as SceneRestoredPayload, message);
    });
  }

  /**
   * Register handler for SCAN_PHOTO_CAPTURED.
   */
  onScanPhotoCaptured(handler: TypedMessageHandler<ScanPhotoCapturedPayload>): () => void {
    return arWebViewBridge.on('SCAN_PHOTO_CAPTURED', message => {
      handler(message.payload as ScanPhotoCapturedPayload, message);
    });
  }

  /**
   * Register handler for SCAN_PROGRESS.
   */
  onScanProgress(handler: TypedMessageHandler<ScanProgressPayload>): () => void {
    return arWebViewBridge.on('SCAN_PROGRESS', message => {
      handler(message.payload as ScanProgressPayload, message);
    });
  }

  /**
   * Register handler for SCAN_COMPLETE.
   */
  onScanComplete(handler: TypedMessageHandler<ScanCompletePayload>): () => void {
    return arWebViewBridge.on('SCAN_COMPLETE', message => {
      handler(message.payload as ScanCompletePayload, message);
    });
  }

  /**
   * Register handler for SCAN_FAILED.
   */
  onScanFailed(handler: TypedMessageHandler<ScanFailedPayload>): () => void {
    return arWebViewBridge.on('SCAN_FAILED', message => {
      handler(message.payload as ScanFailedPayload, message);
    });
  }

  /**
   * Register handler for TRACKING_STATE.
   */
  onTrackingState(handler: TypedMessageHandler<TrackingStatePayload>): () => void {
    return arWebViewBridge.on('TRACKING_STATE', message => {
      handler(message.payload as TrackingStatePayload, message);
    });
  }

  /**
   * Register handler for any message type.
   */
  onMessage(
    type: WebViewToRNMessageType,
    handler: TypedMessageHandler<unknown>
  ): () => void {
    return arWebViewBridge.on(type, message => {
      handler(message.payload, message);
    });
  }
}

// Export singleton instance
export const messageHandlers = new MessageHandlerRegistry();
