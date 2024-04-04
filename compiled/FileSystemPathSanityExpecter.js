"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemPathSanityExpecter__ExpectSaneFileSystemPathBasic = void 0;
const core_1 = require("@layer92/core");
const FileSystemPathSanityExpecter__ExpectSaneFileSystemPathBasic = (path) => {
    (0, core_1.Expect)(!path.includes("[object Object]"), `pathData: includes "[object Object]" pathData: ${path}`);
    (0, core_1.Expect)(!path.includes("*"), `pathData: includes "*" pathData: ${path}`);
    (0, core_1.Expect)(!path.includes("../"), `pathData: includes ".." pathData: ${path}`);
    (0, core_1.Expect)(path !== "/", `pathData: is "/"`);
};
exports.FileSystemPathSanityExpecter__ExpectSaneFileSystemPathBasic = FileSystemPathSanityExpecter__ExpectSaneFileSystemPathBasic;
