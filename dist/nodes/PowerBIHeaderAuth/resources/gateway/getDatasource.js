"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasource = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasource(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    let authToken = this.getNodeParameter('authToken', index);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const qs = {};
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', `/gateways/${gatewayId}/datasources/${datasourceId}`, {}, qs, headers);
    return this.helpers.returnJsonArray(responseData);
}
exports.getDatasource = getDatasource;
//# sourceMappingURL=getDatasource.js.map