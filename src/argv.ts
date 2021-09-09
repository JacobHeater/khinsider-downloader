import yargs from 'yargs';

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
  .parseSync();
