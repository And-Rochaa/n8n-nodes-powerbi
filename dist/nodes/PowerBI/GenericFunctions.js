"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboards = exports.getReports = exports.getTables = exports.getDatasets = exports.getGroupsMultiSelect = exports.getGroups = exports.powerBiApiRequestAllItems = exports.powerBiApiRequest = exports.getRopcAccessToken = void 0;
const n8n_workflow_1 = require("n8n-workflow");
async function getRopcAccessToken() {
    const credentials = await this.getCredentials('powerBIApi');
    if (credentials.authType !== 'ropc') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'O método de autenticação não está configurado como ROPC');
    }
    const options = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: {
            grant_type: 'password',
            resource: 'https://analysis.windows.net/powerbi/api',
            client_id: credentials.ropcClientId,
            username: credentials.username,
            password: credentials.password,
        },
        url: 'https://login.microsoftonline.com/common/oauth2/token',
        json: true,
    };
    if (credentials.ropcClientSecret) {
        options.body.client_secret = credentials.ropcClientSecret;
    }
    try {
        const response = await this.helpers.request(options);
        if (response.access_token) {
            return response.access_token;
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Não foi possível obter o token de acesso', {
                description: JSON.stringify(response),
            });
        }
    }
    catch (error) {
        if (error.message && error.message.includes('AADSTS')) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: 'Erro na autenticação do Azure AD: ' + error.error_description || error.message,
                description: 'Verifique suas credenciais e permissões.',
            });
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
exports.getRopcAccessToken = getRopcAccessToken;
async function powerBiApiRequest(method, endpoint, body = {}, qs = {}, requestOptions = {}) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: method,
        body,
        qs,
        url: `https://api.powerbi.com/v1.0/myorg${endpoint}`,
        json: true,
    };
    if (requestOptions && Object.keys(requestOptions).length > 0) {
        Object.assign(options, requestOptions);
    }
    try {
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (options.json === false) {
            const oauth2Options = {
                ...options,
                resolveWithFullResponse: true,
                encoding: null,
            };
            const response = await this.helpers.requestOAuth2.call(this, 'powerBIApi', oauth2Options, { tokenType: 'Bearer', includeCredentialsOnRefreshOnBody: true });
            if (requestOptions.returnFullResponse) {
                return response;
            }
            return response.body || response;
        }
        else {
            const response = await this.helpers.requestOAuth2.call(this, 'powerBIApi', options, { tokenType: 'Bearer', includeCredentialsOnRefreshOnBody: true });
            return response;
        }
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
exports.powerBiApiRequest = powerBiApiRequest;
async function powerBiApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.top = 100;
    do {
        responseData = await powerBiApiRequest.call(this, method, endpoint, body, query);
        returnData.push.apply(returnData, responseData[propertyName]);
        if (responseData.nextLink) {
            const skipTokenMatch = responseData.nextLink.match(/\$skiptoken=([^&]+)/);
            if (skipTokenMatch && skipTokenMatch[1]) {
                query.skiptoken = skipTokenMatch[1];
            }
        }
    } while (responseData.nextLink);
    return returnData;
}
exports.powerBiApiRequestAllItems = powerBiApiRequestAllItems;
async function getGroups() {
    const returnData = [];
    const groups = await powerBiApiRequestAllItems.call(this, 'value', 'GET', '/groups', {});
    returnData.push({
        name: 'Meu Workspace',
        value: 'me',
    });
    for (const group of groups) {
        if (group.name && group.id) {
            returnData.push({
                name: group.name,
                value: group.id,
            });
        }
    }
    return returnData;
}
exports.getGroups = getGroups;
async function getGroupsMultiSelect() {
    const returnData = [];
    const groups = await powerBiApiRequestAllItems.call(this, 'value', 'GET', '/groups', {});
    for (const group of groups) {
        if (group.name && group.id) {
            returnData.push({
                name: group.name,
                value: group.id,
            });
        }
    }
    return returnData;
}
exports.getGroupsMultiSelect = getGroupsMultiSelect;
async function getDatasets() {
    const returnData = [];
    let groupId;
    try {
        groupId = this.getNodeParameter('groupId', 0);
    }
    catch (error) {
        return [{ name: 'Selecione um grupo primeiro', value: '' }];
    }
    if (!groupId) {
        return [{ name: 'Selecione um grupo primeiro', value: '' }];
    }
    let endpoint = '/datasets';
    if (groupId && groupId !== 'me') {
        endpoint = `/groups/${groupId}/datasets`;
    }
    const datasets = await powerBiApiRequestAllItems.call(this, 'value', 'GET', endpoint, {});
    for (const dataset of datasets) {
        if (dataset.name && dataset.id) {
            returnData.push({
                name: dataset.name,
                value: dataset.id,
            });
        }
    }
    return returnData;
}
exports.getDatasets = getDatasets;
async function getTables() {
    const returnData = [];
    let groupId, datasetId;
    try {
        groupId = this.getNodeParameter('groupId', 0);
        datasetId = this.getNodeParameter('datasetId', 0);
    }
    catch (error) {
        return [{ name: 'Selecione um grupo e dataset primeiro', value: '' }];
    }
    if (!groupId || !datasetId) {
        return [{ name: 'Selecione um grupo e dataset primeiro', value: '' }];
    }
    let endpoint = `/datasets/${datasetId}/tables`;
    if (groupId && groupId !== 'me') {
        endpoint = `/groups/${groupId}/datasets/${datasetId}/tables`;
    }
    const tables = await powerBiApiRequestAllItems.call(this, 'value', 'GET', endpoint, {});
    for (const table of tables) {
        if (table.name) {
            returnData.push({
                name: table.name,
                value: table.name,
            });
        }
    }
    return returnData;
}
exports.getTables = getTables;
async function getReports() {
    const returnData = [];
    let groupId;
    try {
        groupId = this.getNodeParameter('groupId', 0);
    }
    catch (error) {
        return [{ name: 'Selecione um grupo primeiro', value: '' }];
    }
    if (!groupId) {
        return [{ name: 'Selecione um grupo primeiro', value: '' }];
    }
    let endpoint = '/reports';
    if (groupId && groupId !== 'me') {
        endpoint = `/groups/${groupId}/reports`;
    }
    const reports = await powerBiApiRequestAllItems.call(this, 'value', 'GET', endpoint, {});
    for (const report of reports) {
        if (report.name && report.id) {
            returnData.push({
                name: report.name,
                value: report.id,
            });
        }
    }
    return returnData;
}
exports.getReports = getReports;
async function getDashboards() {
    const returnData = [];
    let groupId;
    try {
        groupId = this.getNodeParameter('groupId', 0);
    }
    catch (error) {
        return [{ name: 'Selecione um grupo primeiro', value: '' }];
    }
    if (!groupId) {
        return [{ name: 'Selecione um grupo primeiro', value: '' }];
    }
    let endpoint = '/dashboards';
    if (groupId && groupId !== 'me') {
        endpoint = `/groups/${groupId}/dashboards`;
    }
    const dashboards = await powerBiApiRequestAllItems.call(this, 'value', 'GET', endpoint, {});
    for (const dashboard of dashboards) {
        if (dashboard.displayName && dashboard.id) {
            returnData.push({
                name: dashboard.displayName,
                value: dashboard.id,
            });
        }
    }
    return returnData;
}
exports.getDashboards = getDashboards;
//# sourceMappingURL=GenericFunctions.js.map