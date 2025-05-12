"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const generateAuthUrl_1 = require("./generateAuthUrl");
const getToken_1 = require("./getToken");
const refreshToken_1 = require("./refreshToken");
exports.token = {
    generateAuthUrl: generateAuthUrl_1.generateAuthUrl,
    getToken: getToken_1.getToken,
    refreshToken: refreshToken_1.refreshToken,
};
//# sourceMappingURL=index.js.map