import download from 'download';
import { join } from 'path';

import { ArgumentInvalidError, ArgumentInvalidReason } from '../argument-invalid-error';
import { HtmlDomParser } from '../http/html-dom-parser';
import { FileInterface } from '../io/file-interface';
import { isStringFalsey } from '../validation/string-validation';
import { AlbumNotFoundError } from './album-not-found-error';
import { KhInsiderDownloadData } from './khinsider-download-data';
import { KhInsiderSong } from './khinsider-song';

export const BASE_URL: string = 'https://downloads.khinsider.com/game-soundtracks/album';

export class KhInsiderNavigator {
  /**
   * Inintializes a new instance of the KhInsiderNavigator class.
   *
   * @param albumName The name of the album to download.
   * @param outdir The directory to publish to.
   * @param format The format to download as.
   */
  constructor(private readonly albumName: string, outdir: string, private readonly format: 'mp3' | 'flac' = 'mp3') {
    if (isStringFalsey(albumName)) {
      throw new ArgumentInvalidError('albumName', ArgumentInvalidReason.Null);
    }

    if (isStringFalsey(outdir)) {
      throw new ArgumentInvalidError('outdir', ArgumentInvalidReason.Null);
    }

    if (isStringFalsey(format) || !['mp3', 'flac'].includes(format)) {
      throw new ArgumentInvalidError('format', ArgumentInvalidReason.InvalidFormat);
    }

    outdir = join(outdir, albumName);

    this.downloadUrl = getKhInsiderAlbumUrl(albumName);
    this.fileInterface = new FileInterface(outdir);
  }

  private readonly downloadUrl: string;
  private readonly fileInterface: FileInterface;

  /**
   * Downloads the album asynchronously from KHInsider.
   */
  async downloadAlbumAsync(): Promise<void> {
    console.log('Gathering song list...');
    const albumSongMp3Urls = await this.enumerateAlbumSongsAsync();
    console.log(`Found ${albumSongMp3Urls.length} songs to download.`);
    console.log(`Bulk downloading all ${albumSongMp3Urls.length} songs.`);
    let processedSongs: number = 0;
    await Promise.allSettled(
      albumSongMp3Urls.map(async (song) => {
        if (await this.fileInterface.fileExistsAsync(song.getNameAsFormat(this.format))) {
          processedSongs++;
          console.log(
            `${processedSongs} / ${albumSongMp3Urls.length} – Skipping "${song.getNameAsFormat(
              this.format
            )}" because it's already downloaded.`
          );
          return;
        }

        const download = await this.getSongBinaryFromKhInsiderSongAsync(song);
        if (!download) {
          console.warn(`There was no data from the download of ${song}. Skipping.`);
          return;
        }

        await this.fileInterface.writeFileAsync(
          download.song.getNameAsFormat(this.format),
          download.data
        );
        processedSongs++;
        console.log(
          `${processedSongs} / ${albumSongMp3Urls.length} – "${download.song.getNameAsFormat(
            this.format
          )}" successfully processed.`
        );
      })
    );

    console.log(
      `Finished downloading ${albumSongMp3Urls.length} songs to "${this.fileInterface.basePath}".`
    );
  }

  private async getSongBinaryFromKhInsiderSongAsync(
    song: KhInsiderSong
  ): Promise<KhInsiderDownloadData | undefined> {
    const songDownloadPage = await new HtmlDomParser().urlRequestToDomAsync(song.url);
    const document = songDownloadPage.window.document;
    const songDownloadLinks = document.querySelectorAll('.songDownloadLink');

    if (!songDownloadLinks.length) {
      return;
    }

    console.log(`Downloading "${song.getNameAsFormat(this.format)}" ...`);

    for (let i = 0; i < songDownloadLinks.length; i++) {
      const link = songDownloadLinks[i];
      const parent = link.parentNode;

      if (!link.textContent?.toLowerCase().includes(this.format)) {
        continue;
      }

      if (parent) {
        const destinationUrl = (parent as HTMLAnchorElement).href;
        const bytes = await download(destinationUrl);

        console.log(`Finished downloading "${song.name}."`);

        return new KhInsiderDownloadData(song, bytes);
      }
    }
  }

  private async enumerateAlbumSongsAsync(): Promise<KhInsiderSong[]> {
    const pageDom = await this.getAlbumPageDomAsync();
    const songList = pageDom.querySelector('#songlist');

    if (
      !songList ||
      pageDom.querySelector('#EchoTopic')?.textContent?.toLowerCase().includes('no such album')
    ) {
      throw new AlbumNotFoundError(this.albumName);
    }

    const songMp3Urls: KhInsiderSong[] = [];
    const tableRows = songList.querySelectorAll('tr');

    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];

      if (row.id) {
        continue;
      }

      const name = row.querySelector('td:nth-child(3)')?.textContent;
      const songNumber = parseInt(row.querySelector('td:nth-child(2)')?.textContent || '');
      const url = row.querySelector('a')?.href;

      if (!name || !url || isNaN(songNumber)) {
        continue;
      }

      if (url.includes('.mp3')) {
        const cleanUrl: string = `${BASE_URL}/${url.replace('/game-soundtracks/album/', '')}`;
        songMp3Urls.push(new KhInsiderSong(cleanUrl, name, songNumber));
      }
    }

    return songMp3Urls;
  }

  private async getAlbumPageDomAsync(): Promise<Document> {
    const page = await new HtmlDomParser().urlRequestToDomAsync(this.downloadUrl);

    return page.window.document;
  }
}

/**
 * Returns the URL for the khsinsider album with the album
 * name appended to the khinsider base URL.
 *
 * @param albumName The name of the khinsider album. This can be found as the
 *                  last part of the album URL.
 * @returns
 */
export function getKhInsiderAlbumUrl(albumName: string): string {
  return `${BASE_URL}/${albumName}`;
}
