import { KnownVideoFileFormats } from "../FileFormats/KnownVideoFileFormats";

/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
export const KnownVideoFileExtensions = KnownVideoFileFormats.map(a=>"."+a);