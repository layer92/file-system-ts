import { Box, OnException } from "@layer92/core";
import { Expect } from "@layer92/core";

import { FileFormatBox } from "./FileFormatBox";
import { FileNameBox } from "./FileNameBox";
import { FolderPathBox } from "./FolderPathBox";

export class FilePathBox extends Box<string>{
    private FilePathBox:undefined;
    constructor(
        value:string,
        onBadData?:OnException
    ){
        Expect(!value.endsWith("/"),`value: ends with "/"`,onBadData);
        super(value);
    }
    getExtension(){
        return this.getFormatBox()?.toExtension();
    }
    getExtensionBox(){
        return this.getFormatBox()?.toExtensionBox();
    }
    getFormat(){
        const [lastNode] = this._data.split("/").slice(-1);
        const format = lastNode.split(".").slice(-1)[0] as string|undefined;
        if( !format ){
            return undefined;
        }
        return format;
    }
    getFormatBox(){
        const format = this.getFormat();
        if( !format ){
            return undefined;
        }
        return new FileFormatBox(format);
    }
    getFileName(){
        const lastNode = this._data.split("/").slice(-1)[0];
        return lastNode;
    }
    getFileNameBox(){
        return new FileNameBox(this.getFileName());
    }
    getParentPath(){
        const fileName = this.getFileNameBox();
        const parentPath = this._data.slice(0,-fileName.getData().length);
        return parentPath;
    }
    getParentPathBox(){
        return new FolderPathBox(this.getParentPath());
    }
    /** Returns a filepath with the filename renamed  */
    rename(toName:FileNameBox){
        const toFolder = this.getParentPathBox();
        return new FilePathBox(toFolder.getData()+toName.getData());
    }
    /** Returns a filepath of the file moved into the folder */
    moveIntoFolderBox(toFolderPath:FolderPathBox){
        const fileName = this.getFileNameBox();
        return new FilePathBox(toFolderPath.getData()+fileName.getData());
    }
    append(string:string){
        return new FilePathBox(
            this.getData()+string,
        );
    }
}