"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBI = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const resources_1 = require("./resources");
const DashboardDescription_1 = require("./descriptions/DashboardDescription");
const DatasetDescription_1 = require("./descriptions/DatasetDescription");
const GroupDescription_1 = require("./descriptions/GroupDescription");
const ReportDescription_1 = require("./descriptions/ReportDescription");
const setTimeout = globalThis.setTimeout;
class PowerBI {
    constructor() {
        this.description = {
            displayName: 'Power BI',
            name: 'powerBI',
            icon: 'file:powerbi.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Work with the Power BI API',
            defaults: {
                name: 'Power BI',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'powerBIApi',
                    required: true,
                },
            ],
            requestDefaults: {
                baseURL: 'https://api.powerbi.com/v1.0/myorg',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            properties: [
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
                            name: 'Obter Informações de Workspaces',
                            value: 'getInfo',
                            description: 'Obtém informações detalhadas dos workspaces',
                            action: 'Get workspace information',
                        },
                        {
                            name: 'Obter Resultado de Scan',
                            value: 'getScanResult',
                            description: 'Obtém o resultado do escaneamento de um workspace',
                            action: 'Get scan result',
                        },
                    ],
                    default: 'getInfo',
                },
                {
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
                    default: true,
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
                    description: 'Incluir esquema do dataset',
                },
                {
                    displayName: 'Dataset Expressions',
                    name: 'datasetExpressions',
                    type: 'boolean',
                    default: true,
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
                    description: 'Incluir expressões do dataset',
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
                    description: 'Incluir informações de linhagem dos dados',
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
                },
                {
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
            loadOptions: {
                async getGroups() {
                    return await GenericFunctions_1.getGroups.call(this);
                },
                async getGroupsMultiSelect() {
                    return await GenericFunctions_1.getGroupsMultiSelect.call(this);
                },
                async getDashboards() {
                    return await GenericFunctions_1.getDashboards.call(this);
                },
                async getDatasets() {
                    return await GenericFunctions_1.getDatasets.call(this);
                }, async getTables() {
                    return await GenericFunctions_1.getTables.call(this);
                },
                async getReports() {
                    return await GenericFunctions_1.getReports.call(this);
                },
            },
        };
        this.description.usableAsTool = true;
        this.description.displayName = 'Power BI';
        this.description.codex = {
            categories: ['Power BI'],
            subcategories: {
                'Power BI': ['Dashboards', 'Reports', 'Datasets']
            },
            alias: ['powerbi']
        };
        if (!this.description.triggerPanel) {
            Object.defineProperty(this.description, 'triggerPanel', {
                value: {},
                configurable: true
            });
        }
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const length = items.length;
        let responseData;
        let endpoint = '';
        try {
            for (let i = 0; i < length; i++) {
                try {
                    switch (resource) {
                        case 'admin':
                            if (operation in resources_1.resources.admin) {
                                const results = await resources_1.resources.admin[operation].call(this, i);
                                returnData.push(...results);
                            }
                            break;
                        case 'dashboard':
                            if (operation in resources_1.resources.dashboard) {
                                const results = await resources_1.resources.dashboard[operation].call(this, i);
                                returnData.push(...results);
                            }
                            break;
                        case 'dataset':
                            if (operation in resources_1.resources.dataset) {
                                const results = await resources_1.resources.dataset[operation].call(this, i);
                                returnData.push(...results);
                            }
                            break;
                        case 'group':
                            if (operation in resources_1.resources.group) {
                                const results = await resources_1.resources.group[operation].call(this, i);
                                returnData.push(...results);
                            }
                            break;
                        case 'report':
                            if (operation in resources_1.resources.report) {
                                const results = await resources_1.resources.report[operation].call(this, i);
                                returnData.push(...results);
                            }
                            break;
                        default:
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `O recurso "${resource}" não é suportado!`);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                        });
                        continue;
                    }
                    throw error;
                }
            }
            return [returnData];
        }
        catch (error) {
            if (this.continueOnFail()) {
                return [this.helpers.returnJsonArray({ error: error.message })];
            }
            throw error;
        }
    }
}
exports.PowerBI = PowerBI;
//# sourceMappingURL=PowerBI.node.js.map