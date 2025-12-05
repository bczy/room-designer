/**
 * Permissions Exports
 *
 * Barrel export for permissions utilities.
 *
 * @module infrastructure/permissions
 */

export {
  checkPermission,
  requestPermission,
  requestMultiplePermissions,
  checkARPermissions,
  requestARPermissions,
} from './PermissionsAdapter';

export type { AppPermission, PermissionStatus, PermissionResult } from './PermissionsAdapter';

export { usePermissions } from './usePermissions';
