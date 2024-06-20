import { Expect, OnException } from "@layer92/core";
import { KnownAudioFileFormats } from "./KnownAudioFileFormats";
import { KnownImageFileFormats } from "./KnownImageFileFormats";
import { KnownUtf8CompatibleFileFormats } from "./KnownUtf8CompatibleFileFormats";
import { KnownUtf8IncompatibleFileFormats } from "./KnownUtf8IncompatibleFileFormats";
import { KnownVideoFileFormats } from "./KnownVideoFileFormats";

/**
 * values such as: "mp3", "jpg", "tar.gz" etc...
 */
export type FileFormat=string;

export function ExpectFileFormat(format:FileFormat,onFail?:OnException){
    Expect(format.length,`File format cannot be an empty string.`,onFail)
}

export function FileFormatToExtension(format:FileFormat){
    ExpectFileFormat(format);
    return "."+format;
}

export function IsFileFormatProbablyAudioFile(format:FileFormat){
    ExpectFileFormat(format);
    format=format.toLowerCase();
    return KnownAudioFileFormats.includes(format);
}

export function IsFileFormatProbablyVideoFile(format:FileFormat){
    ExpectFileFormat(format);
    format=format.toLowerCase();
    return KnownVideoFileFormats.includes(format);
}

export function IsFileFormatProbablyImageFile(format:FileFormat){
    ExpectFileFormat(format);
    format=format.toLowerCase();
    return KnownImageFileFormats.includes(format);
}

export function IsFileFormatProbablyUtf8Compatible(format:FileFormat){
    ExpectFileFormat(format);
    format=format.toLowerCase();
    return KnownUtf8CompatibleFileFormats.includes(format);
}

export function IsFileFormatProbablyUtf8Incompatible(format:FileFormat){
    ExpectFileFormat(format);
    format=format.toLowerCase();
    // always return false if a whitelisted utf8able format (eg svg is an image, but it's also utf8 compatible)
    if(KnownUtf8CompatibleFileFormats.includes(format)){
        return false;
    }
    return KnownUtf8IncompatibleFileFormats.includes(format);
}