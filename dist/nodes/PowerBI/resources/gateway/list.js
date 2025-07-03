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
            response.value.forEach((gateway) => {
                returnData.push({
                    json: gateway,
                });
            });
        }
        else {
            returnData.push({
                json: {
                    message: 'Nenhum gateway encontrado',
                    value: [],
                },
            });
        }
        return returnData;
    }
    catch (error) {
        if (error.response && error.response.data) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error.response.data, {
                message: `Status: ${error.response.status || 'Erro'}`,
                description: `Falha ao listar gateways: ${JSON.stringify(error.response.data)}`,
                httpCode: error.response.status ? error.response.status.toString() : '500',
            });
        }
        throw error;
    }
}
exports.list = list;
//# sourceMappingURL=list.js.map