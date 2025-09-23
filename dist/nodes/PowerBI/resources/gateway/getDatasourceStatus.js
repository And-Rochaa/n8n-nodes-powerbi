"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasourceStatus = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasourceStatus(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    if (!gatewayId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Gateway ID is required');
    }
    if (!datasourceId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Datasource ID is required');
    }
    const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/status`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        const executionData = this.helpers.constructExecutionMetaData([{ json: responseData }], { itemData: { item: index } });
        return executionData;
    }
    catch (error) {
        if (error.httpCode === '403') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error 403: You don't have permission to check the status of this data source (Gateway: ${gatewayId}, Datasource: ${datasourceId}). Please verify that you have administrator access to the gateway and data source.`);
        }
        if (error.httpCode === '404') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error 404: Gateway (${gatewayId}) or data source (${datasourceId}) not found. Please verify that the IDs are correct and that you have access to them.`);
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error checking data source status: ${error.message || error}`);
    }
}
exports.getDatasourceStatus = getDatasourceStatus;
//# sourceMappingURL=getDatasourceStatus.js.map