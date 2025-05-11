"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPages = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getPages(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const reportId = this.getNodeParameter('reportId', i);
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/reports/${reportId}/pages` : `/reports/${reportId}/pages`;
    const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
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