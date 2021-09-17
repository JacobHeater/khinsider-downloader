import { stat } from 'fs-extra';

import { FileInterface } from './file-interface';

export class FileReader extends FileInterface {
  /**
   * Checks if a file exists and returns a boolean indicating
   * its presence.
   *
   * @param fileName The name of the file to check.
   * @returns A boolean indicating the existence of the file.
   */
  async fileExistsAsync(fileName: string): Promise<boolean> {
    try {
      await stat(this.getFilePath(fileName));
      return true;
    } catch (_) {
      return false;
    }
  }
}
