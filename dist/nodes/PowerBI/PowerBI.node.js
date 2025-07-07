"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBI = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const resources_1 = require("./resources");
const DashboardDescription_1 = require("./descriptions/DashboardDescription");
const DataflowDescription_1 = require("./descriptions/DataflowDescription");
const DatasetDescription_1 = require("./descriptions/DatasetDescription");
const GatewayDescription_1 = require("./descriptions/GatewayDescription");
const GroupDescription_1 = require("./descriptions/GroupDescription");
const ReportDescription_1 = require("./descriptions/ReportDescription");
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
                    name: 'powerBI',
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
                            name: 'Get Workspace Information',
                            value: 'getInfo',
                            description: 'Get detailed information from workspaces',
                            action: 'Get workspace information',
                        },
                        {
                            name: 'Get Scan Result',
                            value: 'getScanResult',
                            description: 'Get the scan result from a workspace',
                            action: 'Get scan result',
                        },
                    ],
                    default: 'getInfo',
                },
                {
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
                    description: 'Include dataset schema',
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
                    description: 'Include dataset expressions',
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
                    description: 'Include data lineage information',
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
                    description: 'Include data source details',
                },
                {
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
                ...DashboardDescription_1.dashboardOperations,
                ...DashboardDescription_1.dashboardFields,
                ...DataflowDescription_1.dataflowOperations,
                ...DataflowDescription_1.dataflowFields,
                ...DatasetDescription_1.datasetOperations,
                ...DatasetDescription_1.datasetFields,
                ...GatewayDescription_1.gatewayOperations,
                ...GatewayDescription_1.gatewayFields,
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
                },
                async getDataflows() {
                    return await GenericFunctions_1.getDataflows.call(this);
                },
                async getDatasources() {
                    return await GenericFunctions_1.getDatasources.call(this);
                },
                async getGateways() {
                    return await GenericFunctions_1.getGateways.call(this);
                },
                async getTables() {
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
                        case 'gateway':
                            if (operation in resources_1.resources.gateway) {
                                const results = await resources_1.resources.gateway[operation].call(this, i);
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
                        case 'dataflow':
                            if (operation in resources_1.resources.dataflow) {
                                const results = await resources_1.resources.dataflow[operation].call(this, i);
                                returnData.push(...results);
                            }
                            break;
                        default:
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not supported!`);
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