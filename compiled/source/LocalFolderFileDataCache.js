"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFolderFileDataCache = void 0;
const FolderPaths_1 = require("./FolderPaths");
/** Allows you to cache data in files in a local folder. */
class LocalFolderFileDataCache {
    constructor(_needs) {
        this._needs = _needs;
        this._isCacheFolderInitialized = false;
        (0, FolderPaths_1.ExpectFolderPath)(_needs.cacheFolderPath);
    }
    _maybeInitialize() {
        if (!this._isCacheFolderInitialized) {
            this._needs.fileSystem.ensureFolderExistsSync(this._needs.cacheFolderPath);
            this._isCacheFolderInitialized = true;
        }
    }
    async isCachedAsync(key) {
        this._maybeInitialize();
        const path = this._makeFilePathFromKey(key);
        return this._needs.fileSystem.isExistingFilePathSync(path);
    }
    async getDataByKeyAsync(key) {
        this._maybeInitialize();
        const filePathBox = this._makeFilePathFromKey(key);
        const dataString = this._needs.fileSystem.readStringSync(filePathBox);
        const data = JSON.parse(dataString);
        return data;
    }
    async maybeGetDataByKeyAsync(key) {
        const isCached = await this.isCachedAsync(key);
        if (!isCached) {
            return undefined;
        }
        return await this.getDataByKeyAsync(key);
    }
    async cacheDataAsync(data, key) {
        this._maybeInitialize();
        const cachedFilePath = this._makeFilePathFromKey(key);
        const dataString = JSON.stringify(data);
        this._needs.fileSystem.writeStringSync(dataString, cachedFilePath);
    }
    _makeFilePathFromKey(key) {
        return this._needs.cacheFolderPath + key;
    }
}
exports.LocalFolderFileDataCache = LocalFolderFileDataCache;
