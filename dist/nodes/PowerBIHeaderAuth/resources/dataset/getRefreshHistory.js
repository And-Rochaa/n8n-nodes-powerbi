"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshHistory = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getRefreshHistory(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const datasetId = this.getNodeParameter('datasetId', i);
    const top = this.getNodeParameter('top', i, undefined);
    const groupId = this.getNodeParameter('groupId', i, '');
    const queryParams = {};
    if (top !== undefined) {
        queryParams.$top = top;
    }
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, queryParams, headers);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.getRefreshHistory = getRefreshHistory;
//# sourceMappingURL=getRefreshHistory.js.map