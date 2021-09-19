import { ArgumentInvalidError, ArgumentInvalidReason } from '../argument-invalid-error';
import { KhInsiderSong } from './khinsider-song';

export class KhInsiderDownloadData {
  /**
   * Initializes a new instance of the KhInsiderDownloadData
   * class.
   *
   * @param song The song that the download data came from.
   * @param data The binary data of the song.
   */
  constructor(readonly song: KhInsiderSong, readonly data: Buffer) {
    if (!song) {
      throw new ArgumentInvalidError('song', ArgumentInvalidReason.Null);
    }

    if (!data) {
      throw new ArgumentInvalidError('data', ArgumentInvalidReason.Null);
    }
  }
}
