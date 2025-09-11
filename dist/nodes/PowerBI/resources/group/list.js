"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function list(i) {
    const returnData = [];
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', '/groups');
    const groupItems = (responseData.value || []);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(groupItems), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
exports.list = list;
//# sourceMappingURL=list.js.map