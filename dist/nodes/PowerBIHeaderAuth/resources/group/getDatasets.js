"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasets = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasets(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const groupId = this.getNodeParameter('groupId', i);
    const endpoint = `/groups/${groupId}/datasets`;
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
    const datasetItems = (responseData.value || []);
    for (const item of datasetItems) {
        returnData.push({
            json: item,
        });
    }
    return returnData;
}
exports.getDatasets = getDatasets;
//# sourceMappingURL=getDatasets.js.map