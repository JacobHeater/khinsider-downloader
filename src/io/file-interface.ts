import { ensureDirSync } from 'fs-extra';
import { join } from 'path';

export abstract class FileInterface {
  /**
   * Initializes a new instance of the FileInterface class.
   *
   * @param basePath The base path of the folder to interface with files from.
   * @param ensureDirOnInstantiate Should the baseDir be ensured on instantiation?
   */
  constructor(protected basePath: string, ensureDirOnInstantiate: boolean = true) {
    if (!basePath) {
      throw new Error('Argument basePath is required.');
    }

    ensureDirSync(basePath);
  }

  /**
   * Cleans the file name of any illegal characters.
   *
   * @param fileName The name of the file to clean.
   * @returns The name of the file sans illegal characters.
   */
  protected cleanFileName(fileName: string): string {
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
    return join(this.basePath, this.cleanFileName(fileName));
  }
}
