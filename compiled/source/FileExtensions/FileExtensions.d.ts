/**
 * values such as: ".mp3", ".jpg", ".tar.gz" etc...
 * - Starts with "."
 * - Cannot be made of only "."s (".", "...", etc)
 * */
export type FileExtension = string;
export declare function ExpectFileExtension(extension: FileExtension): void;
export declare function FileExtensionToFormat(extension: FileExtension): string;
export declare function IsFileExtensionProbablyAudioFile(extension: FileExtension): boolean;
export declare function IsFileExtensionProbablyVideoFile(extension: FileExtension): boolean;
export declare function IsFileExtensionProbablyImageFile(extension: FileExtension): boolean;
export declare function IsFileExtensionProbablyUtf8Compatible(extension: FileExtension): boolean;
export declare function IsFileExtensionProbablyUtf8Incompatible(extension: FileExtension): boolean;
