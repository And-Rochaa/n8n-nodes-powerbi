"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasourceUsers = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasourceUsers(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    if (!gatewayId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Gateway ID is required');
    }
    if (!datasourceId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Datasource ID is required');
    }
    const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/users`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        if (responseData.value && Array.isArray(responseData.value)) {
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData.value), { itemData: { item: index } });
            return executionData;
        }
        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: index } });
        return executionData;
    }
    catch (error) {
        const errorMessage = error.message || error.toString();
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error getting data source users (Gateway: ${gatewayId}, Datasource: ${datasourceId}): ${errorMessage}. Please verify that you have administrator permissions on the gateway and that the IDs are correct.`);
    }
}
exports.getDatasourceUsers = getDatasourceUsers;
//# sourceMappingURL=getDatasourceUsers.js.map