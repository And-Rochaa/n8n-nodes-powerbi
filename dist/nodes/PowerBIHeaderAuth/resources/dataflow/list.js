"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function list(index) {
    const groupId = this.getNodeParameter('groupId', index);
    if (!groupId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Group ID is required!');
    }
    let authToken = this.getNodeParameter('authToken', index);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    try {
        const endpoint = `/groups/${groupId}/dataflows`;
        const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
        if (responseData.value && Array.isArray(responseData.value)) {
            return responseData.value.map((dataflow) => ({
                json: dataflow,
            }));
        }
        return [{ json: responseData }];
    }
    catch (error) {
        if (error.statusCode === 403) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to access this workspace and that the workspace supports dataflows.');
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error getting dataflows: ${error.message}`);
    }
}
exports.list = list;
//# sourceMappingURL=list.js.map