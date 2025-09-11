"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function refresh(i) {
    const returnData = [];
    const groupId = this.getNodeParameter('groupId', i, '');
    const datasetId = this.getNodeParameter('datasetId', i);
    const endpoint = groupId && groupId !== 'me' ?
        `/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
    await GenericFunctions_1.powerBiApiRequest.call(this, 'POST', endpoint);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ success: true, message: 'Refresh started successfully' }), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
exports.refresh = refresh;
//# sourceMappingURL=refresh.js.map