import { exists } from "fs";
import { stat } from "fs-extra";
import { FileInterface } from "./file-interface";

export class FileReader extends FileInterface {
  async fileExistsAsync(fileName: string): Promise<boolean> {
    try {
      await stat(this.getFilePath(fileName));
      return true;
    } catch (_) {
      return false;
    }
  }
}
