"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownUtf8CompatibleFileExtensions = void 0;
const KnownUtf8CompatibleFileFormats_1 = require("../FileFormats/KnownUtf8CompatibleFileFormats");
/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
exports.KnownUtf8CompatibleFileExtensions = KnownUtf8CompatibleFileFormats_1.KnownUtf8CompatibleFileFormats.map(a => "." + a);
