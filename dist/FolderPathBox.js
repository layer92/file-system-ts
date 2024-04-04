"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderPathBox = void 0;
const core_1 = require("@layer92/core");
const FilePathBox_1 = require("./FilePathBox");
const FolderNameBox_1 = require("./FolderNameBox");
const core_2 = require("@layer92/core");
/**
 * According to wikipedia, if it's on-disk, it's called a "directory" and the graphic representation is a "folder", but we're going to call it a "folder" anyway.
 * https://en.wikipedia.org/wiki/Directory_(computing)
 */
class FolderPathBox extends core_2.Box {
    constructor(data) {
        (0, core_1.Expect)(data.length, `data: Cannot be empty: ` + data);
        (0, core_1.Expect)(data.endsWith("/"), `data: Must end with "/": ` + data);
        (0, core_1.Expect)(!data.includes("*"), `data: Cannot have "*": ` + data);
        super(data);
    }
    getFolderNameBox() {
        // note that the path ends in "/"
        const lastNode = this._data.split("/").slice(-2)[0];
        return new FolderNameBox_1.FolderNameBox(lastNode);
    }
    maybeGetParentPathBox() {
        const folderNameBox = this.getFolderNameBox();
        const folderNameWithSlash = folderNameBox.getData() + "/";
        const parentPath = this._data.slice(0, -folderNameWithSlash.length);
        if (!parentPath.length) {
            return undefined;
        }
        return new FolderPathBox(parentPath);
    }
    isParentOfPathBox(somePath) {
        if (somePath.getData() === this._data) {
            return false;
        }
        return somePath.getData().includes(this._data);
    }
    /** Returns a folderpath with the foldername renamed  */
    rename(toNameBox) {
        const toFolder = this.maybeGetParentPathBox()?.getData() || "";
        return new FolderPathBox(toFolder + toNameBox.getData());
    }
    /** Returns a filepath of the file moved into the folder */
    moveIntoFolderBox(toFolderPath) {
        const folderName = this.getFolderNameBox();
        return new FilePathBox_1.FilePathBox(toFolderPath.getData() + folderName.getData());
    }
    makeChildFolderBox(childFolderName) {
        return new FolderPathBox(this.getData() + childFolderName.getData() + "/");
    }
    makeChildFileBox(childFileName) {
        return new FilePathBox_1.FilePathBox(this.getData() + childFileName.getData());
    }
}
exports.FolderPathBox = FolderPathBox;
