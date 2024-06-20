"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeChildFilePath = exports.MakeChildFolderPath = exports.MoveFileSystemPathIntoFolderPath = exports.RenameFolderPath = exports.IsFolderPathParentOf = exports.MaybeGetFolderPathParentPath = exports.MaybeGetFolderPathFolderName = exports.IsFolderPathRelative = exports.IsFolderPathAbsolute = exports.ExpectFolderPath = void 0;
const core_1 = require("@layer92/core");
const FileNames_1 = require("./FileNames");
const FileSystemPaths_1 = require("./FileSystemPaths");
const FolderName_1 = require("./FolderName");
/**
 * According to wikipedia, if it's on-disk, it's called a "directory" and the graphic representation is a "folder", but we're going to call it a "folder" anyway.
 * https://en.wikipedia.org/wiki/Directory_(computing)
 *
 * Note some peculiar paths such as "/", the root directory, or "./", the local directory folder of a relative path, or "../", which refers to a parent path in a filesystem.
 */
function ExpectFolderPath(folderPath, onFail) {
    (0, FileSystemPaths_1.ExpectFileSystemPath)(folderPath, onFail);
    (0, core_1.Expect)(folderPath === "" || folderPath.endsWith("/"), `data: Must end with "/" if it's not the local directory folder (""): ` + folderPath);
    (0, core_1.Expect)(!folderPath.includes("*"), `data: Cannot have "*": ` + folderPath);
}
exports.ExpectFolderPath = ExpectFolderPath;
function IsFolderPathAbsolute(folderPath) {
    ExpectFolderPath(folderPath);
    return (0, FileSystemPaths_1.IsFileSystemPathAbsolute)(folderPath);
}
exports.IsFolderPathAbsolute = IsFolderPathAbsolute;
function IsFolderPathRelative(folderPath) {
    ExpectFolderPath(folderPath);
    return (0, FileSystemPaths_1.IsFileSystemPathRelative)(folderPath);
}
exports.IsFolderPathRelative = IsFolderPathRelative;
/** Returns undefined if the folder has no name. Might return ".." or "." if that is the name used in the path. */
function MaybeGetFolderPathFolderName(folderPath) {
    if (folderPath === "/") {
        return undefined;
    }
    ExpectFolderPath(folderPath);
    // note that the path ends in "/", so we take the second to last item of the split
    const lastNode = folderPath.split("/").slice(-2)[0];
    if (lastNode === "") {
        return undefined;
    }
    // note that a path in the form "foo/" will have lastNode be "foo"
    if (lastNode === "." || lastNode === "..")
        return lastNode;
}
exports.MaybeGetFolderPathFolderName = MaybeGetFolderPathFolderName;
/** @returns the folder path one level up from the given folder path, or undefined if the path has no parent */
function MaybeGetFolderPathParentPath(folderPath) {
    ExpectFolderPath(folderPath);
    return (0, FileSystemPaths_1.MaybeGetFileSystemPathParentPath)(folderPath);
}
exports.MaybeGetFolderPathParentPath = MaybeGetFolderPathParentPath;
/** Note that might not doesn't work if the path has .. or . inside of it, as we can't know the parentage in such case without access to the file system. */
function IsFolderPathParentOf(folderPath, fileSystemPath) {
    ExpectFolderPath(folderPath);
    if (folderPath === fileSystemPath) {
        return false;
    }
    return fileSystemPath.startsWith(folderPath);
}
exports.IsFolderPathParentOf = IsFolderPathParentOf;
/** Returns a folderpath with the foldername renamed  */
function RenameFolderPath(folderPath, toFolderName) {
    (0, FolderName_1.ExpectFolderName)(toFolderName);
    ExpectFolderPath(folderPath);
    const parentPath = MaybeGetFolderPathParentPath(folderPath);
    return parentPath + toFolderName;
}
exports.RenameFolderPath = RenameFolderPath;
/** Returns the path of the folder/file, moved into the specified folder */
function MoveFileSystemPathIntoFolderPath(fileSystemPath, toFolderPath) {
    (0, FileSystemPaths_1.ExpectFileSystemPath)(fileSystemPath);
    ExpectFolderPath(toFolderPath);
    const name = (0, FileSystemPaths_1.MaybeGetFileSystemPathName)(fileSystemPath);
    (0, core_1.Expect)(name, `Cannot move a path that has no name. Did you accidentally try to move the root folder?`);
    return toFolderPath + name;
}
exports.MoveFileSystemPathIntoFolderPath = MoveFileSystemPathIntoFolderPath;
function MakeChildFolderPath(folderPath, childFolderName) {
    ExpectFolderPath(folderPath);
    (0, FolderName_1.ExpectFolderName)(childFolderName);
    return folderPath + childFolderName + "/";
}
exports.MakeChildFolderPath = MakeChildFolderPath;
function MakeChildFilePath(folderPath, childFileName) {
    ExpectFolderPath(folderPath);
    (0, FileNames_1.ExpectFileName)(childFileName);
    return folderPath + childFileName;
}
exports.MakeChildFilePath = MakeChildFilePath;
