"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasourceUsers = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasourceUsers(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    if (!gatewayId) {
        throw new Error('Gateway ID is required');
    }
    if (!datasourceId) {
        throw new Error('Datasource ID is required');
    }
    const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/users`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        if (responseData.value && Array.isArray(responseData.value)) {
            return responseData.value.map((user) => ({
                json: user,
                pairedItem: { item: index },
            }));
        }
        return [{
                json: responseData,
                pairedItem: { item: index },
            }];
    }
    catch (error) {
        const errorMessage = error.message || error.toString();
        throw new Error(`Error getting data source users (Gateway: ${gatewayId}, Datasource: ${datasourceId}): ${errorMessage}. Please verify that you have administrator permissions on the gateway and that the IDs are correct.`);
    }
}
exports.getDatasourceUsers = getDatasourceUsers;
//# sourceMappingURL=getDatasourceUsers.js.map