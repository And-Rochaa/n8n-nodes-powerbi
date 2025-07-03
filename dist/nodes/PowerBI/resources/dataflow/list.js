"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDataflows = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function listDataflows(index) {
    const groupId = this.getNodeParameter('groupId', index);
    if (!groupId) {
        throw new Error('Workspace ID is required');
    }
    const endpoint = `/groups/${groupId}/dataflows`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        if (responseData.value && Array.isArray(responseData.value)) {
            return responseData.value.map((dataflow) => ({
                json: dataflow,
                pairedItem: { item: index },
            }));
        }
        return [{
                json: responseData,
                pairedItem: { item: index },
            }];
    }
    catch (error) {
        const errorMessage = error.message || error.toString();
        throw new Error(`Error getting dataflows (Workspace: ${groupId}): ${errorMessage}. Please verify that you have adequate permissions in the workspace.`);
    }
}
exports.listDataflows = listDataflows;
//# sourceMappingURL=list.js.map