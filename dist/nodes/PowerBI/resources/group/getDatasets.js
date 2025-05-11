"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasets = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasets(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i);
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', `/groups/${groupId}/datasets`);
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