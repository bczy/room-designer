/**
 * Permissions Adapter
 * 
 * Cross-platform permissions handling.
 * Per T027: Create PermissionsAdapter.
 * 
 * @module infrastructure/permissions/PermissionsAdapter
 */

import { Platform, PermissionsAndroid, Permission } from 'react-native';

/**
 * Permission types the app needs.
 */
export type AppPermission = 'camera' | 'microphone' | 'storage';

/**
 * Permission status.
 */
export type PermissionStatus = 
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable'
  | 'limited';

/**
 * Result of permission check or request.
 */
export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

/**
 * Android permission mapping.
 */
const ANDROID_PERMISSIONS: Record<AppPermission, Permission> = {
  camera: PermissionsAndroid.PERMISSIONS.CAMERA,
  microphone: PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  storage: Number(Platform.Version) >= 33
    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
};

/**
 * Convert Android permission result to our status.
 */
function androidResultToStatus(result: string): PermissionStatus {
  switch (result) {
    case PermissionsAndroid.RESULTS.GRANTED:
      return 'granted';
    case PermissionsAndroid.RESULTS.DENIED:
      return 'denied';
    case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
      return 'blocked';
    default:
      return 'unavailable';
  }
}

/**
 * Check if a permission is granted.
 */
export async function checkPermission(
  permission: AppPermission
): Promise<PermissionResult> {
  if (Platform.OS === 'android') {
    const androidPermission = ANDROID_PERMISSIONS[permission];
    
    try {
      const granted = await PermissionsAndroid.check(androidPermission);
      
      if (granted) {
        return { status: 'granted', canAskAgain: true };
      }
      
      // Cannot determine if blocked without requesting
      return { status: 'denied', canAskAgain: true };
    } catch {
      return { status: 'unavailable', canAskAgain: false };
    }
  }
  
  // iOS permissions would use react-native-permissions package
  // For now, return unavailable as placeholder
  // TODO: Integrate react-native-permissions for iOS
  return { status: 'unavailable', canAskAgain: false };
}

/**
 * Request a permission.
 */
export async function requestPermission(
  permission: AppPermission
): Promise<PermissionResult> {
  if (Platform.OS === 'android') {
    const androidPermission = ANDROID_PERMISSIONS[permission];
    
    try {
      const result = await PermissionsAndroid.request(androidPermission, {
        title: getPermissionTitle(permission),
        message: getPermissionMessage(permission),
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      });
      
      const status = androidResultToStatus(result);
      
      return {
        status,
        canAskAgain: status !== 'blocked',
      };
    } catch {
      return { status: 'unavailable', canAskAgain: false };
    }
  }
  
  // iOS permissions would use react-native-permissions package
  // TODO: Integrate react-native-permissions for iOS
  return { status: 'unavailable', canAskAgain: false };
}

/**
 * Request multiple permissions.
 */
export async function requestMultiplePermissions(
  permissions: AppPermission[]
): Promise<Record<AppPermission, PermissionResult>> {
  const results: Record<string, PermissionResult> = {};
  
  // Request sequentially to show proper dialogs
  for (const permission of permissions) {
    results[permission] = await requestPermission(permission);
  }
  
  return results as Record<AppPermission, PermissionResult>;
}

/**
 * Check all required permissions for AR.
 */
export async function checkARPermissions(): Promise<{
  allGranted: boolean;
  results: Record<AppPermission, PermissionResult>;
}> {
  const requiredPermissions: AppPermission[] = ['camera'];
  
  const results: Record<string, PermissionResult> = {};
  
  for (const permission of requiredPermissions) {
    results[permission] = await checkPermission(permission);
  }
  
  const allGranted = requiredPermissions.every(
    (p) => results[p]?.status === 'granted'
  );
  
  return {
    allGranted,
    results: results as Record<AppPermission, PermissionResult>,
  };
}

/**
 * Request all required permissions for AR.
 */
export async function requestARPermissions(): Promise<{
  allGranted: boolean;
  results: Record<AppPermission, PermissionResult>;
}> {
  const requiredPermissions: AppPermission[] = ['camera'];
  
  const results = await requestMultiplePermissions(requiredPermissions);
  
  const allGranted = requiredPermissions.every(
    (p) => results[p]?.status === 'granted'
  );
  
  return { allGranted, results };
}

/**
 * Get user-friendly permission title.
 */
function getPermissionTitle(permission: AppPermission): string {
  switch (permission) {
    case 'camera':
      return 'Camera Permission';
    case 'microphone':
      return 'Microphone Permission';
    case 'storage':
      return 'Storage Permission';
  }
}

/**
 * Get user-friendly permission message.
 */
function getPermissionMessage(permission: AppPermission): string {
  switch (permission) {
    case 'camera':
      return 'AR Furniture Previewer needs camera access to show augmented reality experiences.';
    case 'microphone':
      return 'AR Furniture Previewer needs microphone access for audio features.';
    case 'storage':
      return 'AR Furniture Previewer needs storage access to save and load 3D models.';
  }
}
