"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasourceStatus = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasourceStatus(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    if (!gatewayId) {
        throw new Error('Gateway ID is required');
    }
    if (!datasourceId) {
        throw new Error('Datasource ID is required');
    }
    let authToken = this.getNodeParameter('authToken', index);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/status`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
        const executionData = this.helpers.constructExecutionMetaData([{ json: responseData }], { itemData: { item: index } });
        return executionData;
    }
    catch (error) {
        if (error.httpCode === '403') {
            throw new Error(`Error 403: You don't have permission to check the status of this data source (Gateway: ${gatewayId}, Datasource: ${datasourceId}). Please verify that you have administrator access to the gateway and data source.`);
        }
        if (error.httpCode === '404') {
            throw new Error(`Error 404: Gateway (${gatewayId}) or data source (${datasourceId}) not found. Please verify that the IDs are correct and that you have access to them.`);
        }
        throw new Error(`Error checking data source status: ${error.message || error}`);
    }
}
exports.getDatasourceStatus = getDatasourceStatus;
//# sourceMappingURL=getDatasourceStatus.js.map