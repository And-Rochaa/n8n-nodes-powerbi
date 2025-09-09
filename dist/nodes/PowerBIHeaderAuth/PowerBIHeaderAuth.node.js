"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBiHeaderAuth = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const resources_1 = require("./resources");
const DashboardDescription_1 = require("../PowerBI/descriptions/DashboardDescription");
const DatasetDescription_1 = require("../PowerBI/descriptions/DatasetDescription");
const DataflowDescription_1 = require("./descriptions/DataflowDescription");
const GatewayDescription_1 = require("./descriptions/GatewayDescription");
const GroupDescription_1 = require("../PowerBI/descriptions/GroupDescription");
const ReportDescription_1 = require("../PowerBI/descriptions/ReportDescription");
class PowerBiHeaderAuth {
    constructor() {
        this.description = {
            displayName: 'Power BI Header Auth',
            name: 'powerBiHeaderAuth',
            icon: 'file:powerbi.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Work with the Power BI API using header authentication',
            defaults: {
                name: 'Power BI (Header Auth)',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            requestDefaults: {
                baseURL: 'https://api.powerbi.com/v1.0/myorg',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            properties: [{
                    displayName: 'Authentication Token',
                    name: 'authToken',
                    type: 'string',
                    typeOptions: {
                        password: true,
                    },
                    default: '',
                    description: 'Bearer token for authentication (without the "Bearer" prefix)',
                    required: true,
                    displayOptions: {
                        hide: {
                            resource: [
                                'token',
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
                            name: 'Dataflow',
                            value: 'dataflow',
                        },
                        {
                            name: 'Dataset',
                            value: 'dataset',
                        },
                        {
                            name: 'Gateway',
                            value: 'gateway',
                        },
                        {
                            name: 'Group',
                            value: 'group',
                        },
                        {
                            name: 'Report',
                            value: 'report',
                        },
                        {
                            name: 'Token',
                            value: 'token',
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
                        },
                    ],
                    default: 'getInfo',
                }, {
                    displayName: 'Workspace Names or IDs',
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
                    description: 'Select the workspaces to get information. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
                    description: 'Whether to include dataset schema',
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
                    description: 'Whether to include DAX expressions from datasets',
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
                    description: 'Whether to include lineage information',
                }, {
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
                    description: 'Whether to include data source details',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
                            ],
                        },
                    }, options: [
                        {
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
                            name: 'Get Service Principal Token',
                            value: 'getServicePrincipalToken',
                            description: 'Get an access token using Service Principal credentials',
                            action: 'Get service principal token',
                        },
                        {
                            name: 'Refresh Token',
                            value: 'refreshToken',
                            description: 'Refresh an access token using a refresh token',
                            action: 'Refresh access token',
                        },
                    ],
                    default: 'generateAuthUrl',
                }, {
                    displayName: 'Scan ID',
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
                    description: 'Scan result ID generated by the getInfo operation',
                },
                {
                    displayName: 'Authorization URL',
                    name: 'url',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
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
                                'token',
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
                                'token',
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
                                'token',
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
                                'token',
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
                                'token',
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
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
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
                    typeOptions: { password: true },
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
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
                                'token',
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
                                'token',
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
                                'token',
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
                                'token',
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
                                'token',
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
                                'token',
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
                    typeOptions: { password: true },
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
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
                                'token',
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
                                'token',
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
                    typeOptions: { password: true },
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
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
                                'token',
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
                                'token',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: 'refresh_token',
                    description: 'The type of grant used in OAuth2 flow',
                }, {
                    displayName: 'Scope',
                    name: 'scope',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
                            ],
                            operation: [
                                'refreshToken',
                            ],
                        },
                    },
                    default: 'https://analysis.windows.net/powerbi/api/.default offline_access',
                    description: 'Space-separated list of scopes that you want access to',
                },
                {
                    displayName: 'Tenant ID',
                    name: 'tenantId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
                            ],
                            operation: [
                                'getServicePrincipalToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Microsoft Entra ID (formerly Azure AD) tenant ID',
                },
                {
                    displayName: 'Client ID',
                    name: 'clientId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
                            ],
                            operation: [
                                'getServicePrincipalToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Application ID registered in Microsoft Entra ID',
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
                                'token',
                            ],
                            operation: [
                                'getServicePrincipalToken',
                            ],
                        },
                    },
                    default: '',
                    description: 'Secret key of application registered in Microsoft Entra ID',
                }, {
                    displayName: 'API Resource',
                    name: 'apiResource',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
                            ],
                            operation: [
                                'getServicePrincipalToken',
                            ],
                        },
                    },
                    default: 'https://analysis.windows.net/powerbi/api',
                    description: 'The resource you want to get access to',
                },
                {
                    displayName: 'Grant Type',
                    name: 'grantType',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'token',
                            ],
                            operation: [
                                'getServicePrincipalToken',
                            ],
                        },
                    },
                    default: 'client_credentials',
                    description: 'The grant type used in OAuth2 flow',
                },
                ...DashboardDescription_1.dashboardOperations,
                ...DashboardDescription_1.dashboardFields,
                ...DatasetDescription_1.datasetOperations,
                ...DatasetDescription_1.datasetFields,
                ...DataflowDescription_1.dataflowOperations,
                ...DataflowDescription_1.dataflowFields,
                ...GatewayDescription_1.gatewayOperations,
                ...GatewayDescription_1.gatewayFields,
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
                            return [{ name: '-- Authentication Token Required --', value: '' }];
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
                        return [{ name: 'Error Loading Groups. Check the Token.', value: '' }];
                    }
                }, async getGroupsMultiSelect() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Authentication Token Required --', value: '' }];
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
                        return [{ name: 'Error Loading Groups. Check the Token.', value: '' }];
                    }
                }, async getDashboards() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Authentication Token Required --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Select a Workspace First --', value: '' }];
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
                        return [{ name: 'Error Loading Dashboards. Check the Token.', value: '' }];
                    }
                }, async getDatasets() {
                    try {
                        const authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Authentication Token Required --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Select a Workspace First --', value: '' }];
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getDatasets.call(this, groupId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Error Loading Datasets. Check the Token.', value: '' }];
                    }
                }, async getTables() {
                    try {
                        const authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Authentication Token Required --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        const datasetId = this.getNodeParameter('datasetId', '');
                        if (!datasetId) {
                            return [{ name: '-- Select a Dataset First --', value: '' }];
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getTables.call(this, groupId, datasetId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Error Loading Tables. Check the Token.', value: '' }];
                    }
                }, async getReports() {
                    try {
                        let authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Authentication Token Required --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Select a Workspace First --', value: '' }];
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
                        return [{ name: 'Error Loading Reports. Check the Token.', value: '' }];
                    }
                },
                async getDataflows() {
                    try {
                        const authToken = this.getNodeParameter('authToken', '');
                        if (!authToken) {
                            return [{ name: '-- Authentication Token Required --', value: '' }];
                        }
                        const groupId = this.getNodeParameter('groupId', '');
                        if (!groupId) {
                            return [{ name: '-- Select a Workspace First --', value: '' }];
                        }
                        const authHeader = {
                            Authorization: `Bearer ${authToken}`
                        };
                        return await GenericFunctions_1.getDataflows.call(this, groupId, authHeader);
                    }
                    catch (error) {
                        return [{ name: 'Error Loading Dataflows. Check the Token.', value: '' }];
                    }
                },
                async getGateways() {
                    return await GenericFunctions_1.getGateways.call(this);
                },
                async getDatasources() {
                    return await GenericFunctions_1.getDatasources.call(this);
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
        const isAuthExemptOperation = (resource === 'token');
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
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Failed to get authentication token');
            }
            if (!authToken) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Authentication token is required. Provide a token in the input or node parameter.');
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
                else if (resource === 'dataflow') {
                    if (operation in resources_1.resources.dataflow) {
                        const results = await resources_1.resources.dataflow[operation].call(this, i);
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
                else if (resource === 'gateway') {
                    if (operation in resources_1.resources.gateway) {
                        const results = await resources_1.resources.gateway[operation].call(this, i);
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
                else if (resource === 'token') {
                    if (operation in resources_1.resources.token) {
                        const results = await resources_1.resources.token[operation].call(this, i);
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
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: 'Error processing results', details: String(processingError) }), { itemData: { item: i } });
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
exports.PowerBiHeaderAuth = PowerBiHeaderAuth;
exports.default = PowerBiHeaderAuth;
//# sourceMappingURL=PowerBiHeaderAuth.node.js.map