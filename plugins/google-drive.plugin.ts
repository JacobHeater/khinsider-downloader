class GoogleDrivePlugin {
  onDownloadComplete = [handleSongDownloadComplete];
}

function handleSongDownloadComplete(...args: any[]) {
  console.log(...args);
}

export default new GoogleDrivePlugin();
