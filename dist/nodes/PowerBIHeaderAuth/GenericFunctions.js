"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataflows = exports.getDatasources = exports.getGateways = exports.getReports = exports.getTables = exports.getDatasets = exports.getDashboards = exports.getGroupsMultiSelect = exports.getGroups = exports.powerBiApiRequestWithHeaders = void 0;
const n8n_workflow_1 = require("n8n-workflow");
async function powerBiApiRequestWithHeaders(method, endpoint, body = {}, qs = {}, headers = {}, requestOptions = {}) {
    var _a, _b;
    const httpRequestOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: method,
        body,
        qs,
        url: `https://api.powerbi.com/v1.0/myorg${endpoint}`,
        json: true,
    };
    if (headers && Object.keys(headers).length > 0) {
        Object.assign(httpRequestOptions.headers, headers);
    }
    if (requestOptions && Object.keys(requestOptions).length > 0) {
        Object.assign(httpRequestOptions, requestOptions);
    }
    try {
        if (Object.keys(body).length === 0) {
            delete httpRequestOptions.body;
        }
        if (!headers.Authorization && !((_a = httpRequestOptions.headers) === null || _a === void 0 ? void 0 : _a.Authorization)) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Authentication token required', { description: 'Provide a valid authentication token to access the Power BI API' });
        }
        if (((_b = httpRequestOptions.headers) === null || _b === void 0 ? void 0 : _b.Authorization) && typeof httpRequestOptions.headers.Authorization === 'string') {
            const authHeader = httpRequestOptions.headers.Authorization;
            if (!authHeader.trim().toLowerCase().startsWith('bearer ')) {
                httpRequestOptions.headers.Authorization = `Bearer ${authHeader}`;
            }
        }
        if (httpRequestOptions.json === false) {
            const response = await this.helpers.request({
                ...httpRequestOptions,
                resolveWithFullResponse: true,
                encoding: null
            });
            if (httpRequestOptions.returnFullResponse) {
                return response;
            }
            return response.body;
        }
        else {
            const response = await this.helpers.request(httpRequestOptions);
            return response;
        }
    }
    catch (requestError) {
        if (requestError.response) {
            if (requestError.response.statusCode === 401) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Authentication failed. Check if the token is valid.', { description: 'The provided token was not accepted by the Power BI API. Check if it is in the correct format and has not expired.' });
            }
            if (requestError.response.statusCode === 403) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Access denied. Check token permissions.', { description: 'The token does not have permission to access this Power BI API resource.' });
            }
        }
        throw requestError;
    }
}
exports.powerBiApiRequestWithHeaders = powerBiApiRequestWithHeaders;
async function getGroups(headers) {
    const returnData = [];
    try {
        if (headers.Authorization && typeof headers.Authorization === 'string') {
            const authHeader = headers.Authorization;
            if (!authHeader.trim().toLowerCase().startsWith('bearer ')) {
                headers.Authorization = `Bearer ${authHeader}`;
            }
        }
        const groups = await powerBiApiRequestWithHeaders.call(this, 'GET', '/groups', {}, {}, headers);
        if (groups.value && Array.isArray(groups.value)) {
            for (const group of groups.value) {
                returnData.push({
                    name: group.name,
                    value: group.id,
                });
            }
        }
    }
    catch (error) {
        return [{ name: '-- Error loading workspaces --', value: '' }];
    }
    returnData.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
exports.getGroups = getGroups;
async function getGroupsMultiSelect(headers) {
    const returnData = [
        {
            name: 'My Workspace',
            value: 'me',
        },
    ];
    const groups = await powerBiApiRequestWithHeaders.call(this, 'GET', '/groups', {}, {}, headers);
    if (groups.value) {
        for (const group of groups.value) {
            returnData.push({
                name: group.name,
                value: group.id,
            });
        }
    }
    returnData.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
exports.getGroupsMultiSelect = getGroupsMultiSelect;
async function getDashboards(groupId, headers) {
    const returnData = [];
    let endpoint = '';
    if (groupId === 'me') {
        endpoint = '/dashboards';
    }
    else {
        endpoint = `/groups/${groupId}/dashboards`;
    }
    const dashboards = await powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
    if (dashboards.value) {
        for (const dashboard of dashboards.value) {
            returnData.push({
                name: dashboard.displayName,
                value: dashboard.id,
            });
        }
    }
    return returnData;
}
exports.getDashboards = getDashboards;
async function getDatasets(groupId, headers) {
    const returnData = [];
    let endpoint = '';
    if (groupId === 'me') {
        endpoint = '/datasets';
    }
    else {
        endpoint = `/groups/${groupId}/datasets`;
    }
    const datasets = await powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
    if (datasets.value) {
        for (const dataset of datasets.value) {
            returnData.push({
                name: dataset.name,
                value: dataset.id,
            });
        }
    }
    return returnData;
}
exports.getDatasets = getDatasets;
async function getTables(groupId, datasetId, headers) {
    const returnData = [];
    let endpoint = '';
    if (groupId === 'me') {
        endpoint = `/datasets/${datasetId}/tables`;
    }
    else {
        endpoint = `/groups/${groupId}/datasets/${datasetId}/tables`;
    }
    const tables = await powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
    if (tables.value) {
        for (const table of tables.value) {
            returnData.push({
                name: table.name,
                value: table.name,
            });
        }
    }
    return returnData;
}
exports.getTables = getTables;
async function getReports(groupId, headers) {
    const returnData = [];
    let endpoint = '';
    if (groupId === 'me') {
        endpoint = '/reports';
    }
    else {
        endpoint = `/groups/${groupId}/reports`;
    }
    const reports = await powerBiApiRequestWithHeaders.call(this, 'GET', endpoint, {}, {}, headers);
    if (reports.value) {
        for (const report of reports.value) {
            returnData.push({
                name: report.name,
                value: report.id,
            });
        }
    }
    return returnData;
}
exports.getReports = getReports;
async function getGateways() {
    const returnData = [];
    try {
        let authToken = this.getNodeParameter('authToken', 0);
        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
            authToken = authToken.trim().substring(7);
        }
        const headers = {
            Authorization: `Bearer ${authToken}`,
        };
        const responseData = await powerBiApiRequestWithHeaders.call(this, 'GET', '/gateways', {}, {}, headers);
        if (responseData && responseData.value) {
            for (const gateway of responseData.value) {
                if (gateway.name && gateway.id) {
                    returnData.push({
                        name: gateway.name,
                        value: gateway.id,
                    });
                }
            }
        }
    }
    catch (error) {
    }
    return returnData;
}
exports.getGateways = getGateways;
async function getDatasources() {
    const returnData = [];
    try {
        const gatewayId = this.getNodeParameter('gatewayId', '');
        if (!gatewayId) {
            return [{ name: '-- Select a gateway first --', value: '' }];
        }
        let authToken = this.getNodeParameter('authToken', '');
        if (!authToken) {
            return [{ name: '-- Authentication token required --', value: '' }];
        }
        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
            authToken = authToken.trim().substring(7);
        }
        const headers = {
            Authorization: `Bearer ${authToken}`,
        };
        const responseData = await powerBiApiRequestWithHeaders.call(this, 'GET', `/gateways/${gatewayId}/datasources`, {}, {}, headers);
        if (responseData && responseData.value) {
            for (const datasource of responseData.value) {
                if (datasource.datasourceName && datasource.id) {
                    returnData.push({
                        name: `${datasource.datasourceName} (${datasource.datasourceType})`,
                        value: datasource.id,
                    });
                }
            }
        }
    }
    catch (error) {
        return [{ name: 'Error loading data sources. Check permissions.', value: '' }];
    }
    return returnData;
}
exports.getDatasources = getDatasources;
async function getDataflows(groupId, authHeader) {
    const returnData = [];
    if (!groupId) {
        return [{ name: 'Select a workspace first', value: '' }];
    }
    try {
        const responseData = await powerBiApiRequestWithHeaders.call(this, 'GET', `/groups/${groupId}/dataflows`, {}, {}, authHeader);
        if (responseData && responseData.value) {
            if (responseData.value.length === 0) {
                return [{ name: 'No dataflow found in this workspace', value: '' }];
            }
            for (const dataflow of responseData.value) {
                if (dataflow.name && dataflow.objectId) {
                    returnData.push({
                        name: dataflow.name,
                        value: dataflow.objectId,
                    });
                }
            }
        }
        else {
            return [{ name: 'API response does not contain dataflows', value: '' }];
        }
        if (returnData.length === 0) {
            return [{ name: 'No valid dataflow found', value: '' }];
        }
    }
    catch (error) {
        return [{ name: `Error loading dataflows: ${error.message}`, value: '' }];
    }
    return returnData;
}
exports.getDataflows = getDataflows;
//# sourceMappingURL=GenericFunctions.js.map