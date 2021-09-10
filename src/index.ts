import { argv } from './argv';
import { KhInsiderNavigator } from './khinsider/khinsider-navigator';

const khinsiderNavigator = new KhInsiderNavigator(argv.album, argv.outdir, argv.format);

(async () => {
  await khinsiderNavigator.downloadAlbumAsync();
})();
