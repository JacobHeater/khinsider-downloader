export class AlbumNotFoundError extends Error {
  /**
   * Initializes a new instance of the AlbumNotFoundError class.
   *
   * @param albumName The album that was searched.
   */
  constructor(albumName: string) {
    super(`Album ${albumName} was not found.`);

    Object.setPrototypeOf(this, AlbumNotFoundError.prototype);
  }
}
