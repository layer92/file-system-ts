import { KnownUtf8CompatibleFileFormats } from "../FileFormats/KnownUtf8CompatibleFileFormats";

/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
export const KnownUtf8CompatibleFileExtensions = KnownUtf8CompatibleFileFormats.map(a=>"."+a);