"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function get(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i);
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', `/groups/${groupId}`);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
exports.get = get;
//# sourceMappingURL=get.js.map