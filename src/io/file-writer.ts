import { writeFile } from 'fs-extra';

import { FileInterface } from './file-interface';

export class FileWriter extends FileInterface {
  /**
   * Write a buffer to a file.
   *
   * @param fileName The name of the file to write.
   * @param data The data to write.
   * @returns
   */
  writeFileAsync(fileName: string, data: Buffer | string): Promise<void> {
    return writeFile(this.getFilePath(fileName), data);
  }
}
