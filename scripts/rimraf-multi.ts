import yargs from 'yargs';
import rimraf from 'rimraf';

const argv = yargs
  .option('paths', {
    alias: 'p',
    description: 'The paths to delete; multiples are comma separated.',
    demandOption: true,
    type: 'string',
  })
  .parseSync();

const paths = argv.paths.split(',').filter((p) => !!p.trim());

if (!paths || paths.length === 0) {
  throw new Error('Did not get any directories.');
}

console.log(`Received ${paths.length} paths to delete...`);
console.log('Deleting paths...');

paths.forEach(deletePath);

console.log('Deleting paths is complete. Exiting.');

function deletePath(path: string): void {
    console.log(`Deleting path: ${path}`);
    rimraf.sync(path);
}
