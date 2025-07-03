"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasources = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasources(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    let authToken = this.getNodeParameter('authToken', index);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const qs = {};
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', `/gateways/${gatewayId}/datasources`, {}, qs, headers);
    return this.helpers.returnJsonArray(responseData.value);
}
exports.getDatasources = getDatasources;
//# sourceMappingURL=getDatasources.js.map