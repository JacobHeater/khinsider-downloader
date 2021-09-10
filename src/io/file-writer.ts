import { writeFile } from 'fs-extra';
import { FileInterface } from './file-interface';

export class FileWriter extends FileInterface {
  writeBufferAsync(fileName: string, data: Buffer): Promise<void> {
    return writeFile(this.getFilePath(fileName), data);
  }
}
