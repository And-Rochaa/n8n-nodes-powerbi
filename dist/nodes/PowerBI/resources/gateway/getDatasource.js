"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasource = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasource(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    const qs = {};
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', `/gateways/${gatewayId}/datasources/${datasourceId}`, {}, qs);
    return this.helpers.returnJsonArray(responseData);
}
exports.getDatasource = getDatasource;
//# sourceMappingURL=getDatasource.js.map