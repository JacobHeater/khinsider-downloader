/**
 * @description
 *
 * This script synchronizes the version information between the src
 * folder and the packagae.json file. The synchronization direction
 * is as illustrated below.
 *
 * package.json {version} -> src/app-config.json {version}
 *
 * This script is not intended, and should not work inversely.
 */

import fs from 'fs-extra';
import { EOL } from 'os';
import { join } from 'path';

import { version } from '../package.json';
import appConfig from '../src/app-config.json';

appConfig.version = version;

fs.writeFileSync(
  join(__dirname, '..', 'src', 'app-config.json'),
  JSON.stringify(appConfig, null, 2) + EOL
);
