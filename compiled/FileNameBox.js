"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNameBox = void 0;
const core_1 = require("@layer92/core");
const FileExtensionBox_1 = require("./FileExtensionBox");
const FileFormatBox_1 = require("./FileFormatBox");
const core_2 = require("@layer92/core");
/** includes the extension */
class FileNameBox extends core_1.Box {
    constructor(data, onBadData) {
        (0, core_2.Expect)(data !== undefined, `data:undefined`, onBadData);
        (0, core_2.Expect)(!data.includes("/"), `Data: cannot include "/"`, onBadData);
        super(data);
    }
    getExtension() {
        return this.getExtensionBox()?.getData();
    }
    getExtensionBox() {
        const formatBox = this.getFormatBox();
        if (!formatBox) {
            return undefined;
        }
        return FileExtensionBox_1.FileExtensionBox.MakeFromFormatBox(formatBox);
    }
    getFormat() {
        const format = this._data.split(".").slice(-1)[0];
        if (format === undefined) {
            return undefined;
        }
        return format;
    }
    getFormatBox() {
        const format = this.getFormat();
        if (format === undefined) {
            return undefined;
        }
        return new FileFormatBox_1.FileFormatBox(format);
    }
    /** Returns the file name without the extension. NOTE that the extension is the very last .foo in the name. For example, the extension of "bar.tar.gz" is ".gz", so the basename would be "bar.tar" */
    getBaseName() {
        const extensionString = this.getExtensionBox()?.getData() || "";
        const data = this._data.slice(0, -extensionString.length);
        return data;
    }
}
exports.FileNameBox = FileNameBox;
