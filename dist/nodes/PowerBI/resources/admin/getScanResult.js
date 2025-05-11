"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScanResult = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getScanResult(i) {
    const returnData = [];
    const scanId = this.getNodeParameter('scanId', i);
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', `/admin/workspaces/scanResult/${scanId}`);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.getScanResult = getScanResult;
//# sourceMappingURL=getScanResult.js.map