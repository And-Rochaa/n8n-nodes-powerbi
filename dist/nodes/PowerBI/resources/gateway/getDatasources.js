"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasources = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasources(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const qs = {};
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', `/gateways/${gatewayId}/datasources`, {}, qs);
    return this.helpers.returnJsonArray(responseData.value);
}
exports.getDatasources = getDatasources;
//# sourceMappingURL=getDatasources.js.map