/// <reference types="node" />
import { OnException } from "@layer92/core";
import { FilePath } from "./FilePaths";
import { FolderPath } from "./FolderPaths";
import { FileSystemPath } from "./FileSystemPaths";
import { FileName } from "./FileNames";
import { FolderName } from "./FolderName";
type FileReadOptions = {
    encoding?: BufferEncoding;
};
type FileWriteOptions = {
    encoding?: BufferEncoding;
};
type FileOnExceptionCallbacks = {};
export declare class LocalFileSystem {
    protected _needs: {
        observePath?: (path: FileSystemPath) => void;
    };
    /**
     *
     * @param _needs.observePath Callback will be called whenever a change to the filesystem is about to be made. You can check against critical accidents here if you need to run the code in a paranoid way.
     */
    constructor(_needs: {
        observePath?: (path: FileSystemPath) => void;
    });
    readStringSync(filePath: FilePath, options?: FileReadOptions & FileOnExceptionCallbacks): string;
    readStringAsync(filePath: FilePath, options?: FileReadOptions): Promise<string>;
    getFileSizeBytesSync(filePath: FilePath): number;
    isEmptyFileSync(filePath: FilePath): boolean;
    writeStringSync(data: string, filePath: FilePath, options?: {
        encoding?: BufferEncoding;
        append?: boolean;
    }): void;
    readJsonSync(filePath: FilePath, options?: FileReadOptions): any;
    writeJsonSync(data: any, filePath: FilePath, options?: FileWriteOptions): void;
    deleteFolderSync(folderPath: FolderPath, { areYouSure }: {
        areYouSure: "YES" | undefined;
    }): void;
    deleteFileSync(filePath: FilePath, { areYouSure }: {
        areYouSure: "YES" | undefined;
    }): void;
    deleteSync(path: FileSystemPath, { areYouSure }: {
        areYouSure: "YES" | undefined;
    }): void;
    moveSync(fromPath: string, toPath: string, options?: {
        overwrite?: boolean;
    }): void;
    renameFileSync(fromFilePath: FilePath, toFileName: FileName, options?: {
        overwrite?: boolean;
    }): void;
    renameFolderSync(fromFolderPath: FolderPath, toFolderName: FolderName, options?: {
        overwrite?: boolean;
    }): void;
    moveIntoFolderSync(fromPath: FileSystemPath, intoFolderPath: FolderPath, options?: {
        overwrite?: boolean;
    }): void;
    copyIntoFolderSync(fromPath: FileSystemPath, intoFolderPath: FolderPath, options?: {
        overwrite?: boolean;
    }): void;
    expectFileExistsSync(filePath: FilePath, onDoesNotExist?: OnException): void;
    expectFolderExistsSync(folderPath: FolderPath, onDoesNotExist?: OnException): void;
    expectIsEmptyFolderSync(folderPath: FolderPath, onNotEmpty?: OnException): void;
    isEmptyFolderSync(folderPath: FolderPath): boolean;
    expectPathExists(fileSystemPath: FileSystemPath, onDoesNotExist?: OnException): void;
    backupSync(filePath: FilePath): void;
    copySync(fromPath: FileSystemPath, toPath: string, options?: {
        overwrite?: boolean;
    }): void;
    /** Returns a pathBox that makes it clear it's a backup, and is guaranteed not to exist. Will probably have a number after it. */
    makeBackupPathFromFilePathSync(fromFilePath: FilePath): string;
    /** Returns whether or not a file exists at this path. */
    isExistingFilePathSync(fileSystemPath: FileSystemPath): boolean;
    /** Returns whether or not a folder exists at this path. */
    isExistingFolderPathSync(fileSystemPath: FileSystemPath): boolean;
    isFileSync(fileSystemPath: FileSystemPath): boolean;
    isFolderSync(fileSystemPath: FileSystemPath): boolean;
    /** Returns true if a folder or file exists at this path. */
    pathExistsSync(fileSystemPath: FileSystemPath): boolean;
    makeResolvedPath(fromPath: FileSystemPath): string;
    deleteChildrenSync(folderPath: FolderPath, { areYouSure, }: {
        areYouSure: "YES" | undefined;
    }): void;
    deleteEmptyFolderSync(folderPath: FolderPath): void;
    /**
     * Returns the folder paths and file paths that are immediate children of the provided folder path.
     */
    getChildrenSync(folderPath: FolderPath): string[];
    getChildrenFolderPathsSync(folderPath: FolderPath): string[];
    getChildrenFilePathsSync(folderPath: FolderPath): string[];
    /**
     * Returns the folder and file paths that are descendants of the provided folder path.
     * */
    getDescendantsSync(folderPath: FolderPath): string[];
    /**
     * Returns the file paths that are descendants of the provided folder path.
     * */
    getDescendantFilePathBoxesSync(folderPath: FolderPath): string[];
    /**
     * Returns the folder paths that are descendants of the provided folder path.
     * */
    getDescendantFolderPathsBoxesSync(folderPath: FolderPath): string[];
    /**
     * Will make the folder (and any parent folders) exist if they don't already.
     */
    ensureFolderExistsSync(folderPath: FolderPath): void;
}
export {};
