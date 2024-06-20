"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaybeGetFileSystemPathName = exports.MaybeGetFileSystemPathParentPath = exports.IsFileSystemPathFilePath = exports.IsFileSystemPathFolderPath = exports.IsFileSystemPathRelative = exports.IsFileSystemPathAbsolute = exports.ExpectFileSystemPath = void 0;
const core_1 = require("@layer92/core");
function ExpectFileSystemPath(path, onBadData) {
    (0, core_1.Expect)(path !== "", `A file system path cannot be an empty string. Perhaps you meant ".." or "."?`, onBadData);
    (0, core_1.Expect)(!path.includes("//"), `File system path cannot not have a "//". This may indicate a buggy concatenation.`);
}
exports.ExpectFileSystemPath = ExpectFileSystemPath;
function IsFileSystemPathAbsolute(path) {
    ExpectFileSystemPath(path);
    if (path === "") {
        return false;
    }
    return path.startsWith("/");
}
exports.IsFileSystemPathAbsolute = IsFileSystemPathAbsolute;
function IsFileSystemPathRelative(path) {
    ExpectFileSystemPath(path);
    if (path === "") {
        return true;
    }
    return !path.startsWith("/");
}
exports.IsFileSystemPathRelative = IsFileSystemPathRelative;
function IsFileSystemPathFolderPath(path) {
    ExpectFileSystemPath(path);
    if (path === "") {
        return true;
    }
    return path.endsWith("/");
}
exports.IsFileSystemPathFolderPath = IsFileSystemPathFolderPath;
function IsFileSystemPathFilePath(path) {
    return !IsFileSystemPathFolderPath(path);
}
exports.IsFileSystemPathFilePath = IsFileSystemPathFilePath;
/** @returns the folder path one level up from the given folder path, or undefined if the path has no parent */
function MaybeGetFileSystemPathParentPath(path) {
    ExpectFileSystemPath(path);
    if (path === "/") {
        return undefined;
    }
    const name = MaybeGetFileSystemPathName(path);
    (0, core_1.Expect)(name !== undefined);
    const nameNameWithSlash = name + "/";
    const parentPath = path.slice(0, -nameNameWithSlash.length);
    (0, core_1.Expect)(parentPath !== "");
    return parentPath;
}
exports.MaybeGetFileSystemPathParentPath = MaybeGetFileSystemPathParentPath;
/** Returns undefined if the folder/file specified by the path has no name. Might return ".." or "." if that is the name used in the path. */
function MaybeGetFileSystemPathName(fileSystemPath) {
    ExpectFileSystemPath(fileSystemPath);
    if (fileSystemPath === "/") {
        return undefined;
    }
    if (!fileSystemPath.endsWith("/")) {
        fileSystemPath += "/";
    }
    // because the path ends in "/", we take the second to last item of the split
    const lastNode = fileSystemPath.split("/").slice(-2)[0];
    (0, core_1.Expect)(lastNode !== "");
    return lastNode;
}
exports.MaybeGetFileSystemPathName = MaybeGetFileSystemPathName;
