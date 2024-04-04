"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileFormatBox = void 0;
const core_1 = require("@layer92/core");
const FileExtensionBox_1 = require("./FileExtensionBox");
/** values such as: "mp3", "jpg", "tar.gz" etc... */
class FileFormatBox extends core_1.Box {
    toExtension() {
        return "." + this._data;
    }
    toExtensionBox() {
        return new FileExtensionBox_1.FileExtensionBox(this.toExtension());
    }
    static FromExtensionBox(extension) {
        return new FileFormatBox(extension.getData().slice(1));
    }
}
exports.FileFormatBox = FileFormatBox;
