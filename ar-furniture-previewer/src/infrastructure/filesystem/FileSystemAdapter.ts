/**
 * FileSystem Adapter
 * 
 * Wrapper around react-native-fs with typed operations.
 * Per T017: Implement storage infrastructure.
 * 
 * @module infrastructure/filesystem/FileSystemAdapter
 */

import RNFS from 'react-native-fs';
import { APP_PATHS } from '@core/constants/paths';
import { MODEL_LIMITS } from '@core/constants/limits';

/**
 * File info returned by stat operations.
 */
export interface FileInfo {
  path: string;
  name: string;
  size: number;
  isFile: boolean;
  isDirectory: boolean;
  mtime: Date;
  ctime: Date;
}

/**
 * Error thrown by FileSystemAdapter operations.
 */
export class FileSystemError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'NOT_FOUND'
      | 'PERMISSION_DENIED'
      | 'QUOTA_EXCEEDED'
      | 'IO_ERROR'
      | 'INVALID_PATH'
      | 'UNKNOWN',
    public readonly path?: string
  ) {
    super(message);
    this.name = 'FileSystemError';
  }
}

/**
 * FileSystem adapter providing typed file operations.
 */
export class FileSystemAdapter {
  /**
   * Initialize app directory structure.
   * Creates all required directories if they don't exist.
   */
  async initializeDirectories(): Promise<void> {
    const directories = [
      APP_PATHS.root,
      APP_PATHS.models,
      APP_PATHS.modelThumbnails,
      APP_PATHS.scenes,
      APP_PATHS.sceneThumbnails,
      APP_PATHS.scanSessions,
      APP_PATHS.importStaging,
    ];

    for (const dir of directories) {
      await this.ensureDirectory(dir);
    }
  }

  /**
   * Ensure a directory exists, creating it if necessary.
   */
  async ensureDirectory(path: string): Promise<void> {
    try {
      const exists = await RNFS.exists(path);
      if (!exists) {
        await RNFS.mkdir(path);
      }
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Check if a file or directory exists.
   */
  async exists(path: string): Promise<boolean> {
    try {
      return await RNFS.exists(path);
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Get file/directory info.
   */
  async stat(path: string): Promise<FileInfo> {
    try {
      const stat = await RNFS.stat(path);
      return {
        path: stat.path,
        name: stat.name ?? path.split('/').pop() ?? '',
        size: stat.size,
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory(),
        mtime: new Date(stat.mtime),
        ctime: new Date(stat.ctime),
      };
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Read file contents as string.
   */
  async readFile(path: string, encoding: 'utf8' | 'base64' = 'utf8'): Promise<string> {
    try {
      return await RNFS.readFile(path, encoding);
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Write string content to file.
   */
  async writeFile(
    path: string,
    content: string,
    encoding: 'utf8' | 'base64' = 'utf8'
  ): Promise<void> {
    try {
      await RNFS.writeFile(path, content, encoding);
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Delete a file.
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const exists = await RNFS.exists(path);
      if (exists) {
        await RNFS.unlink(path);
      }
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Delete a directory and all its contents.
   */
  async deleteDirectory(path: string): Promise<void> {
    try {
      const exists = await RNFS.exists(path);
      if (exists) {
        // RNFS.unlink works for directories too
        await RNFS.unlink(path);
      }
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Copy a file.
   */
  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    try {
      await RNFS.copyFile(sourcePath, destPath);
    } catch (error) {
      throw this.wrapError(error, sourcePath);
    }
  }

  /**
   * Move a file.
   */
  async moveFile(sourcePath: string, destPath: string): Promise<void> {
    try {
      await RNFS.moveFile(sourcePath, destPath);
    } catch (error) {
      throw this.wrapError(error, sourcePath);
    }
  }

  /**
   * List directory contents.
   */
  async listDirectory(path: string): Promise<FileInfo[]> {
    try {
      const items = await RNFS.readDir(path);
      return items.map(item => ({
        path: item.path,
        name: item.name,
        size: item.size,
        isFile: item.isFile(),
        isDirectory: item.isDirectory(),
        mtime: new Date(item.mtime ?? 0),
        ctime: new Date(item.ctime ?? 0),
      }));
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Get total size of a directory.
   */
  async getDirectorySize(path: string): Promise<number> {
    try {
      const items = await this.listDirectory(path);
      let totalSize = 0;

      for (const item of items) {
        if (item.isFile) {
          totalSize += item.size;
        } else if (item.isDirectory) {
          totalSize += await this.getDirectorySize(item.path);
        }
      }

      return totalSize;
    } catch (error) {
      throw this.wrapError(error, path);
    }
  }

  /**
   * Validate file size against limits.
   */
  async validateFileSize(path: string, maxSize: number = MODEL_LIMITS.MAX_GLB_SIZE_BYTES): Promise<{
    valid: boolean;
    size: number;
  }> {
    const info = await this.stat(path);
    return {
      valid: info.size <= maxSize,
      size: info.size,
    };
  }

  /**
   * Copy bundled asset to documents directory.
   */
  async copyFromBundle(bundlePath: string, destPath: string): Promise<void> {
    try {
      await RNFS.copyFileAssets(bundlePath, destPath);
    } catch {
      // Fallback for iOS
      await this.copyFile(bundlePath, destPath);
    }
  }

  /**
   * Get free disk space in bytes.
   */
  async getFreeDiskSpace(): Promise<number> {
    try {
      const info = await RNFS.getFSInfo();
      return info.freeSpace;
    } catch {
      return -1; // Unknown
    }
  }

  /**
   * Wrap native errors in FileSystemError.
   */
  private wrapError(error: unknown, path?: string): FileSystemError {
    if (error instanceof FileSystemError) {
      return error;
    }

    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('ENOENT') || message.includes('not found')) {
      return new FileSystemError(`File not found: ${path}`, 'NOT_FOUND', path);
    }

    if (message.includes('EACCES') || message.includes('permission')) {
      return new FileSystemError(`Permission denied: ${path}`, 'PERMISSION_DENIED', path);
    }

    if (message.includes('ENOSPC') || message.includes('quota')) {
      return new FileSystemError(`Storage quota exceeded`, 'QUOTA_EXCEEDED', path);
    }

    return new FileSystemError(message, 'IO_ERROR', path);
  }
}

// Singleton instance
export const fileSystem = new FileSystemAdapter();
