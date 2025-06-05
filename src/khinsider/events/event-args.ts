export interface SongWriteToDiskEventArgs {
    path: string;
    fileName: string;
    format: 'mp3' | 'flac';
};
