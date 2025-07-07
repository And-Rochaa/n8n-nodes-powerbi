import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeOperationError,
	NodeConnectionType,
	IDataObject,
} from 'n8n-workflow';

import {
	powerBiApiRequest,
	getGroups,
	getDashboards,
	getGroupsMultiSelect,
	getDatasets,
	getDataflows,
	getDatasources,
	getGateways,
	getTables,
	getReports,
} from './GenericFunctions';

// Importing modularized resources
import { resources } from './resources';

// Importing descriptions for each resource
import {
	dashboardOperations,
	dashboardFields,
} from './descriptions/DashboardDescription';

import {
	dataflowOperations,
	dataflowFields,
} from './descriptions/DataflowDescription';

import {
	datasetOperations,
	datasetFields,
} from './descriptions/DatasetDescription';

import {
	gatewayOperations,
	gatewayFields,
} from './descriptions/GatewayDescription';

import {
	groupOperations,
	groupFields,
} from './descriptions/GroupDescription';

import {
	reportOperations,
	reportFields,
} from './descriptions/ReportDescription';

// Importing execution functions removed - now implemented directly

export class PowerBI implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Power BI',
		name: 'powerBi',
		icon: 'file:powerbi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Work with the Power BI API',
		defaults: {
			name: 'Power BI',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'powerBiApiOAuth2Api',
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
			// ADMIN OPERATIONS
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
			// Admin fields
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
				description: 'Whether to include dataset schema',
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
				description: 'Whether to include dataset expressions',
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
				description: 'Whether to include data lineage information',
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
				description: 'Whether to include data source details',
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

			// DASHBOARD OPERATIONS
			...dashboardOperations,
			...dashboardFields,

			// DATAFLOW OPERATIONS
			...dataflowOperations,
			...dataflowFields,

			// DATASET OPERATIONS
			...datasetOperations,
			...datasetFields,

			// GATEWAY OPERATIONS
			...gatewayOperations,
			...gatewayFields,

			// GROUP OPERATIONS
			...groupOperations,
			...groupFields,

			// REPORT OPERATIONS
			...reportOperations,
			...reportFields,
		],
	};
	// Methods to load options
	methods = {
		loadOptions: {
			async getGroups(this: ILoadOptionsFunctions) {
				return await getGroups.call(this);
			},
			async getGroupsMultiSelect(this: ILoadOptionsFunctions) {
				return await getGroupsMultiSelect.call(this);
			},
			async getDashboards(this: ILoadOptionsFunctions) {
				return await getDashboards.call(this);
			},
			async getDatasets(this: ILoadOptionsFunctions) {
				return await getDatasets.call(this);
			},
			async getDataflows(this: ILoadOptionsFunctions) {
				return await getDataflows.call(this);
			},
			async getDatasources(this: ILoadOptionsFunctions) {
				return await getDatasources.call(this);
			},
			async getGateways(this: ILoadOptionsFunctions) {
				return await getGateways.call(this);
			},
			async getTables(this: ILoadOptionsFunctions) {
				return await getTables.call(this);
			},
			async getReports(this: ILoadOptionsFunctions) {
				return await getReports.call(this);
			},
		},
	};
	
	// Adds the usableAsTool property dynamically
	constructor() {
		// @ts-ignore
		this.description.usableAsTool = true;
		
		// @ts-ignore
		this.description.displayName = 'Power BI';
				// @ts-ignore
		this.description.codex = {
			categories: ['Power BI'],
			subcategories: {
				'Power BI': ['Dashboards', 'Reports', 'Datasets']
			},
			// Simplified name for AI usage (string array)
			alias: ['powerbi']
		};
		
		// If necessary, add other properties required for tools
		// @ts-ignore
		if (!this.description.triggerPanel) {
			// @ts-ignore
			Object.defineProperty(this.description, 'triggerPanel', {
				value: {},
				configurable: true
			});
		}
	}
	
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const length = items.length;
		
		let responseData;
		let endpoint = '';

		try {
			// Execution based on selected resource and operation
			for (let i = 0; i < length; i++) {
				try {
					switch (resource) {
						case 'admin':
							// Using modularized resources
							if (operation in resources.admin) {
								// Execute the corresponding operation
								const results = await resources.admin[operation].call(this, i);
								returnData.push(...results);
							}
							break;
						
						case 'dashboard':
							// Using modularized resources
							if (operation in resources.dashboard) {
								// Execute the corresponding operation
								const results = await resources.dashboard[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						case 'dataset':
							// Using modularized resources
							if (operation in resources.dataset) {
								// Execute the corresponding operation
								const results = await resources.dataset[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						case 'gateway':
							// Using modularized resources
							if (operation in resources.gateway) {
								// Execute the corresponding operation
								const results = await resources.gateway[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						case 'group':
							// Using modularized resources
							if (operation in resources.group) {
								// Execute the corresponding operation
								const results = await resources.group[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						case 'report':
							// Using modularized resources
							if (operation in resources.report) {
								// Execute the corresponding operation
								const results = await resources.report[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						case 'dataflow':
							// Using modularized resources
							if (operation in resources.dataflow) {
								// Execute the corresponding operation
								const results = await resources.dataflow[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						default:
							throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported!`);
					}
				} catch (error) {
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
		} catch (error) {
			if (this.continueOnFail()) {
				return [this.helpers.returnJsonArray({ error: error.message })];
			}
			throw error;
		}
	}
}

// Export default for n8n compatibility
export default PowerBI;
