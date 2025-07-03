"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function getTransactions(index) {
    const groupId = this.getNodeParameter('groupId', index);
    const dataflowId = this.getNodeParameter('dataflowId', index);
    if (!groupId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Group ID is required!');
    }
    if (!dataflowId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow ID is required!');
    }
    let authToken = this.getNodeParameter('authToken', index);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    try {
        const endpoint = `/groups/${groupId}/dataflows/${dataflowId}/transactions`;
        const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
        if (responseData.value && Array.isArray(responseData.value)) {
            return responseData.value.map((transaction) => ({
                json: transaction,
            }));
        }
        return [{ json: responseData }];
    }
    catch (error) {
        if (error.statusCode === 403) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to access this dataflow.');
        }
        if (error.statusCode === 404) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow not found. Please verify that the group and dataflow IDs are correct.');
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error getting dataflow transactions: ${error.message}`);
    }
}
exports.getTransactions = getTransactions;
//# sourceMappingURL=getTransactions.js.map