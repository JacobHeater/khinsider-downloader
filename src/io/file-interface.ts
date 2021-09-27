import fs, { ensureDirSync, writeFile } from 'fs-extra';
import { homedir } from 'os';
import { join, resolve } from 'path';

import { ArgumentInvalidError, ArgumentInvalidReason } from '../argument-invalid-error';
import { isStringFalsey } from '../validation/string-validation';

export class FileInterface {
  /**
   * Initializes a new instance of the FileInterface class.
   *
   * @param _basePath The base path of the folder to interface with files from.
   * @param ensureDirOnInstantiate Should the baseDir be ensured on instantiation?
   * @param fsDestination Which file system should be used for storage.
   */
  constructor(private _basePath: string, ensureDirOnInstantiate: boolean = true) {
    if (!_basePath || !String(_basePath).trim()) {
      throw new ArgumentInvalidError('basePath', ArgumentInvalidReason.Null);
    }

    this.resolveBasePath();

    if (ensureDirOnInstantiate) {
      ensureDirSync(this._basePath);
    }
  }

  /**
   * Gets the path that this instance is using.
   */
  get basePath(): string {
    return this._basePath;
  }

  /**
   * Resolves the path where the given path contains
   * a homedir reference `~`.
   *
   * @param path The path to resolve.
   */
  resolveHomeDir(path: string): string {
    if (isStringFalsey(path)) {
      throw new ArgumentInvalidError('path', ArgumentInvalidReason.Null);
    }

    if (path.startsWith('~')) {
      if (!path.startsWith('~/')) {
        path = path.replace('~', '~/');
      }

      return join(homedir(), path.replace('~/', ''));
    }

    return path;
  }

  /**
   * Write a buffer to a file.
   *
   * @param fileName The name of the file to write.
   * @param data The data to write.
   * @returns
   */
  async writeFileAsync(fileName: string, data: Buffer | string): Promise<void> {
    if (isStringFalsey(fileName)) {
      throw new ArgumentInvalidError('fileName', ArgumentInvalidReason.Null);
    }

    if (!data || (typeof data === 'string' && isStringFalsey(data))) {
      throw new ArgumentInvalidError('data', ArgumentInvalidReason.Null);
    }

    return writeFile(this.getFilePath(fileName), data);
  }

  /**
   * Does the file at the given path exist?
   *
   * @param fileName The path to the file.
   */
  async fileExistsAsync(fileName: string): Promise<boolean> {
    if (isStringFalsey(fileName)) {
      throw new ArgumentInvalidError('path', ArgumentInvalidReason.Null);
    }

    try {
      await fs.stat(this.getFilePath(fileName));

      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Deletes the file at the given path.
   *
   * @param path The path to the file.
   */
  async deleteFileAsync(path: string): Promise<void> {
    if (isStringFalsey(path)) {
      throw new ArgumentInvalidError('path', ArgumentInvalidReason.Null);
    }

    if (await this.fileExistsAsync(path)) {
      await fs.remove(path);
    }
  }

  /**
   * Cleans the file name of any illegal characters.
   *
   * @param fileName The name of the file to clean.
   * @returns The name of the file sans illegal characters.
   */
  protected cleanFileName(fileName: string): string {
    if (isStringFalsey(fileName)) {
      throw new ArgumentInvalidError('fileName', ArgumentInvalidReason.Null);
    }

    return fileName.replace(/[/\\?%*:|"<>]/g, '');
  }

  /**
   * Creates a compatible file name without illegal characters
   * with the base path prepended.
   *
   * @param fileName The file name.
   * @returns The full path for the file.
   */
  protected getFilePath(fileName: string): string {
    if (isStringFalsey(fileName)) {
      throw new ArgumentInvalidError('fileName', ArgumentInvalidReason.Null);
    }

    return join(this._basePath, this.cleanFileName(fileName));
  }

  private resolveBasePath(): void {
    this._basePath = resolve(this.resolveHomeDir(this._basePath));
  }
}
