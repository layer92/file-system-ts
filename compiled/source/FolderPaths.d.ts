import { OnException } from "@layer92/core";
import { FileName } from "./FileNames";
import { FolderName } from "./FolderName";
/**
 * - Can be "" (the local diretory folder)
 * - Ends with "/", unless it is ""
 * - Cannot contain "*"
 */
export type FolderPath = string;
/**
 * According to wikipedia, if it's on-disk, it's called a "directory" and the graphic representation is a "folder", but we're going to call it a "folder" anyway.
 * https://en.wikipedia.org/wiki/Directory_(computing)
 *
 * Note some peculiar paths such as "/", the root directory, or "./", the local directory folder of a relative path, or "../", which refers to a parent path in a filesystem.
 */
export declare function ExpectFolderPath(folderPath: FolderPath, onFail?: OnException): void;
export declare function IsFolderPathAbsolute(folderPath: FolderPath): boolean;
export declare function IsFolderPathRelative(folderPath: FolderPath): boolean;
/** Returns undefined if the folder has no name. Might return ".." or "." if that is the name used in the path. */
export declare function MaybeGetFolderPathFolderName(folderPath: FolderPath): FolderName;
/** @returns the folder path one level up from the given folder path, or undefined if the path has no parent */
export declare function MaybeGetFolderPathParentPath(folderPath: FolderPath): string;
/** Note that might not doesn't work if the path has .. or . inside of it, as we can't know the parentage in such case without access to the file system. */
export declare function IsFolderPathParentOf(folderPath: FolderPath, fileSystemPath: string): boolean;
/** Returns a folderpath with the foldername renamed  */
export declare function RenameFolderPath(folderPath: FolderPath, toFolderName: FolderName): string;
/** Returns the path of the folder/file, moved into the specified folder */
export declare function MoveFileSystemPathIntoFolderPath(fileSystemPath: string, toFolderPath: FolderPath): string;
export declare function MakeChildFolderPath(folderPath: FolderPath, childFolderName: FolderName): string;
export declare function MakeChildFilePath(folderPath: FolderPath, childFileName: FileName): string;
