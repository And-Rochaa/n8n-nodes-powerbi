"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGateway = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getGateway(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const qs = {};
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', `/gateways/${gatewayId}`, {}, qs);
    return this.helpers.returnJsonArray(responseData);
}
exports.getGateway = getGateway;
//# sourceMappingURL=get.js.map