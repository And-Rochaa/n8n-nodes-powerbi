"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function get(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const datasetId = this.getNodeParameter('datasetId', i);
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}` : `/datasets/${datasetId}`;
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.get = get;
//# sourceMappingURL=get.js.map