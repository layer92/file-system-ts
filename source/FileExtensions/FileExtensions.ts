import { Expect, IsInCharset } from "@layer92/core";

import { KnownAudioFileExtensions } from "./KnownAudioFileExtensions";
import { KnownVideoFileExtensions } from "./KnownVideoFileExtensions";
import { KnownImageFileExtensions } from "./KnownImageFileExtensions";
import { KnownUtf8CompatibleFileExtensions } from "./KnownUtf8CompatibleFileExtensions";
import { KnownUtf8IncompatibleFileExtensions } from "./KnownUtf8IncompatibleFileExtensions";

/**
 * values such as: ".mp3", ".jpg", ".tar.gz" etc...
 * - Starts with "."
 * - Cannot be made of only "."s (".", "...", etc)
 * */
export type FileExtension = string;

export function ExpectFileExtension(extension:FileExtension){
    Expect(extension.startsWith("."),`data: expected to start with "."`);
    Expect(!IsInCharset(extension,"."),`File extension with only periods (".", "...", etc) is not valid.`);
}

export function FileExtensionToFormat(extension:FileExtension){
    extension=extension.toLowerCase();
    ExpectFileExtension(extension);
    return extension.slice(1);
}

export function IsFileExtensionProbablyAudioFile(extension:FileExtension){
    extension=extension.toLowerCase();
    ExpectFileExtension(extension);
    return KnownAudioFileExtensions.includes(extension);
}

export function IsFileExtensionProbablyVideoFile(extension:FileExtension){
    extension=extension.toLowerCase();
    ExpectFileExtension(extension);
    return KnownVideoFileExtensions.includes(extension);
}

export function IsFileExtensionProbablyImageFile(extension:FileExtension){
    extension=extension.toLowerCase();
    ExpectFileExtension(extension);
    return KnownImageFileExtensions.includes(extension);
}

export function IsFileExtensionProbablyUtf8Compatible(extension:FileExtension){
    extension=extension.toLowerCase();
    ExpectFileExtension(extension);
    return KnownUtf8CompatibleFileExtensions.includes(extension);
}

export function IsFileExtensionProbablyUtf8Incompatible(extension:FileExtension){
    extension=extension.toLowerCase();
    ExpectFileExtension(extension);
    // always return false if a whitelisted utf8able format (eg svg is an image, but it's also utf8 compatible)
    if(KnownUtf8CompatibleFileExtensions.includes(extension)){
        return false;
    }
    return KnownUtf8IncompatibleFileExtensions.includes(extension);
}