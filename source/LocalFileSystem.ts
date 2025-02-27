import { appendFileSync, copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, renameSync, rmdirSync, rmSync, statSync, unlinkSync, writeFileSync } from "fs";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { Expect, ExpectFileName, ExpectFilePath, ExpectFileSystemPath, ExpectFolderPath, FileName, FilePath, FileSystemPath, FolderName, FolderPath, IsFileSystemPathFilePath, IsFileSystemPathFolderPath, MoveFileSystemPathIntoFolderPath, OnException, RenameFilePathFileName, RenameFolderPath } from "@layer92/core";




type FileReadOptions = {
    encoding?:BufferEncoding
}
type FileWriteOptions = {
    encoding?:BufferEncoding
}
// TODO: common node fs read exceptions such as file not found
type FileOnExceptionCallbacks = {

};

const DEFAULT_STRING_ENCODING = "utf-8";

export class LocalFileSystem {
    /**
     * 
     * @param _needs.observePath Callback will be called whenever a change to the filesystem is about to be made. You can check against critical accidents here if you need to run the code in a paranoid way.
     */
    constructor(protected _needs:{
        observePath?:(path:FileSystemPath)=>void
    }){
        
    }

    readStringSync(
        filePath:FilePath,
        options?: FileReadOptions&FileOnExceptionCallbacks
    ){
        ExpectFilePath(filePath)
        try{
            const string = readFileSync(
                filePath,
                options?.encoding||DEFAULT_STRING_ENCODING
            );
            return string;
        }catch(e){
            // TODO: figure out what errors are thrown and make callbacks for them
            throw e;
        }
    }
    async readStringAsync(filePath:FilePath,options?:FileReadOptions){
        ExpectFilePath(filePath);
        const string = await readFile(
            filePath,
            options?.encoding||DEFAULT_STRING_ENCODING
        );
        return string;
    }
    getFileSizeBytesSync(filePath:FilePath){
        ExpectFilePath(filePath)
        const bytes = statSync(filePath).size;
        return bytes;
    }
    isEmptyFileSync(filePath:FilePath){
        return this.getFileSizeBytesSync(filePath)===0;
    }
    writeStringSync(
        data:string,
        filePath:FilePath,
        options?:{
            encoding?:BufferEncoding,
            append?:boolean,
        }
    ){
        ExpectFilePath(filePath);
        this._needs.observePath?.(filePath);
        if( options?.append ){
            appendFileSync(
                filePath,
                data,
                options,
            );
            return;
        }
        writeFileSync(
            filePath,
            data,
            options
        );
    }
    readJsonSync(
        filePath:FilePath,
        options?:FileReadOptions,
    ){
        const string = this.readStringSync(filePath, options);
        try{
            return JSON.parse(string);
        }catch(e:any){
            throw new Error(`JSON parse error in file ${filePath}: `+e.message);
        }
    }
    writeJsonSync(
        data:any,
        filePath:FilePath,
        options?:FileWriteOptions
    ){
        ExpectFilePath(filePath);
        const string = JSON.stringify(data,null,4);
        this.writeStringSync(string,filePath,options);
    }
    deleteFolderSync(folderPath:FolderPath,{areYouSure}:{areYouSure:"YES"|undefined}){
        ExpectFolderPath(folderPath);
        this._needs.observePath?.(folderPath);
        Expect(areYouSure==="YES",`areYouSure!=="YES"`);
        this.expectFolderExistsSync(folderPath);
        rmdirSync(folderPath,{recursive:true});
    }
    deleteFileSync(filePath:FilePath,{areYouSure}:{areYouSure:"YES"|undefined}){
        ExpectFilePath(filePath);
        this._needs.observePath?.(filePath);
        Expect(areYouSure==="YES",`areYouSure!=="YES"`);
        this.expectFileExistsSync(filePath);
        unlinkSync(filePath);
    }
    deleteSync(path:FileSystemPath,{areYouSure}:{areYouSure:"YES"|undefined}){
        ExpectFileSystemPath(path);
        this._needs.observePath?.(path);
        Expect(areYouSure==="YES",`areYouSure!=="YES"`);
        this.expectPathExists(path);
        rmSync(path,{
            recursive:true,
            // force: true,
        });
    }
    moveSync(
        fromPath: string,
        toPath:string,
        options?:{overwrite?: boolean},
    ){
        ExpectFileSystemPath(fromPath);
        ExpectFileSystemPath(toPath);
        this._needs.observePath?.(toPath);
        if(fromPath===toPath){
            return;
        }
        if( !options?.overwrite && this.pathExistsSync(toPath) ){
            throw new Error(`Destination exists: `+toPath);
        }
        renameSync( fromPath, toPath );
    }
    renameFileSync(
        fromFilePath: FilePath,
        toFileName: FileName,
        options?:{overwrite?: boolean},
    ){
        ExpectFilePath(fromFilePath);
        ExpectFileName(toFileName);
        const toFilePath = RenameFilePathFileName(fromFilePath,toFileName);
        this.moveSync(fromFilePath, toFilePath, options);
    }
    renameFolderSync(
        fromFolderPath: FolderPath,
        toFolderName: FolderName,
        options?:{overwrite?: boolean}
    ){
        const toFolderPath = RenameFolderPath(fromFolderPath,toFolderName);
        this.moveSync(fromFolderPath, toFolderPath, options);
    }
    moveIntoFolderSync(
        fromPath: FileSystemPath,
        intoFolderPath: FolderPath,
        options?:{overwrite?: boolean}
    ) {
        ExpectFileSystemPath(fromPath);
        ExpectFolderPath(intoFolderPath);
        const toPath = MoveFileSystemPathIntoFolderPath(fromPath,intoFolderPath);
        this.moveSync(fromPath, toPath, options);
    }
    copyIntoFolderSync(
        fromPath: FileSystemPath,
        intoFolderPath: FolderPath,
        options?: {
            overwrite?: boolean;
        }
    ) {
        ExpectFileSystemPath(fromPath);
        ExpectFolderPath(intoFolderPath);
        const toPath = MoveFileSystemPathIntoFolderPath(fromPath,intoFolderPath);
        this.copySync(fromPath, toPath, options);
    }
    expectFileExistsSync(
        filePath:FilePath,
        onDoesNotExist?:OnException,
    ){
        ExpectFilePath(filePath);
        Expect(
            this.isExistingFilePathSync(filePath),
            `File does not exist: `+filePath,
            onDoesNotExist,
        );
    }
    expectFolderExistsSync(
        folderPath:FolderPath,
        onDoesNotExist?:OnException,
    ){
        ExpectFolderPath(folderPath);
        Expect(
            this.isExistingFolderPathSync(folderPath),
            `Folder does not exist: `+folderPath,
            onDoesNotExist,
        );
    }
    expectIsEmptyFolderSync(
        folderPath:FolderPath,
        onNotEmpty?:OnException
    ){
        ExpectFolderPath(folderPath);
        const isEmpty = this.isEmptyFolderSync( folderPath );
        Expect(isEmpty, "Folder was not empty: "+folderPath,onNotEmpty);
    }
    isEmptyFolderSync(
        folderPath:FolderPath
    ){
        ExpectFolderPath(folderPath);
        const contents = this.getChildrenSync(folderPath);
        return contents.length===0;
    }
    expectPathExists(
        fileSystemPath:FileSystemPath,
        onDoesNotExist?:OnException,
    ){
        Expect(this.pathExistsSync(fileSystemPath),`Path does not exist: `+fileSystemPath,onDoesNotExist);
    }
    backupSync(filePath:FilePath){
        ExpectFilePath(filePath);
        const backupPathBox = this.makeBackupPathFromFilePathSync(filePath);
        this.copySync(filePath,backupPathBox);
    }
    copySync(
        fromPath: FileSystemPath,
        toPath:string,
        options?: {
            overwrite?: boolean;
        }
    ){
        ExpectFileSystemPath(fromPath);
        const overwrite = options?.overwrite;
        if(!overwrite && this.pathExistsSync(toPath) ){
            throw new Error("Destination already exists: "+toPath);
        }
        this._needs.observePath?.(toPath);
        copyFileSync(fromPath,toPath);
    }
    /** Returns a pathBox that makes it clear it's a backup, and is guaranteed not to exist. Will probably have a number after it. */
    makeBackupPathFromFilePathSync(fromFilePath:FilePath){
        let backupFilePath:FilePath;
        let number = 1;
        do{
            let numberString = ("00"+number).slice(-3);
            if(number>999){
                numberString=""+number;
            }
            backupFilePath = fromFilePath + `.${numberString}.backup`;
            number += 1;
        }while(
            this.pathExistsSync(backupFilePath)
        );
        return backupFilePath;
    }
    /** Returns whether or not a file exists at this path. */
    isExistingFilePathSync(fileSystemPath:FileSystemPath){
        ExpectFileSystemPath(fileSystemPath);
        if( !this.pathExistsSync(fileSystemPath) ){
            return false;
        }
        return this.isFileSync(fileSystemPath);
    }
    /** Returns whether or not a folder exists at this path. */
    isExistingFolderPathSync(fileSystemPath:FileSystemPath){
        ExpectFileSystemPath(fileSystemPath);
        if( !this.pathExistsSync(fileSystemPath) ){
            return false;
        }
        return this.isFolderSync(fileSystemPath);
    }
    isFileSync(fileSystemPath:FileSystemPath){
        ExpectFileSystemPath(fileSystemPath);
        return !this.isFolderSync(fileSystemPath);
    }
    isFolderSync(fileSystemPath:FileSystemPath){
        ExpectFileSystemPath(fileSystemPath);
        this._needs.observePath?.(fileSystemPath);
        if( fileSystemPath.includes("../") ){
            fileSystemPath = resolve(fileSystemPath);
        }
        const stats = lstatSync(fileSystemPath);
        return stats.isDirectory();
    }
    /** Returns true if a folder or file exists at this path. */
    pathExistsSync(fileSystemPath:FileSystemPath):boolean{
        ExpectFileSystemPath(fileSystemPath);
        this._needs.observePath?.(fileSystemPath);
        // unresolved pathBox with "../" will always return false
        // see others having this issue:
        // - https://stackoverflow.com/questions/55438404/fs-existssync-always-returning-false-when-path-has
        // - https://stackoverflow.com/questions/71604456/why-does-fs-existssync-always-return-false
        if( fileSystemPath.includes("../") ){
            fileSystemPath = this.makeResolvedPath(fileSystemPath);
        }
        return existsSync(fileSystemPath);
    }
    
