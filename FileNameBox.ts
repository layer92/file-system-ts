import { Box, OnException } from "@layer92/core";
import { FileExtensionBox } from "./FileExtensionBox";
import { FileFormatBox } from "./FileFormatBox";

import { Expect } from "@layer92/core";

/** includes the extension */
export class FileNameBox extends Box<string>{

    constructor(data:string,onBadData?:OnException){
        Expect(data!==undefined,`data:undefined`,onBadData);
        Expect(!data.includes("/"),`Data: cannot include "/"`,onBadData);
        super(data);
    }

    getExtension(){
        return this.getExtensionBox()?.getData();
    }
    getExtensionBox(){
        const formatBox = this.getFormatBox();
        if(!formatBox){
            return undefined;
        }
        return FileExtensionBox.MakeFromFormatBox(formatBox);
    }
    getFormat(){
        const format = this._data.split(".").slice(-1)[0] as string|undefined;
        if( format===undefined ){
            return undefined;
        }
        return format;
    }
    getFormatBox(){
        const format = this.getFormat();
        if( format===undefined ){
            return undefined;
        }
        return new FileFormatBox(format);
    }
    /** Returns the file name without the extension. NOTE that the extension is the very last .foo in the name. For example, the extension of "bar.tar.gz" is ".gz", so the basename would be "bar.tar" */
    getBaseName(){
        const extensionString = this.getExtensionBox()?.getData()||"";
        const data = this._data.slice(0,-extensionString.length);
        return data;
    }
}