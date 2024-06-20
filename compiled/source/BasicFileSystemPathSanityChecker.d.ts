import { OnException } from "@layer92/core";
/**
 * Checks that the path doesn't have any common mistakes / accidents, and throws an error if such would happen.
 *
 * This is useful for making quick utilties where you want to have peace of mind from erasing important files, etc..., but should not be used for code where you're handling production client input, etc...
 *
 * ## Blocks:
 * - paths that contain "[object Object]"
 * - paths that include "*"
 * - paths that include "../"
 * - the path "/"
 */
export declare const BasicFileSystemPathSanityChecker: (path: string, onBadPath?: OnException) => void;
