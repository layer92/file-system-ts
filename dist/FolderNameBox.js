"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderNameBox = void 0;
const core_1 = require("@layer92/core");
const core_2 = require("@layer92/core");
class FolderNameBox extends core_1.Box {
    constructor(data) {
        (0, core_2.Expect)(data.length, "data: cannot be empty.");
        (0, core_2.Expect)(!data.includes("/"), "data: cannot have a slash in it.");
        super(data);
    }
}
exports.FolderNameBox = FolderNameBox;
