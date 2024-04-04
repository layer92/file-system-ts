/// <reference types="node" />
import { FileNameBox } from "./FileNameBox";
import { FilePathBox } from "./FilePathBox";
import { FolderNameBox } from "./FolderNameBox";
import { BytesBox, OnException } from "@layer92/core";
import { FileSystemPathSanityExpecter } from "./FileSystemPathSanityExpecter";
import { FileSystemPathBox } from "./FileSystemPathBox";
import { FolderPathBox } from "./FolderPathBox";
type FileReadOptions = {
    encoding?: BufferEncoding;
};
type FileWriteOptions = {
    encoding?: BufferEncoding;
};
type FileOnExceptionCallbacks = {};
export declare class LocalFileSystem {
    protected _needs: {
        expectSaneFilePath?: FileSystemPathSanityExpecter;
    };
    constructor(_needs: {
        expectSaneFilePath?: FileSystemPathSanityExpecter;
    });
    readStringSync(filePathBox: FilePathBox, options?: FileReadOptions & FileOnExceptionCallbacks): string;
    readStringAsync(filePathBox: FilePathBox, options?: FileReadOptions): Promise<string>;
    getFileSizeBytesSync(pathBox: FilePathBox): number;
    getFileSizeBytesBoxSync(pathBox: FilePathBox): BytesBox;
    isEmptyFileSync(pathBox: FilePathBox): boolean;
    writeStringSync(data: string, pathBox: FilePathBox, options?: {
        encoding?: BufferEncoding;
        append?: boolean;
    }): void;
    readJsonSync(filePathBox: FilePathBox, options?: FileReadOptions): any;
    writeJsonSync(data: any, pathBox: FilePathBox, options?: FileWriteOptions): void;
    deleteFolderSync(folderPathBox: FolderPathBox, { areYouSure }: {
        areYouSure: "YES" | undefined;
    }): void;
    deleteFileSync(filePathBox: any, { areYouSure }: {
        areYouSure: "YES" | undefined;
    }): void;
    deleteSync(pathBox: FolderPathBox | FilePathBox, { areYouSure }: {
        areYouSure: "YES" | undefined;
    }): void;
    moveSync(fromPathBox: FolderPathBox | FilePathBox, toPathBox: FolderPathBox | FilePathBox, options?: {
        overwrite?: boolean;
    }): void;
    renameFileSync(fromPathBox: FilePathBox, toFileNameBox: FileNameBox, options?: {
        overwrite?: boolean;
    }): void;
    renameFolderSync(fromPathBox: FolderPathBox, toFileNameBox: FolderNameBox, options?: {
        overwrite?: boolean;
    }): void;
    moveIntoFolderSync(fromPath: FilePathBox | FolderPathBox, intoPath: FolderPathBox, options?: {
        overwrite?: boolean;
    }): void;
    copyIntoFolderSync(fromPathBox: FilePathBox | FolderPathBox, intoPathBox: FolderPathBox, options?: {
        overwrite?: boolean;
    }): void;
    expectFileExistsSync(filePathBox: FilePathBox, options?: {
        onDoesNotExist?: OnException;
    }): void;
    expectFolderExistsSync(folderPathBox: FolderPathBox, options?: {
        onDoesNotExist?: OnException;
    }): void;
    expectIsEmptyFolderSync(folderPathBox: FolderPathBox): void;
    isEmptyFolderSync(folderPathBox: FolderPathBox): boolean;
    expectPathExists(pathBox: FolderPathBox | FilePathBox): void;
    backupSync(filePath: FilePathBox): void;
    copySync(fromPathBox: FolderPathBox | FilePathBox, destinationBox: FilePathBox, options?: {
        overwrite?: boolean;
    }): void;
    /** Returns a pathBox that makes it clear it's a backup, and is guaranteed not to exist. Will probably have a number after it. */
    makeBackupPathFromFilePathSync(fromPath: FilePathBox): any;
    /** Returns whether or not a file exists at this path. */
    isExistingFilePathSync(pathBox: FolderPathBox | FilePathBox): boolean;
    /** Returns whether or not a folder exists at this path. */
    isExistingFolderPathSync(pathBox: FolderPathBox | FilePathBox): boolean;
    isFileSync(path: FolderPathBox | FilePathBox | string): boolean;
    isFolderSync(path: FolderPathBox | FilePathBox | string): boolean;
    /** Returns true if a folder or file exists at this path. */
    pathExistsSync(pathBox: FolderPathBox | FilePathBox): boolean;
    makeResolvedPathBox<T extends FileSystemPathBox>(fromPathBox: T): T;
    deleteChildrenSync({ folderPathBox, areYouSure, }: {
        folderPathBox: FolderPathBox;
        areYouSure: "YES" | undefined;
    }): void;
    deleteEmptyFolderSync(folderPathBox: FolderPathBox): void;
    /**
     * Returns the (boxed) FolderPaths and FilePaths that are immediate children of this FolderPath.
     */
    getChildrenBoxesSync({ folderPathBox, }: {
        folderPathBox: FolderPathBox;
    }): (FolderPathBox | FilePathBox)[];
    getChildrenFolderPathsSync({ folderPathBox, }: {
        folderPathBox: FolderPathBox;
    }): FolderPathBox[];
    getChildrenFilePathsSync({ folderPathBox, }: {
        folderPathBox: FolderPathBox;
    }): FilePathBox[];
    /**
     * Returns the (boxed) FolderPaths and FilePaths that are descendants of this FolderPath.
     * */
    getDescendantBoxesSync(folderPathBox: FolderPathBox): (FolderPathBox | FilePathBox)[];
    /**
     * Returns the (boxed) FilePaths that are descendants of this FolderPath.
     * */
    getDescendantFilePathBoxesSync(folderPathBox: FolderPathBox): FilePathBox[];
    /**
     * Returns the (boxed) FolderPaths that are descendants of this FolderPath.
     * */
    getDescendantFolderPathsBoxesSync(folderPathBox: FolderPathBox): FolderPathBox[];
    /**
     * Will make the folder (and any parent folders) exist if they don't already.
     */
    ensureFolderExistsSync(folderPathBox: FolderPathBox): void;
    /** If you provided a expectSaneFilePath callback when you initialized the localfilesystem, the path will be checked here to make sure it's sane. */
    maybeExpectSanePath(pathBox: FolderPathBox | FilePathBox): void;
}
export {};
