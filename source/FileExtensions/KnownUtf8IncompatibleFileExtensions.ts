import { KnownUtf8IncompatibleFileFormats } from "../FileFormats/KnownUtf8IncompatibleFileFormats";

/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
export const KnownUtf8IncompatibleFileExtensions = KnownUtf8IncompatibleFileFormats.map(a=>"."+a);