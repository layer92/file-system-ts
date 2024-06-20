/**
 * - Cannot be ""
 * - Cannot contain "/"
 */
export type FolderName = string;
export declare function ExpectFolderName(data: FolderName): void;
