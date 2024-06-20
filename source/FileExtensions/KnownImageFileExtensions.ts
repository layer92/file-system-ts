import { KnownImageFileFormats } from "../FileFormats/KnownImageFileFormats";

/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
export const KnownImageFileExtensions = KnownImageFileFormats.map(a=>"."+a);