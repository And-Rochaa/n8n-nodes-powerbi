"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function refresh(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const groupId = this.getNodeParameter('groupId', i, '');
    const datasetId = this.getNodeParameter('datasetId', i);
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
    await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'POST', endpoint, {}, {}, headers);
    returnData.push({
        json: { success: true, message: 'Refresh started successfully' },
    });
    return returnData;
}
exports.refresh = refresh;
//# sourceMappingURL=refresh.js.map