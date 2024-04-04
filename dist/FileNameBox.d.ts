import { Box, OnException } from "@layer92/core";
import { FileExtensionBox } from "./FileExtensionBox";
import { FileFormatBox } from "./FileFormatBox";
/** includes the extension */
export declare class FileNameBox extends Box<string> {
    constructor(data: string, onBadData?: OnException);
    getExtension(): string;
    getExtensionBox(): FileExtensionBox;
    getFormat(): string;
    getFormatBox(): FileFormatBox;
    /** Returns the file name without the extension. NOTE that the extension is the very last .foo in the name. For example, the extension of "bar.tar.gz" is ".gz", so the basename would be "bar.tar" */
    getBaseName(): string;
}
