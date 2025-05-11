"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToPdf = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
const setTimeout = globalThis.setTimeout;
async function exportToPdf(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const reportId = this.getNodeParameter('reportId', i);
    const options = this.getNodeParameter('options', i, {});
    const body = {};
    if (options.pageName) {
        body.pageName = options.pageName;
    }
    if (options.bookmarksState) {
        body.bookmarksState = options.bookmarksState;
    }
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/reports/${reportId}/ExportTo` : `/reports/${reportId}/ExportTo`;
    const exportData = await GenericFunctions_1.powerBiApiRequest.call(this, 'POST', endpoint, {
        format: 'PDF',
        ...body,
    });
    const exportId = exportData.id;
    let exportStatus;
    let attempts = 0;
    const maxAttempts = 10;
    let isCompleted = false;
    do {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusEndpoint = groupId && groupId !== 'me' ?
            `/groups/${groupId}/reports/${reportId}/exports/${exportId}` :
            `/reports/${reportId}/exports/${exportId}`;
        exportStatus = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', statusEndpoint);
        attempts++;
        isCompleted = exportStatus.status === 'Succeeded';
    } while (!isCompleted && attempts < maxAttempts);
    if (!isCompleted) {
        throw new Error('A exportação do PDF expirou. Tente novamente mais tarde.');
    }
    returnData.push({
        json: exportStatus,
    });
    return returnData;
}
exports.exportToPdf = exportToPdf;
//# sourceMappingURL=exportToPdf.js.map