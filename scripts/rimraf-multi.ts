import { Command } from 'commander';
import { rimraf } from 'rimraf';

const program = new Command();

program
  .option('-p, --paths <paths>', 'The paths to delete; multiples are comma separated.')
  .parse(process.argv);

const options = program.opts();

if (!options.paths) {
  console.error('Error: The option --paths is required');
  process.exit(1);
}

const paths = options.paths.split(',').filter((p) => !!p.trim());

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
