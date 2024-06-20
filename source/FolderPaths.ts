
import { Expect, OnException } from "@layer92/core";
import { ExpectFileName, FileName } from "./FileNames";
import { ExpectFileSystemPath, IsFileSystemPathAbsolute, IsFileSystemPathRelative, MaybeGetFileSystemPathName, MaybeGetFileSystemPathParentPath } from "./FileSystemPaths";
import { ExpectFolderName, FolderName } from "./FolderName";
import { UnixFilesystemForbiddenCharset } from "./FileSystemCharsets";

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
export function ExpectFolderPath(
    folderPath:FolderPath,
    onFail?:OnException,
){
    ExpectFileSystemPath(folderPath,onFail);
    Expect(folderPath===""||folderPath.endsWith("/"),`data: Must end with "/" if it's not the local directory folder (""): `+folderPath);
    Expect(!folderPath.includes("*"),`data: Cannot have "*": `+folderPath);
}

export function IsFolderPathAbsolute(folderPath:FolderPath){
    ExpectFolderPath(folderPath);
    return IsFileSystemPathAbsolute(folderPath);
}

export function IsFolderPathRelative(folderPath:FolderPath){
    ExpectFolderPath(folderPath);
    return IsFileSystemPathRelative(folderPath);
}

/** Returns undefined if the folder has no name. Might return ".." or "." if that is the name used in the path. */
export function MaybeGetFolderPathFolderName(folderPath:FolderPath):FolderName{
    if(folderPath==="/"){
        return undefined;
    }
    ExpectFolderPath(folderPath);
    // note that the path ends in "/", so we take the second to last item of the split
    const lastNode = folderPath.split("/").slice(-2)[0];
    if(lastNode===""){
        return undefined;
    }
    // note that a path in the form "foo/" will have lastNode be "foo"
    if(lastNode==="."||lastNode==="..")
    return lastNode;
}

/** @returns the folder path one level up from the given folder path, or undefined if the path has no parent */
export function MaybeGetFolderPathParentPath(folderPath:FolderPath){
    ExpectFolderPath(folderPath);
    return MaybeGetFileSystemPathParentPath(folderPath);
}

/** Note that might not doesn't work if the path has .. or . inside of it, as we can't know the parentage in such case without access to the file system. */
export function IsFolderPathParentOf(folderPath:FolderPath,fileSystemPath:string){
    ExpectFolderPath(folderPath);
    if(folderPath===fileSystemPath){
        return false;
    }
    return fileSystemPath.startsWith(folderPath);
}

/** Returns a folderpath with the foldername renamed  */
export function RenameFolderPath(folderPath:FolderPath,toFolderName:FolderName){
    ExpectFolderName(toFolderName);
    ExpectFolderPath(folderPath);
    const parentPath = MaybeGetFolderPathParentPath(folderPath);
    return parentPath+toFolderName;
}

/** Returns the path of the folder/file, moved into the specified folder */
export function MoveFileSystemPathIntoFolderPath(fileSystemPath:string,toFolderPath:FolderPath){
    ExpectFileSystemPath(fileSystemPath);
    ExpectFolderPath(toFolderPath);
    const name = MaybeGetFileSystemPathName(fileSystemPath);
    Expect(name,`Cannot move a path that has no name. Did you accidentally try to move the root folder?`);
    return toFolderPath+name;
}


export function MakeChildFolderPath(folderPath:FolderPath,childFolderName:FolderName){
    ExpectFolderPath(folderPath);
    ExpectFolderName(childFolderName);
    return folderPath+childFolderName+"/";
}

export function MakeChildFilePath(folderPath:FolderPath,childFileName:FileName){
    ExpectFolderPath(folderPath);
    ExpectFileName(childFileName);
    return folderPath+childFileName;
}