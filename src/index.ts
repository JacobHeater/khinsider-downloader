import { argv } from './argv';
import { KhInsiderNavigator } from './khinsider/khinsider-navigator';

const khinsiderNavigator = new KhInsiderNavigator(argv.album, argv.outdir, argv.format as 'mp3' | 'flac' || 'mp3');

(async () => {
  await khinsiderNavigator.downloadAlbumAsync();
})();
