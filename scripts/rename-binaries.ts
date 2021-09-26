import glob from 'glob';
import { join, basename, dirname } from 'path';
import process from 'process';
import fs from 'fs-extra';

const binaries = glob.sync(join(process.cwd(), 'bin', '**'));

binaries.forEach(renameFileAndRemoveOldFile);

function renameFileAndRemoveOldFile(path: string): void {
  const newName = basename(path).replace('app', 'khinsider-downloader');
  fs.renameSync(path, join(dirname(path), newName));
}
