/**
 * usePermissions Hook
 * 
 * React hook for managing app permissions.
 * Per T028: Create usePermissions hook.
 * 
 * @module infrastructure/permissions/usePermissions
 */

import { useState, useCallback, useEffect } from 'react';
import {
  AppPermission,
  PermissionResult,
  PermissionStatus,
  checkPermission,
  requestPermission,
  checkARPermissions,
  requestARPermissions,
} from './PermissionsAdapter';

/**
 * Hook state.
 */
interface PermissionsState {
  camera: PermissionStatus | null;
  microphone: PermissionStatus | null;
  storage: PermissionStatus | null;
  isChecking: boolean;
  isRequesting: boolean;
}

/**
 * Hook return type.
 */
interface UsePermissionsResult extends PermissionsState {
  // Check permissions
  checkPermission: (permission: AppPermission) => Promise<PermissionResult>;
  checkARPermissions: () => Promise<boolean>;
  
  // Request permissions
  requestPermission: (permission: AppPermission) => Promise<PermissionResult>;
  requestARPermissions: () => Promise<boolean>;
  
  // Utilities
  hasARPermissions: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing app permissions.
 * 
 * @example
 * ```tsx
 * function ARView() {
 *   const { hasARPermissions, requestARPermissions, isRequesting } = usePermissions();
 *   
 *   if (!hasARPermissions) {
 *     return (
 *       <Button 
 *         title="Enable Camera" 
 *         onPress={requestARPermissions}
 *         disabled={isRequesting}
 *       />
 *     );
 *   }
 *   
 *   return <ARCamera />;
 * }
 * ```
 */
export function usePermissions(): UsePermissionsResult {
  const [state, setState] = useState<PermissionsState>({
    camera: null,
    microphone: null,
    storage: null,
    isChecking: false,
    isRequesting: false,
  });

  /**
   * Check a single permission.
   */
  const checkSinglePermission = useCallback(
    async (permission: AppPermission): Promise<PermissionResult> => {
      setState((prev) => ({ ...prev, isChecking: true }));
      
      try {
        const result = await checkPermission(permission);
        
        setState((prev) => ({
          ...prev,
          [permission]: result.status,
        }));
        
        return result;
      } finally {
        setState((prev) => ({ ...prev, isChecking: false }));
      }
    },
    []
  );

  /**
   * Request a single permission.
   */
  const requestSinglePermission = useCallback(
    async (permission: AppPermission): Promise<PermissionResult> => {
      setState((prev) => ({ ...prev, isRequesting: true }));
      
      try {
        const result = await requestPermission(permission);
        
        setState((prev) => ({
          ...prev,
          [permission]: result.status,
        }));
        
        return result;
      } finally {
        setState((prev) => ({ ...prev, isRequesting: false }));
      }
    },
    []
  );

  /**
   * Check all AR permissions.
   */
  const checkAR = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isChecking: true }));
    
    try {
      const { allGranted, results } = await checkARPermissions();
      
      setState((prev) => ({
        ...prev,
        camera: results.camera?.status ?? null,
      }));
      
      return allGranted;
    } finally {
      setState((prev) => ({ ...prev, isChecking: false }));
    }
  }, []);

  /**
   * Request all AR permissions.
   */
  const requestAR = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isRequesting: true }));
    
    try {
      const { allGranted, results } = await requestARPermissions();
      
      setState((prev) => ({
        ...prev,
        camera: results.camera?.status ?? null,
      }));
      
      return allGranted;
    } finally {
      setState((prev) => ({ ...prev, isRequesting: false }));
    }
  }, []);

  /**
   * Refresh all permission statuses.
   */
  const refresh = useCallback(async (): Promise<void> => {
    await checkAR();
  }, [checkAR]);

  /**
   * Check permissions on mount.
   */
  useEffect(() => {
    void checkAR();
  }, [checkAR]);

  /**
   * Compute if we have all AR permissions.
   */
  const hasARPermissions = state.camera === 'granted';

  return {
    ...state,
    checkPermission: checkSinglePermission,
    checkARPermissions: checkAR,
    requestPermission: requestSinglePermission,
    requestARPermissions: requestAR,
    hasARPermissions,
    refresh,
  };
}

export default usePermissions;
