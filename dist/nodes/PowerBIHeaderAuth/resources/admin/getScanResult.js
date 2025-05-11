"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScanResult = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getScanResult(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const scanId = this.getNodeParameter('scanId', i);
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', `/admin/workspaces/scanResult/${scanId}`, {}, {}, headers);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.getScanResult = getScanResult;
//# sourceMappingURL=getScanResult.js.map