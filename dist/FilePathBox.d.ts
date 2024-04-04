import { Box, OnException } from "@layer92/core";
import { FileFormatBox } from "./FileFormatBox";
import { FileNameBox } from "./FileNameBox";
import { FolderPathBox } from "./FolderPathBox";
export declare class FilePathBox extends Box<string> {
    private FilePathBox;
    constructor(value: string, onBadData?: OnException);
    getExtension(): string;
    getExtensionBox(): import("./FileExtensionBox").FileExtensionBox;
    getFormat(): string;
    getFormatBox(): FileFormatBox;
    getFileName(): string;
    getFileNameBox(): FileNameBox;
    getParentPath(): string;
    getParentPathBox(): FolderPathBox;
    /** Returns a filepath with the filename renamed  */
    rename(toName: FileNameBox): FilePathBox;
    /** Returns a filepath of the file moved into the folder */
    moveIntoFolderBox(toFolderPath: FolderPathBox): FilePathBox;
    append(string: string): FilePathBox;
}
