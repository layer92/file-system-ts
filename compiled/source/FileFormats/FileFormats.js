"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFileFormatProbablyUtf8Incompatible = exports.IsFileFormatProbablyUtf8Compatible = exports.IsFileFormatProbablyImageFile = exports.IsFileFormatProbablyVideoFile = exports.IsFileFormatProbablyAudioFile = exports.FileFormatToExtension = exports.ExpectFileFormat = void 0;
const core_1 = require("@layer92/core");
const KnownAudioFileFormats_1 = require("./KnownAudioFileFormats");
const KnownImageFileFormats_1 = require("./KnownImageFileFormats");
const KnownUtf8CompatibleFileFormats_1 = require("./KnownUtf8CompatibleFileFormats");
const KnownUtf8IncompatibleFileFormats_1 = require("./KnownUtf8IncompatibleFileFormats");
const KnownVideoFileFormats_1 = require("./KnownVideoFileFormats");
function ExpectFileFormat(format, onFail) {
    (0, core_1.Expect)(format.length, `File format cannot be an empty string.`, onFail);
}
exports.ExpectFileFormat = ExpectFileFormat;
function FileFormatToExtension(format) {
    ExpectFileFormat(format);
    return "." + format;
}
exports.FileFormatToExtension = FileFormatToExtension;
function IsFileFormatProbablyAudioFile(format) {
    ExpectFileFormat(format);
    format = format.toLowerCase();
    return KnownAudioFileFormats_1.KnownAudioFileFormats.includes(format);
}
exports.IsFileFormatProbablyAudioFile = IsFileFormatProbablyAudioFile;
function IsFileFormatProbablyVideoFile(format) {
    ExpectFileFormat(format);
    format = format.toLowerCase();
    return KnownVideoFileFormats_1.KnownVideoFileFormats.includes(format);
}
exports.IsFileFormatProbablyVideoFile = IsFileFormatProbablyVideoFile;
function IsFileFormatProbablyImageFile(format) {
    ExpectFileFormat(format);
    format = format.toLowerCase();
    return KnownImageFileFormats_1.KnownImageFileFormats.includes(format);
}
exports.IsFileFormatProbablyImageFile = IsFileFormatProbablyImageFile;
function IsFileFormatProbablyUtf8Compatible(format) {
    ExpectFileFormat(format);
    format = format.toLowerCase();
    return KnownUtf8CompatibleFileFormats_1.KnownUtf8CompatibleFileFormats.includes(format);
}
exports.IsFileFormatProbablyUtf8Compatible = IsFileFormatProbablyUtf8Compatible;
function IsFileFormatProbablyUtf8Incompatible(format) {
    ExpectFileFormat(format);
    format = format.toLowerCase();
    // always return false if a whitelisted utf8able format (eg svg is an image, but it's also utf8 compatible)
    if (KnownUtf8CompatibleFileFormats_1.KnownUtf8CompatibleFileFormats.includes(format)) {
        return false;
    }
    return KnownUtf8IncompatibleFileFormats_1.KnownUtf8IncompatibleFileFormats.includes(format);
}
exports.IsFileFormatProbablyUtf8Incompatible = IsFileFormatProbablyUtf8Incompatible;
