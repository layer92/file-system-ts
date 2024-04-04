"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileSystem = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const FilePathBox_1 = require("./FilePathBox");
const core_1 = require("@layer92/core");
const FolderPathBox_1 = require("./FolderPathBox");
const DEFAULT_STRING_ENCODING = "utf-8";
class LocalFileSystem {
    constructor(_needs) {
        this._needs = _needs;
    }
    readStringSync(filePathBox, options) {
        try {
            const string = (0, fs_1.readFileSync)(filePathBox.getData(), options?.encoding || DEFAULT_STRING_ENCODING);
            return string;
        }
        catch (e) {
            // TODO: figure out what errors are thrown and make callbacks for them
            throw e;
        }
    }
    async readStringAsync(filePathBox, options) {
        const string = await (0, promises_1.readFile)(filePathBox.getData(), options?.encoding || DEFAULT_STRING_ENCODING);
        return string;
    }
    getFileSizeBytesSync(pathBox) {
        const bytes = (0, fs_1.statSync)(pathBox.getData()).size;
        return bytes;
    }
    getFileSizeBytesBoxSync(pathBox) {
        const bytes = (0, fs_1.statSync)(pathBox.getData()).size;
        return new core_1.BytesBox(bytes);
    }
    isEmptyFileSync(pathBox) {
        return this.getFileSizeBytesSync(pathBox) === 0;
    }
    writeStringSync(data, pathBox, options) {
        this.maybeExpectSanePath(pathBox);
        if (options?.append) {
            (0, fs_1.appendFileSync)(pathBox.getData(), data, options);
            return;
        }
        (0, fs_1.writeFileSync)(pathBox.getData(), data, options);
    }
    readJsonSync(filePathBox, options) {
        const string = this.readStringSync(filePathBox, options);
        try {
            return JSON.parse(string);
        }
        catch (e) {
            throw new Error(`JSON parse error in file ${filePathBox.getData()}: ` + e.message);
        }
    }
    writeJsonSync(data, pathBox, options) {
        const string = JSON.stringify(data, null, 4);
        this.writeStringSync(string, pathBox, options);
    }
    deleteFolderSync(folderPathBox, { areYouSure }) {
        this.maybeExpectSanePath(folderPathBox);
        (0, core_1.Expect)(areYouSure === "YES", `areYouSure!=="YES"`);
        this.expectFolderExistsSync(folderPathBox);
        (0, fs_1.rmdirSync)(folderPathBox.getData(), { recursive: true });
    }
    deleteFileSync(filePathBox, { areYouSure }) {
        this.maybeExpectSanePath(filePathBox);
        (0, core_1.Expect)(areYouSure === "YES", `areYouSure!=="YES"`);
        this.expectFileExistsSync(filePathBox);
        (0, fs_1.unlinkSync)(filePathBox.getData());
    }
    deleteSync(pathBox, { areYouSure }) {
        this.maybeExpectSanePath(pathBox);
        (0, core_1.Expect)(areYouSure === "YES", `areYouSure!=="YES"`);
        this.expectPathExists(pathBox);
        (0, fs_1.rmSync)(pathBox.getData(), {
            recursive: true,
            // force: true,
        });
    }
    moveSync(fromPathBox, toPathBox, options) {
        this.maybeExpectSanePath(toPathBox);
        if (fromPathBox.getData() === toPathBox.getData()) {
            return;
        }
        if (!options?.overwrite && this.pathExistsSync(toPathBox)) {
            throw new Error(`Destination exists: ` + toPathBox.getData());
        }
        (0, fs_1.renameSync)(fromPathBox.getData(), toPathBox.getData());
    }
    renameFileSync(fromPathBox, toFileNameBox, options) {
        const toPathBox = fromPathBox.rename(toFileNameBox);
        this.moveSync(fromPathBox, toPathBox, options);
    }
    renameFolderSync(fromPathBox, toFileNameBox, options) {
        const toPathBox = fromPathBox.rename(toFileNameBox);
        this.moveSync(fromPathBox, toPathBox, options);
    }
    moveIntoFolderSync(fromPath, intoPath, options) {
        const toPathBox = fromPath.moveIntoFolderBox(intoPath);
        this.moveSync(fromPath, toPathBox, options);
    }
    copyIntoFolderSync(fromPathBox, intoPathBox, options) {
        const toPath = fromPathBox.moveIntoFolderBox(intoPathBox);
        this.copySync(fromPathBox, toPath, options);
    }
    expectFileExistsSync(filePathBox, options) {
        (0, core_1.Expect)(this.isExistingFilePathSync(filePathBox), `File does not exist: ` + filePathBox.getData(), options?.onDoesNotExist);
    }
    expectFolderExistsSync(folderPathBox, options) {
        (0, core_1.Expect)(this.isExistingFolderPathSync(folderPathBox), `Folder does not exist: ` + folderPathBox.getData(), options?.onDoesNotExist);
    }
    expectIsEmptyFolderSync(folderPathBox) {
        const isEmpty = this.isEmptyFolderSync(folderPathBox);
        (0, core_1.Expect)(isEmpty, "Folder was not empty: " + folderPathBox.getData());
    }
    isEmptyFolderSync(folderPathBox) {
        const contents = this.getChildrenBoxesSync({ folderPathBox });
        return contents.length === 0;
    }
    expectPathExists(pathBox) {
        (0, core_1.Expect)(this.pathExistsSync(pathBox), `Path does not exist: ` + pathBox.getData());
    }
    backupSync(filePath) {
        const backupPathBox = this.makeBackupPathFromFilePathSync(filePath);
        this.copySync(filePath, backupPathBox);
    }
    copySync(fromPathBox, destinationBox, options) {
        const overwrite = options?.overwrite;
        if (!overwrite && this.pathExistsSync(destinationBox)) {
            throw new Error("Destination already exists: " + destinationBox.getData());
        }
        this.maybeExpectSanePath(destinationBox);
        (0, fs_1.copyFileSync)(fromPathBox.getData(), destinationBox.getData());
    }
    /** Returns a pathBox that makes it clear it's a backup, and is guaranteed not to exist. Will probably have a number after it. */
    makeBackupPathFromFilePathSync(fromPath) {
        let backupPath;
        let number = 1;
        do {
            let numberString = ("00" + number).slice(-3);
            if (number > 999) {
                numberString = "" + number;
            }
            backupPath = fromPath.append(`.${numberString}.backup`);
            number += 1;
        } while (this.pathExistsSync(backupPath));
        return backupPath;
    }
    /** Returns whether or not a file exists at this path. */
    isExistingFilePathSync(pathBox) {
        if (!this.pathExistsSync(pathBox)) {
            return false;
        }
        return this.isFileSync(pathBox);
    }
    /** Returns whether or not a folder exists at this path. */
    isExistingFolderPathSync(pathBox) {
        if (!this.pathExistsSync(pathBox)) {
            return false;
        }
        return this.isFolderSync(pathBox);
    }
    isFileSync(path) {
        return !this.isFolderSync(path);
    }
    isFolderSync(path) {
        if (path instanceof FolderPathBox_1.FolderPathBox || path instanceof FilePathBox_1.FilePathBox) {
            path = path.getData();
        }
        if (path.includes("../")) {
            path = (0, path_1.resolve)(path);
        }
        const stats = (0, fs_1.lstatSync)(path);
        return stats.isDirectory();
    }
    /** Returns true if a folder or file exists at this path. */
    pathExistsSync(pathBox) {
        // unresolved pathBox with "../" will always return false
        // see others having this issue:
        // - https://stackoverflow.com/questions/55438404/fs-existssync-always-returning-false-when-path-has
        // - https://stackoverflow.com/questions/71604456/why-does-fs-existssync-always-return-false
        if (pathBox.getData().includes("../")) {
            pathBox = this.makeResolvedPathBox(pathBox);
        }
        return (0, fs_1.existsSync)(pathBox.getData());
    }
    makeResolvedPathBox(fromPathBox) {
        const resolvedPath = (0, path_1.resolve)(fromPathBox.getData());
        if (fromPathBox instanceof FilePathBox_1.FilePathBox) {
            return new FilePathBox_1.FilePathBox(resolvedPath);
        }
        else {
            return new FolderPathBox_1.FolderPathBox(resolvedPath + "/");
        }
    }
    deleteChildrenSync({ folderPathBox, areYouSure, }) {
        (0, core_1.Expect)(areYouSure === "YES", `areYouSure!=="YES`);
        this.maybeExpectSanePath(folderPathBox);
        const children = this.getChildrenBoxesSync({ folderPathBox });
        for (const child of children) {
            if (child instanceof FolderPathBox_1.FolderPathBox) {
                this.deleteFolderSync(child, { areYouSure });
            }
            else {
                this.deleteFileSync(child, { areYouSure });
            }
        }
    }
    deleteEmptyFolderSync(folderPathBox) {
        this.expectIsEmptyFolderSync(folderPathBox);
        this.deleteFolderSync(folderPathBox, { areYouSure: "YES" });
    }
    /**
     * Returns the (boxed) FolderPaths and FilePaths that are immediate children of this FolderPath.
     */
    getChildrenBoxesSync({ folderPathBox, }) {
        const results = [];
        this.expectFolderExistsSync(folderPathBox);
        const childNames = (0, fs_1.readdirSync)(folderPathBox.getData());
        for (const childName of childNames) {
            const childPath = folderPathBox.getData() + childName;
            let childBox;
            if (this.isFolderSync(childPath)) {
                childBox = new FolderPathBox_1.FolderPathBox(childPath + "/");
            }
            else {
                childBox = new FilePathBox_1.FilePathBox(childPath);
            }
            results.push(childBox);
        }
        return results;
    }
    getChildrenFolderPathsSync({ folderPathBox, }) {
        return this.getChildrenBoxesSync({ folderPathBox }).filter(a => a instanceof FolderPathBox_1.FolderPathBox);
    }
    getChildrenFilePathsSync({ folderPathBox, }) {
        return this.getChildrenBoxesSync({ folderPathBox }).filter(a => a instanceof FilePathBox_1.FilePathBox);
    }
    /**
     * Returns the (boxed) FolderPaths and FilePaths that are descendants of this FolderPath.
     * */
    getDescendantBoxesSync(folderPathBox) {
        const results = [];
        const fileSystem = this;
        function recurse(folderPathBox) {
            const children = fileSystem.getChildrenBoxesSync({ folderPathBox });
            for (const child of children) {
                results.push(child);
                if (child instanceof FolderPathBox_1.FolderPathBox) {
                    recurse(child);
                }
            }
        }
        recurse(folderPathBox);
        return results;
    }
    /**
     * Returns the (boxed) FilePaths that are descendants of this FolderPath.
     * */
    getDescendantFilePathBoxesSync(folderPathBox) {
        const results = [];
        const fileSystem = this;
        function recurse(folderPathBox) {
            const children = fileSystem.getChildrenBoxesSync({ folderPathBox });
            for (const child of children) {
                if (child instanceof FilePathBox_1.FilePathBox) {
                    results.push(child);
                }
                if (child instanceof FolderPathBox_1.FolderPathBox) {
                    recurse(child);
                }
            }
        }
        recurse(folderPathBox);
        return results;
    }
    /**
     * Returns the (boxed) FolderPaths that are descendants of this FolderPath.
     * */
    getDescendantFolderPathsBoxesSync(folderPathBox) {
        const results = [];
        const fileSystem = this;
        function recurse(folderPathBox) {
            const children = fileSystem.getChildrenBoxesSync({ folderPathBox });
            for (const child of children) {
                if (child instanceof FolderPathBox_1.FolderPathBox) {
                    results.push(child);
                    recurse(child);
                }
            }
        }
        recurse(folderPathBox);
        return results;
    }
    /**
     * Will make the folder (and any parent folders) exist if they don't already.
     */
    ensureFolderExistsSync(folderPathBox) {
        if (this.isExistingFolderPathSync(folderPathBox)) {
            return;
        }
        this.maybeExpectSanePath(folderPathBox);
        let wipPathValue = folderPathBox.getData().startsWith("/") ? "/" : "";
        for (const nodeName of folderPathBox.getData().split("/").filter(_ => _)) {
            wipPathValue += nodeName + "/";
            const wipPath = new FolderPathBox_1.FolderPathBox(wipPathValue);
            if (this.isExistingFilePathSync(wipPath)) {
                throw new Error("Cannot create folder, because a file already exists in the way of the folder path. Problem file's path: " + wipPathValue);
            }
            if (!this.isExistingFolderPathSync(wipPath)) {
                (0, fs_1.mkdirSync)(wipPathValue);
            }
        }
    }
    /** If you provided a expectSaneFilePath callback when you initialized the localfilesystem, the path will be checked here to make sure it's sane. */
    maybeExpectSanePath(pathBox) {
        if (!this._needs.expectSaneFilePath) {
            return;
        }
        this._needs.expectSaneFilePath(pathBox.getData());
    }
}
exports.LocalFileSystem = LocalFileSystem;
