"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownImageFileExtensions = void 0;
const KnownImageFileFormats_1 = require("../FileFormats/KnownImageFileFormats");
/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
exports.KnownImageFileExtensions = KnownImageFileFormats_1.KnownImageFileFormats.map(a => "." + a);
