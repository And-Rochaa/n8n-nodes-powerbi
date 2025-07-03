"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasources = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasources(index) {
    const groupId = this.getNodeParameter('groupId', index);
    const dataflowId = this.getNodeParameter('dataflowId', index);
    if (!groupId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Workspace ID is required!');
    }
    if (!dataflowId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow ID is required!');
    }
    try {
        const endpoint = `/groups/${groupId}/dataflows/${dataflowId}/datasources`;
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        if (responseData.value && Array.isArray(responseData.value)) {
            return responseData.value.map((datasource) => ({
                json: datasource,
                pairedItem: { item: index },
            }));
        }
        return [{
                json: responseData,
                pairedItem: { item: index },
            }];
    }
    catch (error) {
        if (error.statusCode === 403) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to access this dataflow.');
        }
        if (error.statusCode === 404) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow not found. Please verify that the workspace and dataflow IDs are correct.');
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error getting dataflow datasources: ${error.message}`);
    }
}
exports.getDatasources = getDatasources;
//# sourceMappingURL=getDatasources.js.map