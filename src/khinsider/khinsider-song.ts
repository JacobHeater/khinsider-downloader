export class KhInsiderSong {
  constructor(readonly url: string, readonly name: string, readonly number: number) {}

  get nameAsMp3(): string {
    return `${this.number} - ${this.name}.mp3`;
  }

  get nameAsFlac(): string {
    return `${this.number} - ${this.name}.flac`;
  }

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
