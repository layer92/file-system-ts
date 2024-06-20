import { KnownAudioFileFormats } from "./KnownAudioFileFormats";
import { KnownImageFileFormats } from "./KnownImageFileFormats";
import { KnownVideoFileFormats } from "./KnownVideoFileFormats";

/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
export const KnownUtf8IncompatibleFileFormats = [
    ...KnownImageFileFormats,
    ...KnownVideoFileFormats,
    ...KnownAudioFileFormats,
    "xcf",
    "psd",
    "pdf",
];