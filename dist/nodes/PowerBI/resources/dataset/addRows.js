"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRows = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function addRows(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const datasetId = this.getNodeParameter('datasetId', i);
    const tableName = this.getNodeParameter('tableName', i);
    const data = this.getNodeParameter('data', i);
    let rows;
    try {
        rows = JSON.parse(data);
    }
    catch (error) {
        throw new Error(`Não foi possível analisar o JSON das linhas: ${error}`);
    }
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows` : `/datasets/${datasetId}/tables/${tableName}/rows`;
    await GenericFunctions_1.powerBiApiRequest.call(this, 'POST', endpoint, {
        rows,
    });
    returnData.push({
        json: { success: true, message: 'Linhas adicionadas com sucesso' },
    });
    return returnData;
}
exports.addRows = addRows;
//# sourceMappingURL=addRows.js.map