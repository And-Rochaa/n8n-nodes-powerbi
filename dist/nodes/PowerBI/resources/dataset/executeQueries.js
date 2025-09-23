"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQueries = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function executeQueries(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const datasetId = this.getNodeParameter('datasetId', i);
    const daxQuery = this.getNodeParameter('daxQuery', i);
    const includeNulls = this.getNodeParameter('includeNulls', i, false);
    const impersonatedUserName = this.getNodeParameter('impersonatedUserName', i, '');
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/executeQueries` : `/datasets/${datasetId}/executeQueries`;
    const requestBody = {
        queries: [
            {
                query: daxQuery,
            },
        ],
    };
    if (includeNulls !== false) {
        requestBody.serializerSettings = {
            includeNulls: includeNulls,
        };
    }
    if (impersonatedUserName && impersonatedUserName.trim() !== '') {
        requestBody.impersonatedUserName = impersonatedUserName.trim();
    }
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'POST', endpoint, requestBody);
        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
        returnData.push(...executionData);
        return returnData;
    }
    catch (error) {
        if (error.message && error.message.includes('DAX')) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `DAX query execution failed: ${error.message}`);
        }
        throw error;
    }
}
exports.executeQueries = executeQueries;
//# sourceMappingURL=executeQueries.js.map