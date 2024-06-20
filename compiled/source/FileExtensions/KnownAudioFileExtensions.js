"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownAudioFileExtensions = void 0;
const KnownAudioFileFormats_1 = require("../FileFormats/KnownAudioFileFormats");
/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
exports.KnownAudioFileExtensions = KnownAudioFileFormats_1.KnownAudioFileFormats.map(a => "." + a);
