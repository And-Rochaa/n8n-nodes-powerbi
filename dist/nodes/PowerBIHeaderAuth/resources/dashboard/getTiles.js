"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTiles = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getTiles(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const dashboardId = this.getNodeParameter('dashboardId', i);
    const groupId = this.getNodeParameter('groupId', i, '');
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/dashboards/${dashboardId}/tiles` : `/dashboards/${dashboardId}/tiles`;
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
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