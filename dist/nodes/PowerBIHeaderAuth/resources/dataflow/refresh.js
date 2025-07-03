"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function refresh(index) {
    const groupId = this.getNodeParameter('groupId', index);
    const dataflowId = this.getNodeParameter('dataflowId', index);
    const notifyOption = this.getNodeParameter('notifyOption', index, 'NoNotification');
    const processType = this.getNodeParameter('processType', index);
    if (!groupId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Group ID is required!');
    }
    if (!dataflowId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow ID is required!');
    }
    try {
        let authToken = this.getNodeParameter('authToken', index);
        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
            authToken = authToken.trim().substring(7);
        }
        const headers = {
            Authorization: `Bearer ${authToken}`,
        };
        const body = {
            notifyOption,
        };
        const qs = {};
        if (processType) {
            qs.processType = processType;
        }
        const endpoint = `/groups/${groupId}/dataflows/${dataflowId}/refreshes`;
        await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'POST', endpoint, body, qs, headers);
        return [{ json: { success: true, message: 'Dataflow refresh triggered successfully' } }];
    }
    catch (error) {
        if (error.statusCode === 403) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to refresh this dataflow.');
        }
        if (error.statusCode === 404) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow not found. Please verify that the ID is correct.');
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error refreshing dataflow: ${error.message}`);
    }
}
exports.refresh = refresh;
//# sourceMappingURL=refresh.js.map