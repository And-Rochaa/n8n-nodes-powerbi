"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBIHeaderAuth = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const resources_1 = require("./resources");
const DashboardDescription_1 = require("../PowerBI/descriptions/DashboardDescription");
const DatasetDescription_1 = require("../PowerBI/descriptions/DatasetDescription");
const GroupDescription_1 = require("../PowerBI/descriptions/GroupDescription");
const ReportDescription_1 = require("../PowerBI/descriptions/ReportDescription");
const setTimeout = globalThis.setTimeout;
class PowerBIHeaderAuth {
    constructor() {
        this.description = {
            displayName: 'Power BI Header Auth',
            name: 'powerBIHeaderAuth',
            icon: 'file:powerbi.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Work with the Power BI API using header authentication',
            defaults: {
                name: 'Power BI (Header Auth)',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [],
            requestDefaults: {
                baseURL: 'https://api.powerbi.com/v1.0/myorg',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            properties: [
                {
                    displayName: 'Authentication Token',
                    name: 'authToken',
                    type: 'string',
                    typeOptions: {
                        password: true,
                    },
                    default: '',
                    description: 'Bearer token for authentication (without the "Bearer" prefix)',
                    required: true, displayOptions: {
                        hide: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                                'getToken',
                                'refreshToken',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Admin',
                            value: 'admin',
                        },
                        {
                            name: 'Dashboard',
                            value: 'dashboard',
                        },
                        {
                            name: 'Dataset',
                            value: 'dataset',
                        },
                        {
                            name: 'Group',
                            value: 'group',
                        },
                        {
                            name: 'Report',
                            value: 'report',
                        },
                    ],
                    default: 'dashboard',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get Info',
                            value: 'getInfo',
                            description: 'Get detailed information about workspaces',
                            action: 'Get workspace information',
                        }, {
                            name: 'Get Scan Result',
                            value: 'getScanResult',
                            description: 'Get the result of a workspace scan',
                            action: 'Get scan result',
                        }, {
                            name: 'Generate Auth URL',
                            value: 'generateAuthUrl',
                            description: 'Generate OAuth2 authentication URL for Microsoft Entra ID',
                            action: 'Generate authentication URL',
                        }, {
                            name: 'Get Token',
                            value: 'getToken',
                            description: 'Get an access token using an authorization code',
                            action: 'Get access token',
                        },
                        {
                            name: 'Refresh Token',
                            value: 'refreshToken',
                            description: 'Refresh an access token using a refresh token',
                            action: 'Refresh access token',
                        },
                    ],
                    default: 'getInfo',
                }, {
                    displayName: 'Workspaces',
                    name: 'workspaces',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getGroupsMultiSelect',
                    },
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getInfo',
                            ],
                        },
                    },
                    default: [],
                    description: 'Selecione os workspaces para obter informações',
                },
                {
                    displayName: 'Dataset Schema',
                    name: 'datasetSchema',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getInfo',
                            ],
                        },
                    },
                    description: 'Incluir esquema de dataset',
                },
                {
                    displayName: 'Dataset Expressions',
                    name: 'datasetExpressions',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getInfo',
                            ],
                        },
                    },
                    description: 'Incluir expressões DAX dos datasets',
                },
                {
                    displayName: 'Lineage',
                    name: 'lineage',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getInfo',
                            ],
                        },
                    },
                    description: 'Incluir informações de linhagem',
                },
                {
                    displayName: 'Datasource Details',
                    name: 'datasourceDetails',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getInfo',
                            ],
                        },
                    },
                    description: 'Incluir detalhes das fontes de dados',
                }, {
                    displayName: 'ID do Scan',
                    name: 'scanId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getScanResult',
                            ],
                        },
                    },
                    default: '',
                    description: 'ID do resultado do scan gerado pela operação getInfo',
                },
                {
                    displayName: 'Authorization URL',
                    name: 'url',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    default: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
                    description: 'Base URL for Microsoft Entra ID authorization endpoint',
                },
                {
                    displayName: 'Client ID',
                    name: 'clientId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    default: '',
                    description: 'Application client ID registered in Microsoft Entra ID',
                },
                {
                    displayName: 'Response Type',
                    name: 'responseType',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    default: 'code',
                    description: 'The type of response expected from the authorization endpoint',
                },
                {
                    displayName: 'Redirect URI',
                    name: 'redirectUri',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    default: '',
                    description: 'The URI where the authorization response will be sent',
                },
                {
                    displayName: 'Response Mode',
                    name: 'responseMode',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    default: 'query',
                    description: 'Specifies how the authorization response should be returned',
                },
                {
                    displayName: 'Scope',
                    name: 'scope',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    default: 'openid',
                    description: 'Space-separated list of scopes that you want the user to consent to',
                },
                {
                    displayName: 'State',
                    name: 'state',
                    type: 'string',
                    required: false,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'generateAuthUrl',
                            ],
                        },
                    },
                    default: '',
                    description: 'A value included in the request that is also returned in the token response to prevent cross-site request forgery attacks',
                },
                {
                    displayName: 'Token URL',
                    name: 'tokenUrl',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    default: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                    description: 'URL for Microsoft Entra ID token endpoint',
                },
                {
                    displayName: 'Client ID',
                    name: 'clientId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Application client ID registered in Microsoft Entra ID',
                },
                {
                    displayName: 'Client Secret',
                    name: 'clientSecret',
                    type: 'string',
                    typeOptions: {
                        password: true,
                    },
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Secret key of application registered in Microsoft Entra ID',
                },
                {
                    displayName: 'Authorization Code',
                    name: 'code',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Authorization code received from the authorization endpoint',
                },
                {
                    displayName: 'Redirect URI',
                    name: 'redirectUri',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'The same redirect URI used in the authorization request',
                },
                {
                    displayName: 'Grant Type',
                    name: 'grantType',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    default: 'authorization_code',
                    description: 'The type of grant used in OAuth2 flow',
                },
                {
                    displayName: 'Scope',
                    name: 'scope',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'getToken',
                            ],
                        },
                    },
                    default: 'https://analysis.windows.net/powerbi/api/.default offline_access',
                    description: 'Space-separated list of scopes that you want access to',
                },
                {
                    displayName: 'Token URL',
                    name: 'tokenUrl',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                    description: 'URL for Microsoft Entra ID token endpoint',
                },
                {
                    displayName: 'Client ID',
                    name: 'clientId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Application client ID registered in Microsoft Entra ID',
                },
                {
                    displayName: 'Client Secret',
                    name: 'clientSecret',
                    type: 'string',
                    typeOptions: {
                        password: true,
                    },
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Secret key of application registered in Microsoft Entra ID',
                },
                {
                    displayName: 'Refresh Token',
                    name: 'refreshToken',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Refresh token received from a previous token response',
                },
                {
                    displayName: 'Redirect URI',
                    name: 'redirectUri',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'The same redirect URI used in the authorization request',
                },
                {
                    displayName: 'Grant Type',
                    name: 'grantType',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: 'refresh_token',
                    description: 'The type of grant used in OAuth2 flow',
                },
                {
                    displayName: 'Scope',
                    name: 'scope',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'admin',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: 'https://analysis.windows.net/powerbi/api/.default offline_access',
                    description: 'Space-separated list of scopes that you want access to',
                },
                ...DashboardDescription_1.dashboardOperations,
                ...DashboardDescription_1.dashboardFields,
                ...DatasetDescription_1.datasetOperations,
                ...DatasetDescription_1.datasetFields,
                ...GroupDescription_1.groupOperations,
                ...GroupDescription_1.groupFields,
                ...ReportDescription_1.reportOperations,
                ...ReportDescription_1.reportFields,
            ],
        };
        this.methods = {
            loadOptions: { async getGroups() {
                    try {
                        let authToken = '';
                        authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                            authToken = authToken.trim().substring(7);
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getGroups.call(this, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar grupos. Verifique o token.', value: '' }];
                    }
                }, async getGroupsMultiSelect() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                            authToken = authToken.trim().substring(7);
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getGroupsMultiSelect.call(this, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar grupos. Verifique o token.', value: '' }];
                    }
                }, async getDashboards() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
                        }
                        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                            authToken = authToken.trim().substring(7);
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getDashboards.call(this, groupId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar dashboards. Verifique o token.', value: '' }];
                    }
                }, async getDatasets() {
                    try {
                        const authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getDatasets.call(this, groupId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar datasets. Verifique o token.', value: '' }];
                    }
                }, async getTables() {
                    try {
                        const authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        const datasetId = this.getNodeParameter('datasetId', '');
                        if (!datasetId) {
                            return [{ name: '-- Selecione um dataset primeiro --', value: '' }];
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getTables.call(this, groupId, datasetId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar tabelas. Verifique o token.', value: '' }];
                    }
                }, async getReports() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
                        }
                        if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                            authToken = authToken.trim().substring(7);
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getReports.call(this, groupId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Erro ao carregar relatórios. Verifique o token.', value: '' }];
                    }
                },
            },
        };
        this.description.usableAsTool = true;
        this.description.codex = {
            categories: ['Power BI'],
            subcategories: {
                'Power BI': ['Dashboards', 'Reports', 'Datasets']
            },
            alias: ['powerbi_header_auth', 'powerbi_token']
        };
        if (!this.description.triggerPanel) {
            Object.defineProperty(this.description, 'triggerPanel', {
                value: {},
                configurable: true
            });
        }
    }
    async execute() {
        var _a, _b;
        const items = this.getInputData();
        const returnData = [];
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const isGenerateAuthUrlOperation = (resource === 'admin' && operation === 'generateAuthUrl');
        const isGetTokenOperation = (resource === 'admin' && operation === 'getToken');
        const isRefreshTokenOperation = (resource === 'admin' && operation === 'refreshToken');
        const isAuthExemptOperation = isGenerateAuthUrlOperation || isGetTokenOperation || isRefreshTokenOperation;
        let authToken = '';
        if (!isAuthExemptOperation) {
            try {
                if ((_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.json) === null || _b === void 0 ? void 0 : _b.access_token) {
                    authToken = items[0].json.access_token;
                }
                else {
                    authToken = this.getNodeParameter('authToken', 0);
                }
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Falha ao obter token de autenticação');
            }
            if (!authToken) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Token de autenticação é obrigatório. Forneça um token na entrada ou no parâmetro do nó.');
            }
        }
        const headers = {};
        if (!isAuthExemptOperation) {
            if (authToken.trim().toLowerCase().startsWith('bearer ')) {
                authToken = authToken.trim().substring(7);
            }
            headers.Authorization = `Bearer ${authToken}`;
        }
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'dashboard') {
                    if (operation in resources_1.resources.dashboard) {
                        const results = await resources_1.resources.dashboard[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                else if (resource === 'dataset') {
                    if (operation in resources_1.resources.dataset) {
                        const results = await resources_1.resources.dataset[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                else if (resource === 'group') {
                    if (operation in resources_1.resources.group) {
                        const results = await resources_1.resources.group[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                else if (resource === 'report') {
                    if (operation in resources_1.resources.report) {
                        const results = await resources_1.resources.report[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                else if (resource === 'admin') {
                    if (operation in resources_1.resources.admin) {
                        const results = await resources_1.resources.admin[operation].call(this, i);
                        returnData.push(...results);
                        responseData = null;
                    }
                }
                if (responseData === null) {
                    continue;
                }
                if (responseData === undefined) {
                    responseData = {};
                }
                try {
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
                catch (processingError) {
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: 'Erro ao processar resultados', details: String(processingError) }), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.PowerBIHeaderAuth = PowerBIHeaderAuth;
//# sourceMappingURL=PowerBIHeaderAuth.node.js.map