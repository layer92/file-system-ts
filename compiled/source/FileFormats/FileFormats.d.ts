import { OnException } from "@layer92/core";
/**
 * values such as: "mp3", "jpg", "tar.gz" etc...
 */
export type FileFormat = string;
export declare function ExpectFileFormat(format: FileFormat, onFail?: OnException): void;
export declare function FileFormatToExtension(format: FileFormat): string;
export declare function IsFileFormatProbablyAudioFile(format: FileFormat): boolean;
export declare function IsFileFormatProbablyVideoFile(format: FileFormat): boolean;
export declare function IsFileFormatProbablyImageFile(format: FileFormat): boolean;
export declare function IsFileFormatProbablyUtf8Compatible(format: FileFormat): boolean;
export declare function IsFileFormatProbablyUtf8Incompatible(format: FileFormat): boolean;
