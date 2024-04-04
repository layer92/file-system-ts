import { Box } from "@layer92/core";
import { FileExtensionBox } from "./FileExtensionBox";
/** values such as: "mp3", "jpg", "tar.gz" etc... */
export declare class FileFormatBox extends Box<string> {
    toExtension(): string;
    toExtensionBox(): FileExtensionBox;
    static FromExtensionBox(extension: FileExtensionBox): FileFormatBox;
}
