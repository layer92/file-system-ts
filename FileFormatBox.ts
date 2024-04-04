import { Box } from "@layer92/core";
import { FileExtensionBox } from "./FileExtensionBox";

/** values such as: "mp3", "jpg", "tar.gz" etc... */
export class FileFormatBox extends Box<string>{

    toExtension(){
        return "."+this._data;
    }

    toExtensionBox(){
        return new FileExtensionBox(this.toExtension());
    }

    static FromExtensionBox(extension:FileExtensionBox){
        return new FileFormatBox( extension.getData().slice(1) );
    }
}