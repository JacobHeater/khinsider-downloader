import download from 'download';
import { join } from 'path';

import { HtmlDomParser } from '../http/html-dom-parser';
import { FileReader } from '../io/file-reader';
import { FileWriter } from '../io/file-writer';
import { KhInsiderDownloadData } from './khinsider-download-data';
import { KhInsiderSong } from './khinsider-song';

const BASE_URL: string = 'https://downloads.khinsider.com/game-soundtracks/album';

export class KhInsiderNavigator {
  /**
   * Inintializes a new instance of the KhInsiderNavigator class.
   *
   * @param albumName The name of the album to download.
   * @param outdir The directory to publish to.
   * @param format The format to download as.
   */
  constructor(albumName: string, outdir: string, private readonly format: string = 'mp3') {
    if (!albumName?.trim()) {
      throw new Error('Argument albumName is required.');
    }

    if (!outdir) {
      throw new Error('Argument outdir is required.');
    }

    outdir = join(outdir, albumName);

    this.downloadUrl = getKhInsiderAlbumUrl(albumName);
    this.fileWriter = new FileWriter(outdir);
    this.fileReader = new FileReader(outdir);
  }

  private readonly downloadUrl: string;
  private readonly fileWriter: FileWriter;
  private readonly fileReader: FileReader;

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
        if (await this.fileReader.fileExistsAsync(song.getNameAsFormat(this.format))) {
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
          return;
        }

        await this.fileWriter.writeFileAsync(
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
      `Finished downloading ${albumSongMp3Urls.length} songs to "${this.fileWriter.filePath}".`
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
      return [];
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
