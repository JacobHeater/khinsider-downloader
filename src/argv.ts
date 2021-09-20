import yargs from 'yargs';

import { version } from '../package.json';

const IS_TEST_MODE = process.env.TEST_MODE || false;

export const argv = yargs
  .version(`KH Insider Downloader v${version}.`)
  .option('album', {
    alias: 'a',
    description: 'The album to download.',
    type: 'string',
    demandOption: !IS_TEST_MODE,
  })
  .option('outdir', {
    alias: 'o',
    description: 'The name of the folder to produce.',
    type: 'string',
    demandOption: !IS_TEST_MODE,
  })
  .option('format', {
    alias: 'f',
    description: 'Which format do you want to download?',
    choices: ['flac', 'mp3'],
    default: 'mp3',
    type: 'string',
  })
  .option('log-level', {
    alias: 'l',
    description: 'What level of logging verbosity do you want?',
    choices: ['info', 'warn', 'error'],
    default: 'info',
    type: 'string',
  })
  .parseSync();
