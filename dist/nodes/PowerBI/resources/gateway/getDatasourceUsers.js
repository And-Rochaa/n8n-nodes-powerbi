"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasourceUsers = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasourceUsers(index) {
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    if (!gatewayId) {
        throw new Error('Gateway ID é obrigatório');
    }
    if (!datasourceId) {
        throw new Error('Datasource ID é obrigatório');
    }
    const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/users`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequest.call(this, 'GET', endpoint);
        if (responseData.value && Array.isArray(responseData.value)) {
            return responseData.value.map((user) => ({
                json: user,
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
        throw new Error(`Erro ao obter usuários da fonte de dados (Gateway: ${gatewayId}, Datasource: ${datasourceId}): ${errorMessage}. Verifique se você tem permissões de administrador no gateway e se os IDs estão corretos.`);
    }
}
exports.getDatasourceUsers = getDatasourceUsers;
//# sourceMappingURL=getDatasourceUsers.js.map