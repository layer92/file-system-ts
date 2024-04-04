"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePathBox = void 0;
const core_1 = require("@layer92/core");
const core_2 = require("@layer92/core");
const FileFormatBox_1 = require("./FileFormatBox");
const FileNameBox_1 = require("./FileNameBox");
const FolderPathBox_1 = require("./FolderPathBox");
class FilePathBox extends core_1.Box {
    constructor(value, onBadData) {
        (0, core_2.Expect)(!value.endsWith("/"), `value: ends with "/"`, onBadData);
        super(value);
    }
    getExtension() {
        return this.getFormatBox()?.toExtension();
    }
    getExtensionBox() {
        return this.getFormatBox()?.toExtensionBox();
    }
    getFormat() {
        const [lastNode] = this._data.split("/").slice(-1);
        const format = lastNode.split(".").slice(-1)[0];
        if (!format) {
            return undefined;
        }
        return format;
    }
    getFormatBox() {
        const format = this.getFormat();
        if (!format) {
            return undefined;
        }
        return new FileFormatBox_1.FileFormatBox(format);
    }
    getFileName() {
        const lastNode = this._data.split("/").slice(-1)[0];
        return lastNode;
    }
    getFileNameBox() {
        return new FileNameBox_1.FileNameBox(this.getFileName());
    }
    getParentPath() {
        const fileName = this.getFileNameBox();
        const parentPath = this._data.slice(0, -fileName.getData().length);
        return parentPath;
    }
    getParentPathBox() {
        return new FolderPathBox_1.FolderPathBox(this.getParentPath());
    }
    /** Returns a filepath with the filename renamed  */
    rename(toName) {
        const toFolder = this.getParentPathBox();
        return new FilePathBox(toFolder.getData() + toName.getData());
    }
    /** Returns a filepath of the file moved into the folder */
    moveIntoFolderBox(toFolderPath) {
        const fileName = this.getFileNameBox();
        return new FilePathBox(toFolderPath.getData() + fileName.getData());
    }
    append(string) {
        return new FilePathBox(this.getData() + string);
    }
}
exports.FilePathBox = FilePathBox;
