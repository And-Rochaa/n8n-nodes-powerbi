"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTiles = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getTiles(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const dashboardId = this.getNodeParameter('dashboardId', i);
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/dashboards/${dashboardId}/tiles` : `/dashboards/${dashboardId}/tiles`;
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
    const tileItems = (responseData.value || []);
    for (const item of tileItems) {
        returnData.push({
            json: item,
        });
    }
    return returnData;
}
exports.getTiles = getTiles;
//# sourceMappingURL=getTiles.js.map