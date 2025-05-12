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
	getTables,
	getReports,
} from './GenericFunctions';

// Importando os recursos modularizados
import { resources } from './resources';

// Importando as descrições de cada recurso
import {
	dashboardOperations,
	dashboardFields,
} from './descriptions/DashboardDescription';

import {
	datasetOperations,
	datasetFields,
} from './descriptions/DatasetDescription';

import {
	groupOperations,
	groupFields,
} from './descriptions/GroupDescription';

import {
	reportOperations,
	reportFields,
} from './descriptions/ReportDescription';

// Importações das funções de execução foram removidas - agora implementadas diretamente
// Para uso do setTimeout nas polling operations
const setTimeout = globalThis.setTimeout;

export class PowerBI implements INodeType {	description: INodeTypeDescription = {
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
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
						value: 'report',					},
				],
				default: 'dashboard',
			},			// ADMIN OPERATIONS
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
			},			// Admin fields
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

			// DASHBOARD OPERATIONS
			...dashboardOperations,
			...dashboardFields,

			// DATASET OPERATIONS
			...datasetOperations,
			...datasetFields,

			// GROUP OPERATIONS
			...groupOperations,
			...groupFields,

			// REPORT OPERATIONS
			...reportOperations,
			...reportFields,
		],
	};
	// Métodos para carregar opções
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
			},			async getTables(this: ILoadOptionsFunctions) {
				return await getTables.call(this);
			},
			async getReports(this: ILoadOptionsFunctions) {
				return await getReports.call(this);
			},
		},
	};
	
	// Adiciona a propriedade usableAsTool dinamicamente
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
			// Nome simplificado para uso com AI (array de strings)
			alias: ['powerbi']
		};
		
		// Se necessário, adicione outras propriedades exigidas para tools
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
			// Execução baseada no recurso e operação selecionados
			for (let i = 0; i < length; i++) {
				try {					switch (resource) {
						case 'admin':
							// Usando os recursos modularizados
							if (operation in resources.admin) {
								// Execute a operação correspondente
								const results = await resources.admin[operation].call(this, i);
								returnData.push(...results);
							}
							break;
						
						case 'dashboard':
							// Usando os recursos modularizados
							if (operation in resources.dashboard) {
								// Execute a operação correspondente
								const results = await resources.dashboard[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						case 'dataset':
							// Usando os recursos modularizados
							if (operation in resources.dataset) {
								// Execute a operação correspondente
								const results = await resources.dataset[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						case 'group':
							// Usando os recursos modularizados
							if (operation in resources.group) {
								// Execute a operação correspondente
								const results = await resources.group[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						case 'report':
							// Usando os recursos modularizados
							if (operation in resources.report) {
								// Execute a operação correspondente
								const results = await resources.report[operation].call(this, i);
								returnData.push(...results);
							}
							break;
							
						default:
							throw new NodeOperationError(this.getNode(), `O recurso "${resource}" não é suportado!`);
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
