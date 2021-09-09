import { writeFile } from 'fs-extra';
import { FileInterface } from './file-interface';

export class FileWriter extends FileInterface {
  async writeBufferAsync(fileName: string, data: Buffer): Promise<void> {
    await writeFile(this.getFilePath(fileName), data);
  }
}
