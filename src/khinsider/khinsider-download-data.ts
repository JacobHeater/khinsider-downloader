import { KhInsiderSong } from './khinsider-song';

export class KhInsiderDownloadData {
  constructor(readonly song: KhInsiderSong, readonly data: Buffer) {}
}
