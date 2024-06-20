"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownVideoFileExtensions = void 0;
const KnownVideoFileFormats_1 = require("../FileFormats/KnownVideoFileFormats");
/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
exports.KnownVideoFileExtensions = KnownVideoFileFormats_1.KnownVideoFileFormats.map(a => "." + a);
