"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRows = void 0;
const n8n_workflow_1 = require("n8n-workflow");
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
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Could not parse rows JSON: ${error}`);
    }
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows` : `/datasets/${datasetId}/tables/${tableName}/rows`;
    await GenericFunctions_1.powerBiApiRequest.call(this, 'POST', endpoint, {
        rows,
    });
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ success: true, message: 'Rows added successfully' }), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
exports.addRows = addRows;
//# sourceMappingURL=addRows.js.map