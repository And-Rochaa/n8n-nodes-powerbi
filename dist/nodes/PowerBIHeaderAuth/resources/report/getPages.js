"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPages = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getPages(i) {
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
        `/groups/${groupId}/reports/${reportId}/pages` : `/reports/${reportId}/pages`;
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
    const pageItems = (responseData.value || []);
    for (const item of pageItems) {
        returnData.push({
            json: item,
        });
    }
    return returnData;
}
exports.getPages = getPages;
//# sourceMappingURL=getPages.js.map