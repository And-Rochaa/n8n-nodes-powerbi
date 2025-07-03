"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function get(index) {
    const groupId = this.getNodeParameter('groupId', index);
    const dataflowId = this.getNodeParameter('dataflowId', index);
    if (!groupId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Workspace ID é obrigatório!');
    }
    if (!dataflowId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow ID é obrigatório!');
    }
    try {
        const endpoint = `/groups/${groupId}/dataflows/${dataflowId}`;
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        return [{ json: responseData }];
    }
    catch (error) {
        if (error.statusCode === 403) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Acesso negado. Verifique se você tem permissões para acessar este dataflow.');
        }
        if (error.statusCode === 404) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Dataflow não encontrado. Verifique se o ID está correto.');
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Erro ao obter dataflow: ${error.message}`);
    }
}
exports.get = get;
//# sourceMappingURL=get.js.map