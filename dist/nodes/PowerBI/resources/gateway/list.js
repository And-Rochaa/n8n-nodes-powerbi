"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function list(i) {
    const returnData = [];
    try {
        const response = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', '/gateways');
        if (response.value && Array.isArray(response.value)) {
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response.value), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        else {
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({
                message: 'No gateways found',
                value: [],
            }), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return returnData;
    }
    catch (error) {
        if (error.response && error.response.data) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error.response.data, {
                message: `Status: ${error.response.status || 'Error'}`,
                description: `Failed to list gateways: ${JSON.stringify(error.response.data)}`,
                httpCode: error.response.status ? error.response.status.toString() : '500',
            });
        }
        throw error;
    }
}
exports.list = list;
//# sourceMappingURL=list.js.map