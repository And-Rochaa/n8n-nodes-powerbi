"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasourceStatus = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasourceStatus(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    if (!gatewayId) {
        throw new Error('Gateway ID é obrigatório');
    }
    if (!datasourceId) {
        throw new Error('Datasource ID é obrigatório');
    }
    let authToken = this.getNodeParameter('authToken', index);
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/status`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
        const executionData = this.helpers.constructExecutionMetaData([{ json: responseData }], { itemData: { item: index } });
        return executionData;
    }
    catch (error) {
        if (error.httpCode === '403') {
            throw new Error(`Erro 403: Você não tem permissão para verificar o status desta fonte de dados (Gateway: ${gatewayId}, Datasource: ${datasourceId}). Verifique se você tem acesso de administrador ao gateway e à fonte de dados.`);
        }
        if (error.httpCode === '404') {
            throw new Error(`Erro 404: Gateway (${gatewayId}) ou fonte de dados (${datasourceId}) não encontrado. Verifique se os IDs estão corretos e se você tem acesso a eles.`);
        }
        throw new Error(`Erro ao verificar status da fonte de dados: ${error.message || error}`);
    }
}
exports.getDatasourceStatus = getDatasourceStatus;
//# sourceMappingURL=getDatasourceStatus.js.map