import { OnException } from "@layer92/core";
import { FileFormatToExtension } from "./FileFormats/FileFormats";

import { Expect } from "@layer92/core";

/**
 * - Cannot contain "/"
 */
export type FileName = string;

/** a file name includes the extension, if the file has one */
export function ExpectFileName(data:FileName,onBadData?:OnException){
    Expect(data!==undefined,`data:undefined`,onBadData);
    Expect(!data.includes("/"),`Data: cannot include "/"`,onBadData);
}


/** @returns the extension, if it exists in the fileName. Will return undefined for files that don't have an extension (ie they don't have a "." or they end with a ".") */
export function MaybeGetFileNameExtension(fileName:FileName){
    ExpectFileName(fileName);
    const format = MaybeGetFormatFromFileName(fileName);
    if(format===undefined){
        return undefined;
    }
    return FileFormatToExtension(format);
}

/** @returns the format, if it exists in the fileName. Will return undefined for files that don't have an format in the name (ie they don't have a "." or they end with a ".") */
export function MaybeGetFormatFromFileName(fileName:FileName){
    const format = fileName.split(".").slice(-1)[0] as string|undefined;
    if( format===undefined||format==="" ){
        return undefined;
    }
    return format;
}

/** Returns the file name without the extension. NOTE that the extension is the very last .foo in the name. For example, the extension of "bar.tar.gz" is ".gz", so the basename would be "bar.tar" If a filename ends with a ".", it is considered part of the extension, as "." is not a valid extension and thus must be part of the base name (a filename is made of a base name optinally followed by an extension.). */
export function GetBaseNameFromFileName(fileName:FileName){
    const extensionString = MaybeGetFileNameExtension(fileName)||"";
    const data = fileName.slice(0,-extensionString.length);
    return data;
}