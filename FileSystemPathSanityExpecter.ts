import { Expect } from "@layer92/core";

export type FileSystemPathSanityExpecter = (path:string)=>void;

export const FileSystemPathSanityExpecter__ExpectSaneFileSystemPathBasic:FileSystemPathSanityExpecter = (path:string)=>{
    Expect(!path.includes("[object Object]"),`pathData: includes "[object Object]" pathData: ${path}`);
    Expect(!path.includes("*"), `pathData: includes "*" pathData: ${path}`);
    Expect(!path.includes("../"), `pathData: includes ".." pathData: ${path}`);
    Expect(path!=="/", `pathData: is "/"`);
}
