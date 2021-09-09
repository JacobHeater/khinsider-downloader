import download from 'download';
import { homedir } from 'os';
import { join } from 'path';
import { HtmlDomParser } from '../http/html-dom-parser';
import { FileWriter } from '../io/file-writer';
import { KhInsiderDownloadData } from './khinsider-download-data';
import { KhInsiderSong } from './khinsider-song';

const BASE_URL: string = 'https://downloads.khinsider.com/game-soundtracks/album';

export class KhInsiderNavigator {
  /**
   * Inintializes a new instance of the KhInsiderNavigator class.
   *
   * @param albumName The name of the album to download.
   */
  constructor(albumName: string) {
    if (!albumName?.trim()) {
      throw new Error('Argument albumName is required.');
    }

    this.downloadUrl = getKhInsiderAlbumUrl(albumName);
  }

  private readonly downloadUrl: string;
  private readonly fileWriter: FileWriter = new FileWriter(join(homedir(), 'Downloads', 'test'));

  /**
   * Downloads the album asynchronously from KHInsider.
   */
  async downloadAlbumAsync(): Promise<void> {
    console.log('Gathering song list...');
    const albumSongMp3Urls = await this.enumerateAlbumSongsAsync();
    console.log(`Found ${albumSongMp3Urls.length} songs to download.`);
    console.log(`Bulk downloading all ${albumSongMp3Urls.length} songs.`);
    const downloads = await Promise.all(
      albumSongMp3Urls.map(async (song) => {
        const download = await this.getSongBinaryFromKhInsiderSongAsync(song);

        if (!download) {
          return;
        }

        await this.fileWriter.writeBufferAsync(`${download.song.name}.mp3`, download.data);
        console.log(`"${download.song.name}" successfully processed.`);
      })
    );
    console.log(`Finished downloading ${albumSongMp3Urls.length} songs.`);
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

    console.log(`Downloading "${song.name}" ...`);

    for (let i = 0; i < songDownloadLinks.length; i++) {
      const link = songDownloadLinks[i];
      const parent = link.parentNode;

      if (!link.textContent?.toLowerCase().includes('mp3')) {
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
      const url = row.querySelector('a')?.href;

      if (!name || !url) {
        continue;
      }

      if (url.includes('.mp3')) {
        const cleanUrl: string = `${BASE_URL}/${url.replace('/game-soundtracks/album/', '')}`;
        songMp3Urls.push(new KhInsiderSong(cleanUrl, name));
      }
    }

    return songMp3Urls;
  }

  private async getAlbumPageDomAsync(): Promise<Document> {
    const page = await new HtmlDomParser().urlRequestToDomAsync(this.downloadUrl);

    return page.window.document;
  }
}

export function getKhInsiderAlbumUrl(albumName: string): string {
  return `${BASE_URL}/${albumName}`;
}
