"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToPdf = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function exportToPdf(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const reportId = this.getNodeParameter('reportId', i);
    const exportFormat = this.getNodeParameter('exportFormat', i);
    const groupId = this.getNodeParameter('groupId', i, '');
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/reports/${reportId}/ExportTo` : `/reports/${reportId}/ExportTo`;
    const body = {
        format: exportFormat,
    };
    const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'POST', endpoint, body, {}, headers);
    returnData.push({
        json: responseData,
    });
    return returnData;
}
exports.exportToPdf = exportToPdf;
//# sourceMappingURL=exportToPdf.js.map