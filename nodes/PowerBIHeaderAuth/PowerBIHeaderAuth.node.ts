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
	IHttpRequestOptions,
} from 'n8n-workflow';

import {
	powerBiApiRequestWithHeaders,
	getGroups,
	getDashboards,
	getDatasets,
	getDataflows,
	getDatasources,
	getGateways,
	getTables,
	getReports,
	getGroupsMultiSelect,
} from './GenericFunctions';

// Importing modularized resources
import { resources } from './resources';

// Importing each resource descriptions
// We will use the same descriptions as the original PowerBI
import {
	dashboardOperations,
	dashboardFields,
} from '../PowerBI/descriptions/DashboardDescription';

import {
	datasetOperations,
	datasetFields,
} from '../PowerBI/descriptions/DatasetDescription';

import {
	dataflowOperations,
	dataflowFields,
} from './descriptions/DataflowDescription';

import {
	gatewayOperations,
	gatewayFields,
} from './descriptions/GatewayDescription';

import {
	groupOperations,
	groupFields,
} from '../PowerBI/descriptions/GroupDescription';

import {
	reportOperations,
	reportFields,
} from '../PowerBI/descriptions/ReportDescription';

export class PowerBIHeaderAuth implements INodeType {
	description: INodeTypeDescription = {
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
	properties: [			{
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
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get detailed information about workspaces',
						action: 'Get workspace information',
					},					{
						name: 'Get Scan Result',
						value: 'getScanResult',
						description: 'Get the result of a workspace scan',
						action: 'Get scan result',
					},
				],
				default: 'getInfo',
			},{
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
			},			{
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
			
			// TOKEN OPERATIONS
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
				},				options: [
					{
						name: 'Generate Auth URL',
						value: 'generateAuthUrl',
						description: 'Generate OAuth2 authentication URL for Microsoft Entra ID',
						action: 'Generate authentication URL',
					},					{
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
			},			{
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
			},// Fields for generateAuthUrl operation in token resource
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
			
			// Fields for getToken operation in token resource
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
			
			// Fields for refreshToken operation in token resource
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
			},			{
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
			
			// Fields for getServicePrincipalToken operation
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
			},			{
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
			// DASHBOARD OPERATIONS AND FIELDS
			...dashboardOperations,
			...dashboardFields,

			// DATASET OPERATIONS AND FIELDS
			...datasetOperations,
			...datasetFields,

			// DATAFLOW OPERATIONS AND FIELDS
			...dataflowOperations,
			...dataflowFields,

			// GATEWAY OPERATIONS AND FIELDS
			...gatewayOperations,
			...gatewayFields,

			// GROUP OPERATIONS AND FIELDS
			...groupOperations,
			...groupFields,

			// REPORT OPERATIONS AND FIELDS
			...reportOperations,
			...reportFields,
		],	};
	constructor() {
		// @ts-ignore
		this.description.usableAsTool = true;
		// @ts-ignore
		this.description.codex = {
			categories: ['Power BI'],
			subcategories: {
				'Power BI': ['Dashboards', 'Reports', 'Datasets']
			},
			// Nome simplificado para uso com AI (array de strings)
			alias: ['powerbi_header_auth', 'powerbi_token']
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

	methods = {
		loadOptions: {			async getGroups(this: ILoadOptionsFunctions) {
				try {
					// First try to get the token from input data
					let authToken = '';
					
					// Try to get the token from parameter
					authToken = this.getNodeParameter('authToken', '') as string;
					
					if (!authToken) {
						// Return message indicating that token is required
						return [{ name: '-- Authentication Token Required --', value: '' }];
					}
					
					// Remove "Bearer" prefix if already present in token
					if (authToken.trim().toLowerCase().startsWith('bearer ')) {
						authToken = authToken.trim().substring(7);
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getGroups.call(this, authHeader);
				} catch (error) {
					return [{ name: 'Error Loading Groups. Check the Token.', value: '' }];
				}
			},			async getGroupsMultiSelect(this: ILoadOptionsFunctions) {
				try {
					let authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Return message indicating that token is required
						return [{ name: '-- Authentication Token Required --', value: '' }];
					}
					
					// Remove "Bearer" prefix if already present in token
					if (authToken.trim().toLowerCase().startsWith('bearer ')) {
						authToken = authToken.trim().substring(7);
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getGroupsMultiSelect.call(this, authHeader);
				} catch (error) {
					return [{ name: 'Error Loading Groups. Check the Token.', value: '' }];
				}
			},			async getDashboards(this: ILoadOptionsFunctions) {
				try {
					let authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Return message indicating that token is required
						return [{ name: '-- Authentication Token Required --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					if (!groupId) {
						return [{ name: '-- Select a Workspace First --', value: '' }];
					}
					
					// Remove "Bearer" prefix if already present in token
					if (authToken.trim().toLowerCase().startsWith('bearer ')) {
						authToken = authToken.trim().substring(7);
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getDashboards.call(this, groupId, authHeader);
				} catch (error) {
					return [{ name: 'Error Loading Dashboards. Check the Token.', value: '' }];
				}
			},			async getDatasets(this: ILoadOptionsFunctions) {
				try {
					const authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Return message indicating that token is required
						return [{ name: '-- Authentication Token Required --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					if (!groupId) {
						return [{ name: '-- Select a Workspace First --', value: '' }];
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getDatasets.call(this, groupId, authHeader);
				} catch (error) {
					return [{ name: 'Error Loading Datasets. Check the Token.', value: '' }];
				}
			},			async getTables(this: ILoadOptionsFunctions) {
				try {
					const authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Return message indicating that token is required
						return [{ name: '-- Authentication Token Required --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					const datasetId = this.getNodeParameter('datasetId', '') as string;
					if (!datasetId) {
						return [{ name: '-- Select a Dataset First --', value: '' }];
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getTables.call(this, groupId, datasetId, authHeader);
				} catch (error) {
					return [{ name: 'Error Loading Tables. Check the Token.', value: '' }];
				}
			},			async getReports(this: ILoadOptionsFunctions) {
				try {
					let authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Return message indicating that token is required
						return [{ name: '-- Authentication Token Required --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					if (!groupId) {
						return [{ name: '-- Select a Workspace First --', value: '' }];
					}
					
					// Remove "Bearer" prefix if already present in token
					if (authToken.trim().toLowerCase().startsWith('bearer ')) {
						authToken = authToken.trim().substring(7);
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getReports.call(this, groupId, authHeader);
				} catch (error) {
					return [{ name: 'Error Loading Reports. Check the Token.', value: '' }];
				}
			},
			async getDataflows(this: ILoadOptionsFunctions) {
				try {
					const authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Return message indicating that token is required
						return [{ name: '-- Authentication Token Required --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					if (!groupId) {
						return [{ name: '-- Select a Workspace First --', value: '' }];
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getDataflows.call(this, groupId, authHeader);
				} catch (error) {
					return [{ name: 'Error Loading Dataflows. Check the Token.', value: '' }];
				}
			},
			async getGateways(this: ILoadOptionsFunctions) {
				return await getGateways.call(this);
			},
			async getDatasources(this: ILoadOptionsFunctions) {
				return await getDatasources.call(this);
			},
		},
	};
	
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		
		// Check if it's a token resource operation (no authentication needed)
		const isAuthExemptOperation = (resource === 'token');
		
		// Get token from input parameter (or default value in node) only if not an authentication-exempt operation
		let authToken = '';
		if (!isAuthExemptOperation) {
			try {
				// First try to get from input parameter
				if (items[0]?.json?.access_token) {
					authToken = items[0].json.access_token as string;
				} else {
					// If not found in input, get from node parameter
					authToken = this.getNodeParameter('authToken', 0) as string;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Failed to get authentication token');
			}
			
			if (!authToken) {
				throw new NodeOperationError(
					this.getNode(),
					'Authentication token is required. Provide a token in the input or node parameter.'
				);
			}
		}
				// Prepare the authorization header		// Configure authorization headers only if not an authentication-exempt operation
		const headers: IDataObject = {};
		
		if (!isAuthExemptOperation) {
			// Remove "Bearer" prefix if already present in token
			if (authToken.trim().toLowerCase().startsWith('bearer ')) {
				authToken = authToken.trim().substring(7);
			}
			
			headers.Authorization = `Bearer ${authToken}`;
		}
		
		// Process operations similar to the original PowerBI node
		// but use powerBiApiRequestWithHeaders instead
		
		for (let i = 0; i < items.length; i++) {
			try {                // Implementation of cases for each resource
                if (resource === 'dashboard') {
                    // Dashboard operations - using modularized resources
                    if (operation in resources.dashboard) {
                        // Execute corresponding operation
                        const results = await resources.dashboard[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Important: mark responseData as null to avoid additional processing
                        responseData = null;
                    }
                } else if (resource === 'dataset') {
                    // Dataset operations - using modularized resources
                    if (operation in resources.dataset) {
                        // Execute corresponding operation
                        const results = await resources.dataset[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Important: mark responseData as null to avoid additional processing
                        responseData = null;
                    }
                } else if (resource === 'dataflow') {
                    // Dataflow operations - using modularized resources
                    if (operation in resources.dataflow) {
                        // Execute corresponding operation
                        const results = await resources.dataflow[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Important: mark responseData as null to avoid additional processing
                        responseData = null;
                    }
                } else if (resource === 'group') {
                    // Group operations - using modularized resources
                    if (operation in resources.group) {
                        // Execute corresponding operation
                        const results = await resources.group[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Important: mark responseData as null to avoid additional processing
                        responseData = null;
                    }
                } else if (resource === 'gateway') {
                    // Gateway operations - using modularized resources
                    if (operation in resources.gateway) {
                        // Execute corresponding operation
                        const results = await resources.gateway[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Important: mark responseData as null to avoid additional processing
                        responseData = null;
                    }
                } else if (resource === 'report') {
                    // Report operations - using modularized resources
                    if (operation in resources.report) {
                        // Execute corresponding operation
                        const results = await resources.report[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Important: mark responseData as null to avoid additional processing
                        responseData = null;
                    }                } else if (resource === 'admin') {
                    // Admin operations - using modularized resources
                    if (operation in resources.admin) {
                        // Execute corresponding operation
                        const results = await resources.admin[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Important: mark responseData as null to avoid additional processing
                        responseData = null;
                    }
                } else if (resource === 'token') {
                    // Token operations - using modularized resources
                    if (operation in resources.token) {
                        // Execute corresponding operation
                        const results = await resources.token[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Important: mark responseData as null to avoid additional processing
                        responseData = null;
                    }
                }				// If responseData is null here, it means it has already been processed (especially for groups)
				// This happens because we add items directly to returnData above
				if (responseData === null) {
					continue;
				}
				
				// If responseData is undefined, create an empty object to avoid errors
				if (responseData === undefined) {
					responseData = {};
				}
						try {
					// Process in normal pattern for other operations
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} catch (processingError) {
					// Fallback to ensure something is returned
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: 'Error processing results', details: String(processingError) }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}
		
		return this.prepareOutputData(returnData);
	}
}

// Export default for n8n compatibility
export default PowerBIHeaderAuth;