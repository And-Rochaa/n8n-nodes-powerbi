"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function list(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const groupId = this.getNodeParameter('groupId', i, '');
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/reports` : `/reports`;
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
    const reportItems = (responseData.value || []);
    for (const item of reportItems) {
        returnData.push({
            json: item,
        });
    }
    return returnData;
}
exports.list = list;
//# sourceMappingURL=list.js.map