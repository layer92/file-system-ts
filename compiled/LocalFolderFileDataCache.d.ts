import { FolderPathBox } from "./FolderPathBox";
import { LocalFileSystem } from "./LocalFileSystem";
/** Allows you to cache data in files in a local folder. */
export declare class LocalFolderFileDataCache<Data> {
    private _needs;
    private _isCacheFolderInitialized;
    constructor(_needs: {
        fileSystem: LocalFileSystem;
        cacheFolderPath: FolderPathBox;
    });
    private _maybeInitialize;
    isCachedAsync(key: string): Promise<boolean>;
    getDataByKeyAsync(key: string): Promise<Data>;
    maybeGetDataByKeyAsync(key: string): Promise<Data>;
    cacheDataAsync(data: Data, key: string): Promise<void>;
    private _makeFilePathFromKey;
}
