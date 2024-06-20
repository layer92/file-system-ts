"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpectFolderName = void 0;
const core_1 = require("@layer92/core");
function ExpectFolderName(data) {
    (0, core_1.Expect)(data.length, "data: cannot be empty.");
    (0, core_1.Expect)(!data.includes("/"), "data: cannot have a slash in it.");
}
exports.ExpectFolderName = ExpectFolderName;
