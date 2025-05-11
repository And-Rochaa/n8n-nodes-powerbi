"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function get(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const reportId = this.getNodeParameter('reportId', i);
    const groupId = this.getNodeParameter('groupId', i, '');
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/reports/${reportId}` : `/reports/${reportId}`;
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.get = get;
//# sourceMappingURL=get.js.map