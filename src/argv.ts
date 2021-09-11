import yargs from 'yargs';

/**
 * The argv for the application.
 *
 * * --album
 * * --outdir
 * * --format
 */
export const argv = yargs
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
