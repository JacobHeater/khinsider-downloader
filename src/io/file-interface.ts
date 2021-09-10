import { ensureDirSync } from 'fs-extra';
import { join } from 'path';

export abstract class FileInterface {
  constructor(protected basePath: string) {
    if (!basePath) {
      throw new Error('Argument basePath is required.');
    }

    ensureDirSync(basePath);
  }

  protected cleanFileName(fileName: string): string {
    return fileName.replace(/[/\\?%*:|"<>]/g, '');
  }

  protected getFilePath(fileName: string): string {
    return join(this.basePath, this.cleanFileName(fileName));
  }
}
