export class KhInsiderSong {
  constructor(readonly url: string, readonly name: string) {}

  get nameAsMp3(): string {
    return `${this.name}.mp3`;
  }
}
