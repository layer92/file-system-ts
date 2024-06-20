"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownUtf8IncompatibleFileFormats = void 0;
const KnownAudioFileFormats_1 = require("./KnownAudioFileFormats");
const KnownImageFileFormats_1 = require("./KnownImageFileFormats");
const KnownVideoFileFormats_1 = require("./KnownVideoFileFormats");
/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
exports.KnownUtf8IncompatibleFileFormats = [
    ...KnownImageFileFormats_1.KnownImageFileFormats,
    ...KnownVideoFileFormats_1.KnownVideoFileFormats,
    ...KnownAudioFileFormats_1.KnownAudioFileFormats,
    "xcf",
    "psd",
    "pdf",
];
