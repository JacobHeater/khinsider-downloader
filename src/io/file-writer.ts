import { writeFile, ensureDirSync } from 'fs-extra';
import { join } from 'path';

export class FileWriter {
  constructor(private readonly baseDir: string) {
    if (!baseDir) {
      throw new Error('Argument baseDir is required.');
    }

    ensureDirSync(baseDir);
  }

  async writeBufferAsync(fileName: string, data: Buffer): Promise<void> {
    await writeFile(this.getFilePath(fileName), data);
  }

  private getFilePath(fileName: string): string {
    return join(this.baseDir, this.cleanFileName(fileName));
  }

  private cleanFileName(fileName: string): string {
    return fileName.replace(/[/\\?%*:|"<>]/g, '');
  }
}
