import { Expect } from "@layer92/core";

/**
 * - Cannot be ""
 * - Cannot contain "/"
 */
export type FolderName = string;

export function ExpectFolderName(
    data:FolderName
){
    Expect(data.length,"data: cannot be empty.");
    Expect(!data.includes("/"),"data: cannot have a slash in it.");
}