"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatasourceUsers = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
async function getDatasourceUsers(index) {
    var _a, _b;
    const gatewayId = this.getNodeParameter('gatewayId', index);
    const datasourceId = this.getNodeParameter('datasourceId', index);
    if (!gatewayId) {
        throw new Error('Gateway ID é obrigatório');
    }
    if (!datasourceId) {
        throw new Error('Datasource ID é obrigatório');
    }
    let authToken = '';
    try {
        const inputData = this.getInputData();
        if ((_b = (_a = inputData[index]) === null || _a === void 0 ? void 0 : _a.json) === null || _b === void 0 ? void 0 : _b.access_token) {
            authToken = inputData[index].json.access_token;
        }
        else {
            authToken = this.getNodeParameter('authToken', index);
        }
    }
    catch (error) {
        throw new Error('Falha ao obter token de autenticação');
    }
    if (!authToken) {
        throw new Error('Token de autenticação é obrigatório');
    }
    if (authToken.trim().toLowerCase().startsWith('bearer ')) {
        authToken = authToken.trim().substring(7);
    }
    const headers = {
        Authorization: `Bearer ${authToken}`,
    };
    const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/users`;
    try {
        const responseData = await GenericFunctions_1.powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, undefined, undefined, headers);
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