export type PluginEventHandler = (...args: any[]) => Promise<void>;
export type PluginEventHandlerList = PluginEventHandler[];

export interface Plugin {
  readonly onSongListRetrieved: PluginEventHandlerList;
	readonly onBeginDownload: PluginEventHandlerList;
	readonly onDownloadComplete: PluginEventHandlerList;
  readonly onAllDownloadsComplete: PluginEventHandlerList;
}
