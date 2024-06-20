import { ExpectFolderPath } from "./FolderPaths";
import { LocalFileSystem } from "./LocalFileSystem";

/** Allows you to cache data in files in a local folder. */
export class LocalFolderFileDataCache<Data>{
    private _isCacheFolderInitialized = false;
    
    constructor(private _needs:{
        fileSystem: LocalFileSystem;
        cacheFolderPath: string;
    }){
        ExpectFolderPath(_needs.cacheFolderPath);
    }
    
    private _maybeInitialize(){
        if(!this._isCacheFolderInitialized){
            this._needs.fileSystem.ensureFolderExistsSync(this._needs.cacheFolderPath);
            this._isCacheFolderInitialized=true;
        }
    }
    async isCachedAsync(key: string){
        this._maybeInitialize();
        const path = this._makeFilePathFromKey(key);
        return this._needs.fileSystem.isExistingFilePathSync(path);
    }
    async getDataByKeyAsync(key: string){
        this._maybeInitialize();
        const filePathBox = this._makeFilePathFromKey(key);
        const dataString = this._needs.fileSystem.readStringSync(filePathBox);
        const data = JSON.parse(dataString);
        return data as Data;
    }
    async maybeGetDataByKeyAsync(key: string){
        const isCached = await this.isCachedAsync(key);
        if(!isCached){
            return undefined;
        }
        return await this.getDataByKeyAsync(key);
    }
    async cacheDataAsync(data:Data,key:string){
        this._maybeInitialize();
        const cachedFilePath = this._makeFilePathFromKey(key);
        const dataString = JSON.stringify(data);
        this._needs.fileSystem.writeStringSync(dataString,cachedFilePath);
    }
    private _makeFilePathFromKey(key:string){
        return this._needs.cacheFolderPath+key;
    }

}