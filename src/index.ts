// import { argv } from './argv';

import { KhInsiderNavigator } from "./khinsider/khinsider-navigator";

const khinsiderNavigator = new KhInsiderNavigator('super-mario-rpg-1996-snes');

(async () => {
    await khinsiderNavigator.downloadAlbumAsync();
})();
