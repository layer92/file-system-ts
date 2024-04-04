
import { Expect } from "@layer92/core";
import { FileNameBox } from "./FileNameBox";
import { FilePathBox } from "./FilePathBox";
import { FileSystemPathBox } from "./FileSystemPathBox";
import { FolderNameBox } from "./FolderNameBox";
import { Box } from "@layer92/core";

/**
 * According to wikipedia, if it's on-disk, it's called a "directory" and the graphic representation is a "folder", but we're going to call it a "folder" anyway.
 * https://en.wikipedia.org/wiki/Directory_(computing)
 */
export class FolderPathBox extends Box<string>{
    private __FolderPathBox__:undefined;
    
    constructor(
        data:string
    ){
        Expect(data.length,`data: Cannot be empty: `+data);
        Expect(data.endsWith("/"),`data: Must end with "/": `+data);
        Expect(!data.includes("*"),`data: Cannot have "*": `+data);
        super(data);
    }
    getFolderNameBox(){
        // note that the path ends in "/"
        const lastNode = this._data.split("/").slice(-2)[0];
        return new FolderNameBox(lastNode);
    }
    maybeGetParentPathBox(){
        const folderNameBox = this.getFolderNameBox();
        const folderNameWithSlash = folderNameBox.getData()+"/";
        const parentPath = this._data.slice(0,-folderNameWithSlash.length);
        if(!parentPath.length){
            return undefined;
        }
        return new FolderPathBox(parentPath);
    }
    isParentOfPathBox(somePath: FileSystemPathBox){
        if( somePath.getData()===this._data ){
            return false;
        }
        return somePath.getData().includes(this._data)
    }
    /** Returns a folderpath with the foldername renamed  */
    rename(toNameBox:FolderNameBox){
        const toFolder = this.maybeGetParentPathBox()?.getData()||"";
        return new FolderPathBox(toFolder+toNameBox.getData());
    }
    /** Returns a filepath of the file moved into the folder */
    moveIntoFolderBox(toFolderPath:FolderPathBox){
        const folderName = this.getFolderNameBox();
        return new FilePathBox(toFolderPath.getData()+folderName.getData());
    }
    makeChildFolderBox(childFolderName:FolderNameBox){
        return new FolderPathBox(
            this.getData()+childFolderName.getData()+"/"
        );
    }
    makeChildFileBox(childFileName:FileNameBox){
        return new FilePathBox(
            this.getData()+childFileName.getData()
        );
    }
}