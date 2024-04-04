"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileExtensionBox = void 0;
const core_1 = require("@layer92/core");
const core_2 = require("@layer92/core");
const FileFormatBox_1 = require("./FileFormatBox");
/** values such as: ".mp3", ".jpg", ".tar.gz" etc... */
class FileExtensionBox extends core_1.Box {
    constructor(data) {
        (0, core_2.Expect)(data.startsWith("."), `data: started with "."`);
        super(data);
    }
    static MakeFromFormatBox(format) {
        return new FileExtensionBox("." + format.getData());
    }
    static MakeFromFormat(format) {
        return new FileExtensionBox("." + format);
    }
    toFormatBox() {
        return new FileFormatBox_1.FileFormatBox(this._data.slice(1));
    }
    toFormat() {
        return this._data.slice(1);
    }
    // TODO: move this logic somewhere else, perhaps into a separate library, as it's way to prone to changing
    isProbablyAudioFile() {
        return [
            ".wav",
            ".mp3",
            ".flac",
            ".ogg",
            ".aiff",
            ".aif",
            ".alac",
            ".mpc",
        ].includes(this._data);
    }
    isProbablyImageFile() {
        return [
            ".jpg",
            ".jpeg",
            ".bmp",
            ".png",
            ".gif",
        ].includes(this._data);
    }
    isProbablyVideoFile() {
        return [
            ".mp4",
            ".ogv",
            ".mkv",
        ].includes(this._data);
    }
    canProbablyUseUtf8Encoding() {
        return [
            ".txt",
            ".htm",
            ".html",
            ".json",
            ".xml",
            ".csv",
            ".tsv",
            ".svg",
        ].includes(this._data);
    }
    getProbablyCannotUseUtf8Encoding() {
        return (
        // always return false if a whitelisted utf8able format (eg svg is an image, but it's also utf8 compatible)
        !this.canProbablyUseUtf8Encoding()
            && (this.isProbablyAudioFile()
                || this.isProbablyImageFile()
                || this.isProbablyVideoFile()
                || [
                    ".xcf",
                    ".psd",
                    ".pdf",
                ].includes(this._data)));
    }
}
exports.FileExtensionBox = FileExtensionBox;
