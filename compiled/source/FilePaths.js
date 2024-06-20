"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameFilePathFileName = exports.MaybeGetFilePathParentPath = exports.GetFilePathFileName = exports.MaybeGetFilePathFileFormat = exports.MaybeGetFilePathFileExtension = exports.IsFilePathRelative = exports.IsFilePathAbsolute = exports.ExpectFilePath = void 0;
const core_1 = require("@layer92/core");
const FileFormats_1 = require("./FileFormats/FileFormats");
const FileNames_1 = require("./FileNames");
const FileSystemPaths_1 = require("./FileSystemPaths");
function ExpectFilePath(filePath, onFail) {
    (0, FileSystemPaths_1.ExpectFileSystemPath)(filePath, onFail);
    (0, core_1.Expect)(!filePath.endsWith("/"), `value: ends with "/"`, onFail);
}
exports.ExpectFilePath = ExpectFilePath;
function IsFilePathAbsolute(filePath) {
    ExpectFilePath(filePath);
    return (0, FileSystemPaths_1.IsFileSystemPathAbsolute)(filePath);
}
exports.IsFilePathAbsolute = IsFilePathAbsolute;
function IsFilePathRelative(filePath) {
    ExpectFilePath(filePath);
    return (0, FileSystemPaths_1.IsFileSystemPathRelative)(filePath);
}
exports.IsFilePathRelative = IsFilePathRelative;
function MaybeGetFilePathFileExtension(filePath) {
    ExpectFilePath(filePath);
    const format = MaybeGetFilePathFileFormat(filePath);
    if (format === undefined) {
        return undefined;
    }
    return (0, FileFormats_1.FileFormatToExtension)(format);
}
exports.MaybeGetFilePathFileExtension = MaybeGetFilePathFileExtension;
function MaybeGetFilePathFileFormat(filePath) {
    ExpectFilePath(filePath);
    const [lastNode] = filePath.split("/").slice(-1);
    const format = lastNode.split(".").slice(-1)[0];
    if (format === undefined || format === "") {
        return undefined;
    }
    return format;
}
exports.MaybeGetFilePathFileFormat = MaybeGetFilePathFileFormat;
/** Returns the fileName at the end of the filePath */
function GetFilePathFileName(filePath) {
    ExpectFilePath(filePath);
    const lastNode = filePath.split("/").slice(-1)[0];
    (0, FileNames_1.ExpectFileName)(lastNode);
    return lastNode;
}
exports.GetFilePathFileName = GetFilePathFileName;
/** @returns the folder path one level up from the given file path, or undefined if the path has no parent */
function MaybeGetFilePathParentPath(filePath) {
    ExpectFilePath(filePath);
    return (0, FileSystemPaths_1.MaybeGetFileSystemPathParentPath)(filePath);
}
exports.MaybeGetFilePathParentPath = MaybeGetFilePathParentPath;
/** Returns a filepath with the filename renamed  */
function RenameFilePathFileName(filePath, toFileName) {
    ExpectFilePath(filePath);
    (0, FileNames_1.ExpectFileName)(toFileName);
    const toFolder = MaybeGetFilePathParentPath(filePath);
    return toFolder + toFileName;
}
exports.RenameFilePathFileName = RenameFilePathFileName;
