"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBaseNameFromFileName = exports.MaybeGetFormatFromFileName = exports.MaybeGetFileNameExtension = exports.ExpectFileName = void 0;
const FileFormats_1 = require("./FileFormats/FileFormats");
const core_1 = require("@layer92/core");
/** a file name includes the extension, if the file has one */
function ExpectFileName(data, onBadData) {
    (0, core_1.Expect)(data !== undefined, `data:undefined`, onBadData);
    (0, core_1.Expect)(!data.includes("/"), `Data: cannot include "/"`, onBadData);
}
exports.ExpectFileName = ExpectFileName;
/** @returns the extension, if it exists in the fileName. Will return undefined for files that don't have an extension (ie they don't have a "." or they end with a ".") */
function MaybeGetFileNameExtension(fileName) {
    ExpectFileName(fileName);
    const format = MaybeGetFormatFromFileName(fileName);
    if (format === undefined) {
        return undefined;
    }
    return (0, FileFormats_1.FileFormatToExtension)(format);
}
exports.MaybeGetFileNameExtension = MaybeGetFileNameExtension;
/** @returns the format, if it exists in the fileName. Will return undefined for files that don't have an format in the name (ie they don't have a "." or they end with a ".") */
function MaybeGetFormatFromFileName(fileName) {
    const format = fileName.split(".").slice(-1)[0];
    if (format === undefined || format === "") {
        return undefined;
    }
    return format;
}
exports.MaybeGetFormatFromFileName = MaybeGetFormatFromFileName;
/** Returns the file name without the extension. NOTE that the extension is the very last .foo in the name. For example, the extension of "bar.tar.gz" is ".gz", so the basename would be "bar.tar" If a filename ends with a ".", it is considered part of the extension, as "." is not a valid extension and thus must be part of the base name (a filename is made of a base name optinally followed by an extension.). */
function GetBaseNameFromFileName(fileName) {
    const extensionString = MaybeGetFileNameExtension(fileName) || "";
    const data = fileName.slice(0, -extensionString.length);
    return data;
}
exports.GetBaseNameFromFileName = GetBaseNameFromFileName;
