import { KnownAudioFileFormats } from "../FileFormats/KnownAudioFileFormats";

/** WARNING: This list may be expanded in future versions, and such is not considered a breaking change. Please consider that when using this list. */
export const KnownAudioFileExtensions = KnownAudioFileFormats.map(a=>"."+a);