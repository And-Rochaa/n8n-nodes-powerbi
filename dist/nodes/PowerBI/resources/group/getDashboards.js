"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboards = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDashboards(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i);
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', `/groups/${groupId}/dashboards`);
    const dashboardItems = (responseData.value || []);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(dashboardItems), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
exports.getDashboards = getDashboards;
//# sourceMappingURL=getDashboards.js.map