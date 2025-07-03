"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGateway = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getGateway(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    let authToken = this.getNodeParameter('authToken', index);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const qs = {};
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', `/gateways/${gatewayId}`, {}, qs, headers);
    return this.helpers.returnJsonArray(responseData);
}
exports.getGateway = getGateway;
//# sourceMappingURL=get.js.map