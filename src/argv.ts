import yargs from 'yargs';
import { version } from '../package.json';

export const argv = yargs
  .version(`KH Insider Downloader v${version}.`)
  .option('album', {
    alias: 'a',
    description: 'The album to download.',
    type: 'string',
    demandOption: true,
  })
  .option('outdir', {
    alias: 'o',
    description: 'The name of the folder to produce.',
    type: 'string',
    demandOption: true,
  })
  .option('format', {
    alias: 'f',
    description: 'Which format do you want to download?',
    choices: ['flac', 'mp3'],
    default: 'mp3',
    type: 'string',
  })
  .parseSync();
