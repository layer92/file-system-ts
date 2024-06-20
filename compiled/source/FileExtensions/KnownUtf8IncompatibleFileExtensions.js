"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownUtf8IncompatibleFileExtensions = void 0;
const KnownUtf8IncompatibleFileFormats_1 = require("../FileFormats/KnownUtf8IncompatibleFileFormats");
/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
exports.KnownUtf8IncompatibleFileExtensions = KnownUtf8IncompatibleFileFormats_1.KnownUtf8IncompatibleFileFormats.map(a => "." + a);