    makeResolvedPath(fromPath:FileSystemPath):string{
        ExpectFileSystemPath(fromPath);
        const isFolder = IsFileSystemPathFolderPath(fromPath);
        const resolvedPath = resolve(fromPath);
        if(isFolder){
            return resolvedPath+"/";
        }
        return resolvedPath;
    }

    deleteChildrenSync(
        folderPath:FolderPath,{
        areYouSure,
    }:{
        areYouSure:"YES"|undefined,
    }){
        ExpectFolderPath(folderPath);
        Expect(areYouSure==="YES",`areYouSure!=="YES`);
        this.expectFolderExistsSync(folderPath);
        this._needs.observePath?.(folderPath);
        const children = this.getChildrenSync(folderPath);
        for(const child of children){
            if( IsFileSystemPathFolderPath(child) ){
                this.deleteFolderSync(child,{areYouSure});
            }else{
                this.deleteFileSync(child,{areYouSure});
            }
        }
    }
    deleteEmptyFolderSync(folderPath:FolderPath){
        ExpectFolderPath(folderPath);
        this.expectIsEmptyFolderSync(folderPath);
        this.deleteFolderSync(folderPath,{areYouSure:"YES"});
    }
    /**
     * Returns the folder paths and file paths that are immediate children of the provided folder path.
     */
    getChildrenSync(folderPath:FolderPath){
        ExpectFolderPath(folderPath);
        const childPaths:string[] = [];
        this.expectFolderExistsSync(folderPath);
        const childNames = readdirSync(folderPath);
        for(const childName of childNames){
            let childPath = folderPath+childName;
            const isFolder = this.isFolderSync(childPath);
            if(isFolder){
                childPath+="/";
            }
            childPaths.push(childPath);
        }
        return childPaths;
    }
    getChildrenFolderPathsSync(folderPath:FolderPath):string[]{
        ExpectFolderPath(folderPath);
        return this.getChildrenSync(folderPath).filter(a=>IsFileSystemPathFolderPath(a));
    }
    getChildrenFilePathsSync(folderPath:FolderPath):string[]{
        ExpectFolderPath(folderPath);
        return this.getChildrenSync(folderPath).filter(a=>IsFileSystemPathFilePath(a));
    }
    /**
     * Returns the folder and file paths that are descendants of the provided folder path.
     * */
    getDescendantsSync(folderPath:FolderPath):string[]{
        ExpectFolderPath(folderPath);
        const descendants:string[] = [];

        const fileSystem = this;

        function recurseUnchecked(folderPath:FolderPath){
            const children = fileSystem.getChildrenSync(folderPath);
            for(const child of children){
                descendants.push(child);
                if(IsFileSystemPathFolderPath(child)){
                    recurseUnchecked(child);
                }
            }
        }
        recurseUnchecked(folderPath);

        return descendants;
    }
    /**
     * Returns the file paths that are descendants of the provided folder path.
     * */
    getDescendantFilePathBoxesSync(folderPath:FolderPath):string[]{
        ExpectFolderPath(folderPath);
        const fileDescendants:string[] = [];

        const fileSystem = this;

        function recurseUnchecked(folderPath:FolderPath){
            const children = fileSystem.getChildrenSync(folderPath);
            for(const child of children){
                if(IsFileSystemPathFilePath(child)){
                    fileDescendants.push(child);
                }
                if(IsFileSystemPathFolderPath(child)){
                    recurseUnchecked(child);
                }
            }
        }
        recurseUnchecked(folderPath);

        return fileDescendants;
    }
    /**
     * Returns the folder paths that are descendants of the provided folder path.
     * */
    getDescendantFolderPathsBoxesSync(folderPath:FolderPath):string[]{
        ExpectFolderPath(folderPath);
        const folderDescendants:string[] = [];

        const fileSystem = this;

        function recurseUnchecked(folderPath:FolderPath){
            const children = fileSystem.getChildrenSync(folderPath);
            for(const child of children){
                if(IsFileSystemPathFolderPath(child)){
                    folderDescendants.push(child);
                    recurseUnchecked(child);
                }
            }
        }
        recurseUnchecked(folderPath);

        return folderDescendants;
    }
    /**
     * Will make the folder (and any parent folders) exist if they don't already.
     */
    ensureFolderExistsSync(folderPath:FolderPath){
        ExpectFolderPath(folderPath);
        if( this.isExistingFolderPathSync(folderPath) ){
            return;
        }
        this._needs.observePath?.(folderPath);
        let wipPath = folderPath.startsWith("/")?"/":"";
        for(const nodeName of folderPath.split("/").filter(_=>_)){
            wipPath+=nodeName+"/";
            if( this.isExistingFilePathSync(wipPath) ){
                throw new Error("Cannot create folder, because a file already exists in the way of the folder path. Problem file's path: "+wipPath);
            }
            if( ! this.isExistingFolderPathSync(wipPath) ){
                mkdirSync(wipPath);
            }
        }
    }
}

