"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const generateAuthUrl_1 = require("./generateAuthUrl");
const getToken_1 = require("./getToken");
const refreshToken_1 = require("./refreshToken");
const getServicePrincipalToken_1 = require("./getServicePrincipalToken");
exports.token = {
    generateAuthUrl: generateAuthUrl_1.generateAuthUrl,
    getToken: getToken_1.getToken,
    refreshToken: refreshToken_1.refreshToken,
    getServicePrincipalToken: getServicePrincipalToken_1.getServicePrincipalToken,
};
//# sourceMappingURL=index.js.map