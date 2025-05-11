"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQueries = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function executeQueries(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const datasetId = this.getNodeParameter('datasetId', i);
    const daxQuery = this.getNodeParameter('daxQuery', i);
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/executeQueries` : `/datasets/${datasetId}/executeQueries`;
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'POST', endpoint, {
        queries: [
            {
                query: daxQuery,
            },
        ],
    });
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.executeQueries = executeQueries;
//# sourceMappingURL=executeQueries.js.map