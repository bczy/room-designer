/**
 * AR WebView Bridge
 * 
 * Bridge for communication between React Native and 8th Wall WebView.
 * Per T019: Implement WebViewBridge contract.
 * 
 * @module infrastructure/webview/ARWebViewBridge
 */

import { RefObject } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type {
  WebViewMessage,
  RNToWebViewMessageType,
  WebViewToRNMessageType,
  WebViewMessageHandler,
  Unsubscribe,
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
} from '@core/types/webview.types';

let messageCounter = 0;

/**
 * Generate unique message ID.
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${++messageCounter}`;
}

/**
 * Create a typed message.
 */
function createMessage<T extends RNToWebViewMessageType, P>(
  type: T,
  payload: P
): WebViewMessage<T, P> {
  return {
    type,
    payload,
    messageId: generateMessageId(),
    timestamp: Date.now(),
  };
}

/**
 * Pending promise for request/response pattern.
 */
interface PendingRequest {
  resolve: (message: WebViewMessage) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
}

/**
 * AR WebView Bridge implementation.
 */
export class ARWebViewBridge {
  private webViewRef: RefObject<WebView> | null = null;
  private handlers: Map<WebViewToRNMessageType, Set<WebViewMessageHandler>> = new Map();
  private globalHandlers: Set<WebViewMessageHandler> = new Set();
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private isReady = false;

  /**
   * Attach to a WebView ref.
   */
  attach(ref: RefObject<WebView>): void {
    this.webViewRef = ref;
  }

  /**
   * Detach from WebView.
   */
  detach(): void {
    this.webViewRef = null;
    this.isReady = false;
    // Cancel pending requests
    this.pendingRequests.forEach((pending, id) => {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Bridge detached'));
      this.pendingRequests.delete(id);
    });
  }

  /**
   * Mark bridge as ready (called when AR_READY received).
   */
  setReady(ready: boolean): void {
    this.isReady = ready;
  }

  /**
   * Check if bridge is ready.
   */
  get ready(): boolean {
    return this.isReady && this.webViewRef?.current !== null;
  }

  /**
   * Send a message to the WebView.
   */
  send<T extends RNToWebViewMessageType, P>(type: T, payload: P): void {
    if (this.webViewRef?.current == null) {
      console.warn('[ARWebViewBridge] WebView not attached');
      return;
    }

    const message = createMessage(type, payload);
    const script = `
      (function() {
        window.dispatchEvent(new CustomEvent('rn-message', { 
          detail: ${JSON.stringify(message)} 
        }));
      })();
      true;
    `;

    this.webViewRef.current.injectJavaScript(script);
  }

  /**
   * Send a message and wait for a response.
   */
  sendAndWait<R extends WebViewMessage>(
    type: RNToWebViewMessageType,
    payload: unknown,
    responseType: WebViewToRNMessageType,
    timeout = 10000
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      if (this.webViewRef?.current == null) {
        reject(new Error('WebView not attached'));
        return;
      }

      const message = createMessage(type, payload);

      // Set up timeout
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(message.messageId);
        reject(new Error(`Request timeout for ${type}`));
      }, timeout);

      // Store pending request
      this.pendingRequests.set(message.messageId, {
        resolve: msg => resolve(msg as R),
        reject,
        timeout: timeoutId,
      });

      // Register one-time handler for response
      const unsubscribe = this.on(responseType, (response: WebViewMessage) => {
        // Match by message ID or just accept first response of this type
        const pending = this.pendingRequests.get(message.messageId);
        if (pending != null) {
          clearTimeout(pending.timeout);
          this.pendingRequests.delete(message.messageId);
          pending.resolve(response);
          unsubscribe();
        }
      });

      // Send the message
      const script = `
        (function() {
          window.dispatchEvent(new CustomEvent('rn-message', { 
            detail: ${JSON.stringify(message)} 
          }));
        })();
        true;
      `;

      this.webViewRef.current.injectJavaScript(script);
    });
  }

  /**
   * Handle incoming message from WebView.
   */
  handleMessage(event: WebViewMessageEvent): void {
    try {
      const message = JSON.parse(event.nativeEvent.data) as WebViewMessage<WebViewToRNMessageType>;

      // Notify global handlers
      this.globalHandlers.forEach(handler => handler(message));

      // Notify type-specific handlers
      const typeHandlers = this.handlers.get(message.type);
      typeHandlers?.forEach(handler => handler(message));
    } catch (error) {
      console.warn('[ARWebViewBridge] Failed to parse message:', error);
    }
  }

  /**
   * Register handler for a specific message type.
   */
  on(type: WebViewToRNMessageType, handler: WebViewMessageHandler): Unsubscribe {
    let typeHandlers = this.handlers.get(type);
    if (typeHandlers == null) {
      typeHandlers = new Set();
      this.handlers.set(type, typeHandlers);
    }
    typeHandlers.add(handler);

    return () => {
      typeHandlers?.delete(handler);
    };
  }

  /**
   * Register handler for all messages.
   */
  onAny(handler: WebViewMessageHandler): Unsubscribe {
    this.globalHandlers.add(handler);
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  /**
   * Remove all handlers for a type.
   */
  off(type: WebViewToRNMessageType): void {
    this.handlers.delete(type);
  }

  /**
   * Remove all handlers.
   */
  removeAllHandlers(): void {
    this.handlers.clear();
    this.globalHandlers.clear();
  }

  // ==========================================================================
  // TYPED SEND METHODS
  // ==========================================================================

  initAR(payload: InitARPayload): void {
    this.send('INIT_AR', payload);
  }

  loadModel(payload: LoadModelPayload): void {
    this.send('LOAD_MODEL', payload);
  }

  removeModel(payload: RemoveModelPayload): void {
    this.send('REMOVE_MODEL', payload);
  }

  updateTransform(payload: UpdateTransformPayload): void {
    this.send('UPDATE_TRANSFORM', payload);
  }

  captureScene(payload: CaptureScenePayload): void {
    this.send('CAPTURE_SCENE', payload);
  }

  restoreScene(payload: RestoreScenePayload): void {
    this.send('RESTORE_SCENE', payload);
  }

  startScan(payload: StartScanPayload): void {
    this.send('START_SCAN', payload);
  }

  captureScanPhoto(payload: CaptureScanPhotoPayload): void {
    this.send('CAPTURE_SCAN_PHOTO', payload);
  }

  endScan(payload: EndScanPayload): void {
    this.send('END_SCAN', payload);
  }

  cancelScan(payload: CancelScanPayload): void {
    this.send('CANCEL_SCAN', payload);
  }

  resetAR(): void {
    this.send('RESET_AR', {});
  }

  pauseAR(): void {
    this.send('PAUSE_AR', {});
  }

  resumeAR(): void {
    this.send('RESUME_AR', {});
  }
}

// Singleton instance
export const arWebViewBridge = new ARWebViewBridge();
