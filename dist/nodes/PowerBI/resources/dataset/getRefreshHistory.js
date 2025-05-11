"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshHistory = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getRefreshHistory(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const datasetId = this.getNodeParameter('datasetId', i);
    const top = this.getNodeParameter('top', i, undefined);
    const queryParams = {};
    if (top !== undefined) {
        queryParams.$top = top;
    }
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint, {}, queryParams);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.getRefreshHistory = getRefreshHistory;
//# sourceMappingURL=getRefreshHistory.js.map