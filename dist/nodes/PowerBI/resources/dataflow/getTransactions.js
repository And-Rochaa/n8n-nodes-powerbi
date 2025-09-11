"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function getTransactions(index) {
    const groupId = this.getNodeParameter('groupId', index);
    const dataflowId = this.getNodeParameter('dataflowId', index);
    if (!groupId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Workspace ID is required!');
    }
    if (!dataflowId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow ID is required!');
    }
    try {
        const endpoint = `/groups/${groupId}/dataflows/${dataflowId}/transactions`;
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        if (responseData.value && Array.isArray(responseData.value)) {
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData.value), { itemData: { item: index } });
            return executionData;
        }
        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: index } });
        return executionData;
    }
    catch (error) {
        if (error.statusCode === 403) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to access this dataflow.');
        }
        if (error.statusCode === 404) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow not found. Please verify that the workspace and dataflow IDs are correct.');
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error getting dataflow transactions: ${error.message}`);
    }
}
exports.getTransactions = getTransactions;
//# sourceMappingURL=getTransactions.js.map