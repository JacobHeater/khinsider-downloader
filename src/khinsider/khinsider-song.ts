export class KhInsiderSong {
  /**
   * Initializes a new instance of the KhInsiderSong class.
   *
   * @param url The URL of the song, including the album.
   * @param name The name of the song.
   * @param number The track number of the song in the list.
   */
  constructor(readonly url: string, readonly name: string, readonly number: number) {}

  /**
   * Gets the name as an mp3 file.
   */
  get nameAsMp3(): string {
    return `${this.number} - ${this.name}.mp3`;
  }

  /**
   * Gets the name as a flac file.
   */
  get nameAsFlac(): string {
    return `${this.number} - ${this.name}.flac`;
  }

  /**
   * Returns the name of the song as the formatted name.
   *
   * @param format The format of the song to get the name for (mp3 | flac).
   * @returns
   */
  getNameAsFormat(format: string): string {
    switch (format) {
      case 'mp3':
        return this.nameAsMp3;
      case 'flac':
        return this.nameAsFlac;
      default:
        throw new Error('Argument format out of range.');
    }
  }
}
