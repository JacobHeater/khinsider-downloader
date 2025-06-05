import { Command, Option } from 'commander';
import { version } from './app-config.json';
import { IS_TEST_MODE } from './env';

const program = new Command();
program.version(`KH Insider Downloader v${version}.`);

const albumOption = new Option('-a, --album <album>', 'The album to download.');
if (!IS_TEST_MODE) albumOption.required = true;
program.addOption(albumOption);

const outdirOption = new Option('-o, --outdir <directory>', 'The name of the folder to produce.');
if (!IS_TEST_MODE) outdirOption.required = true;
program.addOption(outdirOption);

const formatOption = new Option('-f, --format <format>', 'Which format do you want to download?')
  .choices(['flac', 'mp3'])
  .default('mp3');
program.addOption(formatOption);

const logLevelOption = new Option(
  '-l, --log-level <level>',
  'What level of logging verbosity do you want?'
)
  .choices(['info', 'warn', 'error'])
  .default('info');
program.addOption(logLevelOption);

const command = program.parse();
export const argv = command.opts();
