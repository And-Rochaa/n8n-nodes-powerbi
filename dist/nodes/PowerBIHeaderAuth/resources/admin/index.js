"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOperations = void 0;
const getInfo_1 = require("./getInfo");
const getScanResult_1 = require("./getScanResult");
const generateAuthUrl_1 = require("./generateAuthUrl");
const getToken_1 = require("./getToken");
const refreshToken_1 = require("./refreshToken");
exports.adminOperations = {
    getInfo: getInfo_1.getInfo,
    getScanResult: getScanResult_1.getScanResult,
    generateAuthUrl: generateAuthUrl_1.generateAuthUrl,
    getToken: getToken_1.getToken,
    refreshToken: refreshToken_1.refreshToken,
};
//# sourceMappingURL=index.js.map