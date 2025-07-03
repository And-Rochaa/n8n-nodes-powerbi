"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRows = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function addRows(i) {
    const returnData = [];
    let authToken = this.getNodeParameter('authToken', i);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const datasetId = this.getNodeParameter('datasetId', i);
    const tableName = this.getNodeParameter('tableName', i);
    const data = this.getNodeParameter('data', i);
    const groupId = this.getNodeParameter('groupId', i, '');
    let rows;
    try {
        rows = JSON.parse(data);
    }
    catch (error) {
        throw new Error(`Unable to parse JSON rows: ${error}`);
    }
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows` : `/datasets/${datasetId}/tables/${tableName}/rows`;
    await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'POST', endpoint, {
        rows,
    }, {}, headers);
    returnData.push({
        json: { success: true, message: 'Rows added successfully' },
    });
    return returnData;
}
exports.addRows = addRows;
//# sourceMappingURL=addRows.js.map