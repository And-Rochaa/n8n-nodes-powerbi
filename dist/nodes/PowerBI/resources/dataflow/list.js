"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDataflows = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function listDataflows(index) {
    const groupId = this.getNodeParameter('groupId', index);
    if (!groupId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Workspace ID is required');
    }
    const endpoint = `/groups/${groupId}/dataflows`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        const returnData = [];
        if (responseData.value && Array.isArray(responseData.value)) {
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData.value), { itemData: { item: index } });
            returnData.push(...executionData);
        }
        else {
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: index } });
            returnData.push(...executionData);
        }
        return returnData;
    }
    catch (error) {
        const errorMessage = error.message || error.toString();
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error getting dataflows (Workspace: ${groupId}): ${errorMessage}. Please verify that you have adequate permissions in the workspace.`);
    }
}
exports.listDataflows = listDataflows;
//# sourceMappingURL=list.js.map