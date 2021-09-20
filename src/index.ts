import { ArgumentInvalidError, ArgumentInvalidReason } from './argument-invalid-error';
import { argv } from './argv';
import { KhInsiderNavigator } from './khinsider/khinsider-navigator';

if (!argv.album) {
  throw new ArgumentInvalidError('--album', ArgumentInvalidReason.Null);
}

if (!argv.outdir) {
  throw new ArgumentInvalidError('--outdir', ArgumentInvalidReason.Null);
}

const khinsiderNavigator = new KhInsiderNavigator(argv.album, argv.outdir, argv.format as 'mp3' | 'flac' || 'mp3');

(async () => {
  await khinsiderNavigator.downloadAlbumAsync();
})();
