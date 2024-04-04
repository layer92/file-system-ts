import { FileNameBox } from "./FileNameBox";
import { FilePathBox } from "./FilePathBox";
import { FileSystemPathBox } from "./FileSystemPathBox";
import { FolderNameBox } from "./FolderNameBox";
import { Box } from "@layer92/core";
/**
 * According to wikipedia, if it's on-disk, it's called a "directory" and the graphic representation is a "folder", but we're going to call it a "folder" anyway.
 * https://en.wikipedia.org/wiki/Directory_(computing)
 */
export declare class FolderPathBox extends Box<string> {
    private __FolderPathBox__;
    constructor(data: string);
    getFolderNameBox(): FolderNameBox;
    maybeGetParentPathBox(): FolderPathBox;
    isParentOfPathBox(somePath: FileSystemPathBox): boolean;
    /** Returns a folderpath with the foldername renamed  */
    rename(toNameBox: FolderNameBox): FolderPathBox;
    /** Returns a filepath of the file moved into the folder */
    moveIntoFolderBox(toFolderPath: FolderPathBox): FilePathBox;
    makeChildFolderBox(childFolderName: FolderNameBox): FolderPathBox;
    makeChildFileBox(childFileName: FileNameBox): FilePathBox;
}
