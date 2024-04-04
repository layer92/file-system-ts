import { appendFileSync, copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, renameSync, rmdirSync, rmSync, statSync, unlinkSync, writeFileSync } from "fs";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { FileNameBox } from "./FileNameBox";
import { FilePathBox } from "./FilePathBox";
import { FolderNameBox } from "./FolderNameBox";
import { BytesBox, Expect, OnException } from "@layer92/core";

import { FileSystemPathSanityExpecter } from "./FileSystemPathSanityExpecter";
import { FileSystemPathBox } from "./FileSystemPathBox";
import { FolderPathBox } from "./FolderPathBox";

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
    constructor(protected _needs:{
        expectSaneFilePath?:FileSystemPathSanityExpecter
    }){
        
    }

    readStringSync(
        filePathBox: FilePathBox,
        options?: FileReadOptions&FileOnExceptionCallbacks
    ){
        try{
            const string = readFileSync(
                filePathBox.getData(),
                options?.encoding||DEFAULT_STRING_ENCODING
            );
            return string;
        }catch(e){
            // TODO: figure out what errors are thrown and make callbacks for them
            throw e;
        }
    }
    async readStringAsync(filePathBox:FilePathBox,options?:FileReadOptions){
        const string = await readFile(
            filePathBox.getData(),
            options?.encoding||DEFAULT_STRING_ENCODING
        );
        return string;
    }
    getFileSizeBytesSync(pathBox:FilePathBox){
        const bytes = statSync(pathBox.getData()).size;
        return bytes;
    }
    getFileSizeBytesBoxSync(pathBox:FilePathBox){
        const bytes = statSync(pathBox.getData()).size;
        return new BytesBox(bytes);
    }
    isEmptyFileSync(pathBox:FilePathBox){
        return this.getFileSizeBytesSync(pathBox)===0;
    }
    writeStringSync(
        data:string,
        pathBox:FilePathBox,
        options?:{
            encoding?:BufferEncoding,
            append?:boolean,
        }
    ){
        this.maybeExpectSanePath(pathBox);
        if( options?.append ){
            appendFileSync(
                pathBox.getData(),
                data,
                options,
            );
            return;
        }
        writeFileSync(
            pathBox.getData(),
            data,
            options
        );
    }
    readJsonSync(
        filePathBox:FilePathBox,
        options?:FileReadOptions,
    ){
        const string = this.readStringSync(filePathBox, options);
        try{
            return JSON.parse(string);
        }catch(e:any){
            throw new Error(`JSON parse error in file ${filePathBox.getData()}: `+e.message);
        }
    }
    writeJsonSync(
        data:any,
        pathBox:FilePathBox,
        options?:FileWriteOptions
    ){
        const string = JSON.stringify(data,null,4);
        this.writeStringSync(string,pathBox,options);
    }
    deleteFolderSync(folderPathBox:FolderPathBox,{areYouSure}:{areYouSure:"YES"|undefined}){
        this.maybeExpectSanePath(folderPathBox);
        Expect(areYouSure==="YES",`areYouSure!=="YES"`);
        this.expectFolderExistsSync(folderPathBox);
        rmdirSync(folderPathBox.getData(),{recursive:true});
    }
    deleteFileSync(filePathBox,{areYouSure}:{areYouSure:"YES"|undefined}){
        this.maybeExpectSanePath(filePathBox);
        Expect(areYouSure==="YES",`areYouSure!=="YES"`);
        this.expectFileExistsSync(filePathBox);
        unlinkSync(filePathBox.getData());
    }
    deleteSync(pathBox:FolderPathBox|FilePathBox,{areYouSure}:{areYouSure:"YES"|undefined}){
        this.maybeExpectSanePath(pathBox);
        Expect(areYouSure==="YES",`areYouSure!=="YES"`);
        this.expectPathExists(pathBox);
        rmSync(pathBox.getData(),{
            recursive:true,
            // force: true,
        });
    }
    moveSync(
        fromPathBox: FolderPathBox|FilePathBox,
        toPathBox: FolderPathBox|FilePathBox,
        options?:{overwrite?: boolean},
    ){
        this.maybeExpectSanePath(toPathBox);
        if(fromPathBox.getData()===toPathBox.getData()){
            return;
        }
        if( !options?.overwrite && this.pathExistsSync(toPathBox) ){
            throw new Error(`Destination exists: `+toPathBox.getData());
        }
        renameSync( fromPathBox.getData(), toPathBox.getData() );
    }
    renameFileSync(
        fromPathBox: FilePathBox,
        toFileNameBox: FileNameBox,
        options?:{overwrite?: boolean},
    ){
        const toPathBox = fromPathBox.rename(toFileNameBox);
        this.moveSync(fromPathBox, toPathBox, options);
    }
    renameFolderSync(
        fromPathBox: FolderPathBox,
        toFileNameBox: FolderNameBox,
        options?:{overwrite?: boolean}
    ){
        const toPathBox = fromPathBox.rename(toFileNameBox);
        this.moveSync(fromPathBox, toPathBox, options);
    }
    moveIntoFolderSync(
        fromPath: FilePathBox | FolderPathBox,
        intoPath: FolderPathBox,
        options?:{overwrite?: boolean}
    ) {
        const toPathBox = fromPath.moveIntoFolderBox(intoPath);
        this.moveSync(fromPath, toPathBox, options);
    }
    copyIntoFolderSync(
        fromPathBox: FilePathBox | FolderPathBox,
        intoPathBox: FolderPathBox,
        options?: {
            overwrite?: boolean;
        }
    ) {
        const toPath = fromPathBox.moveIntoFolderBox(intoPathBox);
        this.copySync(fromPathBox, toPath, options);
    }
    expectFileExistsSync(
        filePathBox:FilePathBox,
        options?:{
            onDoesNotExist?:OnException,
        }
    ){
        Expect(
            this.isExistingFilePathSync(filePathBox),
            `File does not exist: `+filePathBox.getData(),
            options?.onDoesNotExist,
        );
    }
    expectFolderExistsSync(
        folderPathBox:FolderPathBox,
        options?:{
            onDoesNotExist?:OnException,
        }
    ){
        Expect(
            this.isExistingFolderPathSync(folderPathBox),
            `Folder does not exist: `+folderPathBox.getData(),
            options?.onDoesNotExist,
        );
    }
    expectIsEmptyFolderSync(
        folderPathBox:FolderPathBox,
    ){
        const isEmpty = this.isEmptyFolderSync( folderPathBox );
        Expect(isEmpty, "Folder was not empty: "+folderPathBox.getData());
    }
    isEmptyFolderSync(
        folderPathBox:FolderPathBox,
    ){
        const contents = this.getChildrenBoxesSync({folderPathBox});
        return contents.length===0;
    }
    expectPathExists(
        pathBox:FolderPathBox|FilePathBox,
    ){
        Expect(this.pathExistsSync(pathBox),`Path does not exist: `+pathBox.getData());
    }
    backupSync(filePath:FilePathBox){
        const backupPathBox = this.makeBackupPathFromFilePathSync(filePath);
        this.copySync(filePath,backupPathBox);
    }
    copySync(
        fromPathBox: FolderPathBox|FilePathBox,
        destinationBox: FilePathBox,
        options?: {
            overwrite?: boolean;
        }
    ){
        const overwrite = options?.overwrite;
        if(!overwrite && this.pathExistsSync(destinationBox) ){
            throw new Error("Destination already exists: "+destinationBox.getData());
        }
        this.maybeExpectSanePath(destinationBox);
        copyFileSync(fromPathBox.getData(),destinationBox.getData());
    }
    /** Returns a pathBox that makes it clear it's a backup, and is guaranteed not to exist. Will probably have a number after it. */
    makeBackupPathFromFilePathSync(fromPath:FilePathBox){
        let backupPath;
        let number = 1;
        do{
            let numberString = ("00"+number).slice(-3);
            if(number>999){
                numberString=""+number;
            }
            backupPath = fromPath.append(`.${numberString}.backup`);
            number += 1;
        }while(
            this.pathExistsSync(backupPath)
        );
        return backupPath;
    }
    /** Returns whether or not a file exists at this path. */
    isExistingFilePathSync(pathBox:FolderPathBox|FilePathBox){
        if( !this.pathExistsSync(pathBox) ){
            return false;
        }
        return this.isFileSync(pathBox);
    }
    /** Returns whether or not a folder exists at this path. */
    isExistingFolderPathSync(pathBox:FolderPathBox|FilePathBox){
        if( !this.pathExistsSync(pathBox) ){
            return false;
        }
        return this.isFolderSync(pathBox);
    }
    isFileSync(path:FolderPathBox|FilePathBox|string){
        return !this.isFolderSync(path);
    }
    isFolderSync(path:FolderPathBox|FilePathBox|string){
        if(path instanceof FolderPathBox || path instanceof FilePathBox){
            path = path.getData();
        }
        if( path.includes("../") ){
            path = resolve(path);
        }
        const stats = lstatSync(path);
        return stats.isDirectory();
    }
    /** Returns true if a folder or file exists at this path. */
    pathExistsSync(pathBox:FolderPathBox|FilePathBox):boolean{
        // unresolved pathBox with "../" will always return false
        // see others having this issue:
        // - https://stackoverflow.com/questions/55438404/fs-existssync-always-returning-false-when-path-has
        // - https://stackoverflow.com/questions/71604456/why-does-fs-existssync-always-return-false
        if( pathBox.getData().includes("../") ){
            pathBox = this.makeResolvedPathBox(pathBox);
        }
        return existsSync(pathBox.getData());
    }
    
    makeResolvedPathBox<T extends FileSystemPathBox>(fromPathBox:T):T{
        const resolvedPath = resolve(fromPathBox.getData());
        if( fromPathBox instanceof FilePathBox ){
            return new FilePathBox(resolvedPath) as T;
        }else{
            return new FolderPathBox(resolvedPath+"/") as T;
        }
    }

    deleteChildrenSync({
        folderPathBox,
        areYouSure,
    }:{
        folderPathBox:FolderPathBox,
        areYouSure:"YES"|undefined,
    }){
        Expect(areYouSure==="YES",`areYouSure!=="YES`);
        this.maybeExpectSanePath(folderPathBox);
        const children = this.getChildrenBoxesSync({folderPathBox});
        for(const child of children){
            if( child instanceof FolderPathBox ){
                this.deleteFolderSync(child,{areYouSure});
            }else{
                this.deleteFileSync(child,{areYouSure});
            }
        }
    }
    deleteEmptyFolderSync(folderPathBox:FolderPathBox){
        this.expectIsEmptyFolderSync(folderPathBox);
        this.deleteFolderSync(folderPathBox,{areYouSure:"YES"});
    }
    /**
     * Returns the (boxed) FolderPaths and FilePaths that are immediate children of this FolderPath.
     */
    getChildrenBoxesSync({
        folderPathBox,
    }:{
        folderPathBox:FolderPathBox,
    }){
        const results:(FilePathBox|FolderPathBox)[] = [];
        this.expectFolderExistsSync(folderPathBox);
        const childNames = readdirSync(folderPathBox.getData());
        for(const childName of childNames){
            const childPath = folderPathBox.getData()+childName;
            let childBox:FilePathBox|FolderPathBox;
            if( this.isFolderSync(childPath) ){
                childBox = new FolderPathBox(childPath+"/");
            }else{
                childBox = new FilePathBox(childPath);
            }
            results.push(childBox);
        }
        return results;
    }
    getChildrenFolderPathsSync({
        folderPathBox,
    }:{
        folderPathBox:FolderPathBox,
    }){
        return this.getChildrenBoxesSync({folderPathBox}).filter(a=>a instanceof FolderPathBox) as FolderPathBox[];
    }
    getChildrenFilePathsSync({
        folderPathBox,
    }:{
        folderPathBox:FolderPathBox,
    }){
        return this.getChildrenBoxesSync({folderPathBox}).filter(a=>a instanceof FilePathBox) as FilePathBox[];
    }
    /**
     * Returns the (boxed) FolderPaths and FilePaths that are descendants of this FolderPath.
     * */
    getDescendantBoxesSync(folderPathBox:FolderPathBox){
        const results:(FilePathBox|FolderPathBox)[] = [];

        const fileSystem = this;

        function recurse(folderPathBox:FolderPathBox){
            const children = fileSystem.getChildrenBoxesSync({folderPathBox});
            for(const child of children){
                results.push(child);
                if(child instanceof FolderPathBox){
                    recurse(child);
                }
            }
        }
        recurse(folderPathBox);

        return results;
    }
    /**
     * Returns the (boxed) FilePaths that are descendants of this FolderPath.
     * */
    getDescendantFilePathBoxesSync(folderPathBox:FolderPathBox){
        const results:FilePathBox[] = [];

        const fileSystem = this;

        function recurse(folderPathBox:FolderPathBox){
            const children = fileSystem.getChildrenBoxesSync({folderPathBox});
            for(const child of children){
                if(child instanceof FilePathBox){
                    results.push(child);
                }
                if(child instanceof FolderPathBox){
                    recurse(child);
                }
            }
        }
        recurse(folderPathBox);

        return results;
    }
    /**
     * Returns the (boxed) FolderPaths that are descendants of this FolderPath.
     * */
    getDescendantFolderPathsBoxesSync(folderPathBox:FolderPathBox){
        const results:FolderPathBox[] = [];

        const fileSystem = this;

        function recurse(folderPathBox:FolderPathBox){
            const children = fileSystem.getChildrenBoxesSync({folderPathBox});
            for(const child of children){
                if(child instanceof FolderPathBox){
                    results.push(child);
                    recurse(child);
                }
            }
        }
        recurse(folderPathBox);

        return results;
    }
    /**
     * Will make the folder (and any parent folders) exist if they don't already.
     */
    ensureFolderExistsSync(folderPathBox:FolderPathBox){
        if( this.isExistingFolderPathSync(folderPathBox) ){
            return;
        }
        this.maybeExpectSanePath(folderPathBox);
        let wipPathValue = folderPathBox.getData().startsWith("/")?"/":"";
        for(const nodeName of folderPathBox.getData().split("/").filter(_=>_)){
            wipPathValue+=nodeName+"/";
            const wipPath = new FolderPathBox(wipPathValue);
            if( this.isExistingFilePathSync(wipPath) ){
                throw new Error("Cannot create folder, because a file already exists in the way of the folder path. Problem file's path: "+wipPathValue);
            }
            if( ! this.isExistingFolderPathSync(wipPath) ){
                mkdirSync(wipPathValue);
            }
        }
    }
    /** If you provided a expectSaneFilePath callback when you initialized the localfilesystem, the path will be checked here to make sure it's sane. */
    maybeExpectSanePath(pathBox: FolderPathBox|FilePathBox) {
        if(!this._needs.expectSaneFilePath){
            return;
        }
        this._needs.expectSaneFilePath(pathBox.getData());
    }
}

