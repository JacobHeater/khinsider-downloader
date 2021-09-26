import archiver from 'archiver';
import fs from 'fs';
import { join } from 'path';
import process from 'process';

const writeStream = fs.createWriteStream(join(process.cwd(), 'bin', 'downloader.zip'));
const zip = archiver.create('zip');

zip.pipe(writeStream);
zip.glob('bin/khinsider-*', { cwd: process.cwd() });
zip.finalize();
