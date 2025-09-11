"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getReports(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i);
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', `/groups/${groupId}/reports`);
    const reportItems = (responseData.value || []);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(reportItems), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
exports.getReports = getReports;
//# sourceMappingURL=getReports.js.map