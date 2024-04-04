import { Box } from "@layer92/core";
import { FileFormatBox } from "./FileFormatBox";
/** values such as: ".mp3", ".jpg", ".tar.gz" etc... */
export declare class FileExtensionBox extends Box<string> {
    constructor(data: string);
    static MakeFromFormatBox(format: FileFormatBox): FileExtensionBox;
    static MakeFromFormat(format: string): FileExtensionBox;
    toFormatBox(): FileFormatBox;
    toFormat(): string;
    isProbablyAudioFile(): boolean;
    isProbablyImageFile(): boolean;
    isProbablyVideoFile(): boolean;
    canProbablyUseUtf8Encoding(): boolean;
    getProbablyCannotUseUtf8Encoding(): boolean;
}
