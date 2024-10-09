"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileSystem = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const core_1 = require("@layer92/core");
const DEFAULT_STRING_ENCODING = "utf-8";
class LocalFileSystem {
    /**
     *
     * @param _needs.observePath Callback will be called whenever a change to the filesystem is about to be made. You can check against critical accidents here if you need to run the code in a paranoid way.
     */
    constructor(_needs) {
        this._needs = _needs;
    }
    readStringSync(filePath, options) {
        (0, core_1.ExpectFilePath)(filePath);
        try {
            const string = (0, fs_1.readFileSync)(filePath, options?.encoding || DEFAULT_STRING_ENCODING);
            return string;
        }
        catch (e) {
            // TODO: figure out what errors are thrown and make callbacks for them
            throw e;
        }
    }
    async readStringAsync(filePath, options) {
        (0, core_1.ExpectFilePath)(filePath);
        const string = await (0, promises_1.readFile)(filePath, options?.encoding || DEFAULT_STRING_ENCODING);
        return string;
    }
    getFileSizeBytesSync(filePath) {
        (0, core_1.ExpectFilePath)(filePath);
        const bytes = (0, fs_1.statSync)(filePath).size;
        return bytes;
    }
    isEmptyFileSync(filePath) {
        return this.getFileSizeBytesSync(filePath) === 0;
    }
    writeStringSync(data, filePath, options) {
        (0, core_1.ExpectFilePath)(filePath);
        this._needs.observePath?.(filePath);
        if (options?.append) {
            (0, fs_1.appendFileSync)(filePath, data, options);
            return;
        }
        (0, fs_1.writeFileSync)(filePath, data, options);
    }
    readJsonSync(filePath, options) {
        const string = this.readStringSync(filePath, options);
        try {
            return JSON.parse(string);
        }
        catch (e) {
            throw new Error(`JSON parse error in file ${filePath}: ` + e.message);
        }
    }
    writeJsonSync(data, filePath, options) {
        (0, core_1.ExpectFilePath)(filePath);
        const string = JSON.stringify(data, null, 4);
        this.writeStringSync(string, filePath, options);
    }
    deleteFolderSync(folderPath, { areYouSure }) {
        (0, core_1.ExpectFolderPath)(folderPath);
        this._needs.observePath?.(folderPath);
        (0, core_1.Expect)(areYouSure === "YES", `areYouSure!=="YES"`);
        this.expectFolderExistsSync(folderPath);
        (0, fs_1.rmdirSync)(folderPath, { recursive: true });
    }
    deleteFileSync(filePath, { areYouSure }) {
        (0, core_1.ExpectFilePath)(filePath);
        this._needs.observePath?.(filePath);
        (0, core_1.Expect)(areYouSure === "YES", `areYouSure!=="YES"`);
        this.expectFileExistsSync(filePath);
        (0, fs_1.unlinkSync)(filePath);
    }
    deleteSync(path, { areYouSure }) {
        (0, core_1.ExpectFileSystemPath)(path);
        this._needs.observePath?.(path);
        (0, core_1.Expect)(areYouSure === "YES", `areYouSure!=="YES"`);
        this.expectPathExists(path);
        (0, fs_1.rmSync)(path, {
            recursive: true,
            // force: true,
        });
    }
    moveSync(fromPath, toPath, options) {
        (0, core_1.ExpectFileSystemPath)(fromPath);
        (0, core_1.ExpectFileSystemPath)(toPath);
        this._needs.observePath?.(toPath);
        if (fromPath === toPath) {
            return;
        }
        if (!options?.overwrite && this.pathExistsSync(toPath)) {
            throw new Error(`Destination exists: ` + toPath);
        }
        (0, fs_1.renameSync)(fromPath, toPath);
    }
    renameFileSync(fromFilePath, toFileName, options) {
        (0, core_1.ExpectFilePath)(fromFilePath);
        (0, core_1.ExpectFileName)(toFileName);
        const toFilePath = (0, core_1.RenameFilePathFileName)(fromFilePath, toFileName);
        this.moveSync(fromFilePath, toFilePath, options);
    }
    renameFolderSync(fromFolderPath, toFolderName, options) {
        const toFolderPath = (0, core_1.RenameFolderPath)(fromFolderPath, toFolderName);
        this.moveSync(fromFolderPath, toFolderPath, options);
    }
    moveIntoFolderSync(fromPath, intoFolderPath, options) {
        (0, core_1.ExpectFileSystemPath)(fromPath);
        (0, core_1.ExpectFolderPath)(intoFolderPath);
        const toPath = (0, core_1.MoveFileSystemPathIntoFolderPath)(fromPath, intoFolderPath);
        this.moveSync(fromPath, toPath, options);
    }
    copyIntoFolderSync(fromPath, intoFolderPath, options) {
        (0, core_1.ExpectFileSystemPath)(fromPath);
        (0, core_1.ExpectFolderPath)(intoFolderPath);
        const toPath = (0, core_1.MoveFileSystemPathIntoFolderPath)(fromPath, intoFolderPath);
        this.copySync(fromPath, toPath, options);
    }
    expectFileExistsSync(filePath, onDoesNotExist) {
        (0, core_1.ExpectFilePath)(filePath);
        (0, core_1.Expect)(this.isExistingFilePathSync(filePath), `File does not exist: ` + filePath, onDoesNotExist);
    }
    expectFolderExistsSync(folderPath, onDoesNotExist) {
        (0, core_1.ExpectFolderPath)(folderPath);
        (0, core_1.Expect)(this.isExistingFolderPathSync(folderPath), `Folder does not exist: ` + folderPath, onDoesNotExist);
    }
    expectIsEmptyFolderSync(folderPath, onNotEmpty) {
        (0, core_1.ExpectFolderPath)(folderPath);
        const isEmpty = this.isEmptyFolderSync(folderPath);
        (0, core_1.Expect)(isEmpty, "Folder was not empty: " + folderPath, onNotEmpty);
    }
    isEmptyFolderSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        const contents = this.getChildrenSync(folderPath);
        return contents.length === 0;
    }
    expectPathExists(fileSystemPath, onDoesNotExist) {
        (0, core_1.Expect)(this.pathExistsSync(fileSystemPath), `Path does not exist: ` + fileSystemPath, onDoesNotExist);
    }
    backupSync(filePath) {
        (0, core_1.ExpectFilePath)(filePath);
        const backupPathBox = this.makeBackupPathFromFilePathSync(filePath);
        this.copySync(filePath, backupPathBox);
    }
    copySync(fromPath, toPath, options) {
        (0, core_1.ExpectFileSystemPath)(fromPath);
        const overwrite = options?.overwrite;
        if (!overwrite && this.pathExistsSync(toPath)) {
            throw new Error("Destination already exists: " + toPath);
        }
        this._needs.observePath?.(toPath);
        (0, fs_1.copyFileSync)(fromPath, toPath);
    }
    /** Returns a pathBox that makes it clear it's a backup, and is guaranteed not to exist. Will probably have a number after it. */
    makeBackupPathFromFilePathSync(fromFilePath) {
        let backupFilePath;
        let number = 1;
        do {
            let numberString = ("00" + number).slice(-3);
            if (number > 999) {
                numberString = "" + number;
            }
            backupFilePath = fromFilePath + `.${numberString}.backup`;
            number += 1;
        } while (this.pathExistsSync(backupFilePath));
        return backupFilePath;
    }
    /** Returns whether or not a file exists at this path. */
    isExistingFilePathSync(fileSystemPath) {
        (0, core_1.ExpectFileSystemPath)(fileSystemPath);
        if (!this.pathExistsSync(fileSystemPath)) {
            return false;
        }
        return this.isFileSync(fileSystemPath);
    }
    /** Returns whether or not a folder exists at this path. */
    isExistingFolderPathSync(fileSystemPath) {
        (0, core_1.ExpectFileSystemPath)(fileSystemPath);
        if (!this.pathExistsSync(fileSystemPath)) {
            return false;
        }
        return this.isFolderSync(fileSystemPath);
    }
    isFileSync(fileSystemPath) {
        (0, core_1.ExpectFileSystemPath)(fileSystemPath);
        return !this.isFolderSync(fileSystemPath);
    }
    isFolderSync(fileSystemPath) {
        (0, core_1.ExpectFileSystemPath)(fileSystemPath);
        if (fileSystemPath.includes("../")) {
            fileSystemPath = (0, path_1.resolve)(fileSystemPath);
        }
        const stats = (0, fs_1.lstatSync)(fileSystemPath);
        return stats.isDirectory();
    }
    /** Returns true if a folder or file exists at this path. */
    pathExistsSync(fileSystemPath) {
        (0, core_1.ExpectFileSystemPath)(fileSystemPath);
        // unresolved pathBox with "../" will always return false
        // see others having this issue:
        // - https://stackoverflow.com/questions/55438404/fs-existssync-always-returning-false-when-path-has
        // - https://stackoverflow.com/questions/71604456/why-does-fs-existssync-always-return-false
        if (fileSystemPath.includes("../")) {
            fileSystemPath = this.makeResolvedPath(fileSystemPath);
        }
        return (0, fs_1.existsSync)(fileSystemPath);
    }
    makeResolvedPath(fromPath) {
        (0, core_1.ExpectFileSystemPath)(fromPath);
        const isFolder = (0, core_1.IsFileSystemPathFolderPath)(fromPath);
        const resolvedPath = (0, path_1.resolve)(fromPath);
        if (isFolder) {
            return resolvedPath + "/";
        }
        return resolvedPath;
    }
    deleteChildrenSync(folderPath, { areYouSure, }) {
        (0, core_1.ExpectFolderPath)(folderPath);
        (0, core_1.Expect)(areYouSure === "YES", `areYouSure!=="YES`);
        this.expectFolderExistsSync(folderPath);
        this._needs.observePath?.(folderPath);
        const children = this.getChildrenSync(folderPath);
        for (const child of children) {
            if ((0, core_1.IsFileSystemPathFolderPath)(child)) {
                this.deleteFolderSync(child, { areYouSure });
            }
            else {
                this.deleteFileSync(child, { areYouSure });
            }
        }
    }
    deleteEmptyFolderSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        this.expectIsEmptyFolderSync(folderPath);
        this.deleteFolderSync(folderPath, { areYouSure: "YES" });
    }
    /**
     * Returns the folder paths and file paths that are immediate children of the provided folder path.
     */
    getChildrenSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        const childPaths = [];
        this.expectFolderExistsSync(folderPath);
        const childNames = (0, fs_1.readdirSync)(folderPath);
        for (const childName of childNames) {
            let childPath = folderPath + childName;
            const isFolder = this.isFolderSync(childPath);
            if (isFolder) {
                childPath += "/";
            }
            childPaths.push(childPath);
        }
        return childPaths;
    }
    getChildrenFolderPathsSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        return this.getChildrenSync(folderPath).filter(a => (0, core_1.IsFileSystemPathFolderPath)(a));
    }
    getChildrenFilePathsSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        return this.getChildrenSync(folderPath).filter(a => (0, core_1.IsFileSystemPathFilePath)(a));
    }
    /**
     * Returns the folder and file paths that are descendants of the provided folder path.
     * */
    getDescendantsSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        const descendants = [];
        const fileSystem = this;
        function recurseUnchecked(folderPath) {
            const children = fileSystem.getChildrenSync(folderPath);
            for (const child of children) {
                descendants.push(child);
                if ((0, core_1.IsFileSystemPathFolderPath)(child)) {
                    recurseUnchecked(child);
                }
            }
        }
        recurseUnchecked(folderPath);
        return descendants;
    }
    /**
     * Returns the file paths that are descendants of the provided folder path.
     * */
    getDescendantFilePathBoxesSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        const fileDescendants = [];
        const fileSystem = this;
        function recurseUnchecked(folderPath) {
            const children = fileSystem.getChildrenSync(folderPath);
            for (const child of children) {
                if ((0, core_1.IsFileSystemPathFilePath)(child)) {
                    fileDescendants.push(child);
                }
                if ((0, core_1.IsFileSystemPathFolderPath)(child)) {
                    recurseUnchecked(child);
                }
            }
        }
        recurseUnchecked(folderPath);
        return fileDescendants;
    }
    /**
     * Returns the folder paths that are descendants of the provided folder path.
     * */
    getDescendantFolderPathsBoxesSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        const folderDescendants = [];
        const fileSystem = this;
        function recurseUnchecked(folderPath) {
            const children = fileSystem.getChildrenSync(folderPath);
            for (const child of children) {
                if ((0, core_1.IsFileSystemPathFolderPath)(child)) {
                    folderDescendants.push(child);
                    recurseUnchecked(child);
                }
            }
        }
        recurseUnchecked(folderPath);
        return folderDescendants;
    }
    /**
     * Will make the folder (and any parent folders) exist if they don't already.
     */
    ensureFolderExistsSync(folderPath) {
        (0, core_1.ExpectFolderPath)(folderPath);
        if (this.isExistingFolderPathSync(folderPath)) {
            return;
        }
        this._needs.observePath?.(folderPath);
        let wipPath = folderPath.startsWith("/") ? "/" : "";
        for (const nodeName of folderPath.split("/").filter(_ => _)) {
            wipPath += nodeName + "/";
            if (this.isExistingFilePathSync(wipPath)) {
                throw new Error("Cannot create folder, because a file already exists in the way of the folder path. Problem file's path: " + wipPath);
            }
            if (!this.isExistingFolderPathSync(wipPath)) {
                (0, fs_1.mkdirSync)(wipPath);
            }
        }
    }
}
exports.LocalFileSystem = LocalFileSystem;
