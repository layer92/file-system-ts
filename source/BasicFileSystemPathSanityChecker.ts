import { Expect, OnException, ReplaceCharacters } from "@layer92/core";

/**
 * Checks that the path doesn't have any common mistakes / accidents, and throws an error if such would happen.
 * 
 * This is useful for making quick utilties where you want to have peace of mind from erasing important files, etc..., but should not be used for code where you're handling production client input, etc...
 * 
 * ## Blocks:
 * - paths that contain "[object Object]"
 * - paths that include "*"
 * - paths that include "../"
 * - the path "/"
 */
export const BasicFileSystemPathSanityChecker = (path:string,onBadPath?:OnException)=>{
    // path = decodeURIComponent(path);
    path = ReplaceCharacters(path,"%2F","/");// %2F appears to be treated as "/" by node's file functions
    Expect(!path.includes("[object Object]"),`pathData: includes "[object Object]" pathData: ${path}`,onBadPath);
    Expect(!path.includes("*"), `pathData: includes "*" pathData: ${path}`,onBadPath);
    Expect(!path.includes("../"), `pathData: includes "../" pathData: ${path}`,onBadPath);
    Expect(path!=="/", `pathData: is "/"`,onBadPath);
}
