"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGateway = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getGateway(index) {
    const returnData = [];
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const endpoint = `/gateways/${gatewayId}`;
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: index } });
    returnData.push(...executionData);
    return returnData;
}
exports.getGateway = getGateway;
//# sourceMappingURL=get.js.map