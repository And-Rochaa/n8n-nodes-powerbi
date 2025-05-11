"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTables = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getTables(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const datasetId = this.getNodeParameter('datasetId', i);
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/tables` : `/datasets/${datasetId}/tables`;
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
    const tableItems = (responseData.value || []);
    for (const item of tableItems) {
        returnData.push({
            json: item,
        });
    }
    return returnData;
}
exports.getTables = getTables;
//# sourceMappingURL=getTables.js.map