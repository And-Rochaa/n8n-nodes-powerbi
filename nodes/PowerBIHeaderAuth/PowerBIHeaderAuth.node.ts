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
	getTables,
	getReports,
	getGroupsMultiSelect,
} from './GenericFunctions';

// Importando os recursos modularizados
import { resources } from './resources';

// Importando as descrições de cada recurso
// Usaremos as mesmas descrições do PowerBI original
import {
	dashboardOperations,
	dashboardFields,
} from '../PowerBI/descriptions/DashboardDescription';

import {
	datasetOperations,
	datasetFields,
} from '../PowerBI/descriptions/DatasetDescription';

import {
	groupOperations,
	groupFields,
} from '../PowerBI/descriptions/GroupDescription';

import {
	reportOperations,
	reportFields,
} from '../PowerBI/descriptions/ReportDescription';

// Para uso do setTimeout nas polling operations
const setTimeout = globalThis.setTimeout;

export class PowerBIHeaderAuth implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Power BI Header Auth',
		name: 'powerBIHeaderAuth',
		icon: 'file:powerbi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Work with the Power BI API using header authentication',
		defaults: {
			name: 'Power BI Header Auth',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
				required: true,				displayOptions: {
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
					},					{
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
						name: 'Refresh Token',
						value: 'refreshToken',
						description: 'Refresh an access token using a refresh token',
						action: 'Refresh access token',
					},
				],
				default: 'getInfo',
			},			{
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
			},			{
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
			// Campos para a operação generateAuthUrl
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
			
			// Campos para a operação getToken
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
			
			// Campos para a operação refreshToken
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
			// DASHBOARD OPERATIONS AND FIELDS
			...dashboardOperations,
			...dashboardFields,

			// DATASET OPERATIONS AND FIELDS
			...datasetOperations,
			...datasetFields,

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
		this.description.displayName = 'Power BI Header Auth';
		// @ts-ignore
		this.description.codex = {
			categories: ['Power BI'],
			subcategories: {
				'Power BI': ['Dashboards', 'Reports', 'Datasets']
			},
			// Nome simplificado para uso com AI (array de strings)
			alias: ['powerbi_header_auth', 'powerbi_token']
		};
	}

	methods = {
		loadOptions: {			async getGroups(this: ILoadOptionsFunctions) {
				try {
					// Primeiro tenta obter o token dos dados de entrada
					let authToken = '';
					
					// Tenta obter o token do parâmetro
					authToken = this.getNodeParameter('authToken', '') as string;
					
					if (!authToken) {
						// Retornar mensagem indicando que o token é necessário
						return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
					}
					
					// Remover o prefixo "Bearer" se já estiver presente no token
					if (authToken.trim().toLowerCase().startsWith('bearer ')) {
						authToken = authToken.trim().substring(7);
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getGroups.call(this, authHeader);
				} catch (error) {
					return [{ name: 'Erro ao carregar grupos. Verifique o token.', value: '' }];
				}
			},			async getGroupsMultiSelect(this: ILoadOptionsFunctions) {
				try {
					let authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Retornar mensagem indicando que o token é necessário
						return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
					}
					
					// Remover o prefixo "Bearer" se já estiver presente no token
					if (authToken.trim().toLowerCase().startsWith('bearer ')) {
						authToken = authToken.trim().substring(7);
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getGroupsMultiSelect.call(this, authHeader);
				} catch (error) {
					return [{ name: 'Erro ao carregar grupos. Verifique o token.', value: '' }];
				}
			},			async getDashboards(this: ILoadOptionsFunctions) {
				try {
					let authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Retornar mensagem indicando que o token é necessário
						return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					if (!groupId) {
						return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
					}
					
					// Remover o prefixo "Bearer" se já estiver presente no token
					if (authToken.trim().toLowerCase().startsWith('bearer ')) {
						authToken = authToken.trim().substring(7);
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getDashboards.call(this, groupId, authHeader);
				} catch (error) {
					return [{ name: 'Erro ao carregar dashboards. Verifique o token.', value: '' }];
				}
			},			async getDatasets(this: ILoadOptionsFunctions) {
				try {
					const authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Retornar mensagem indicando que o token é necessário
						return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					if (!groupId) {
						return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getDatasets.call(this, groupId, authHeader);
				} catch (error) {
					return [{ name: 'Erro ao carregar datasets. Verifique o token.', value: '' }];
				}
			},			async getTables(this: ILoadOptionsFunctions) {
				try {
					const authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Retornar mensagem indicando que o token é necessário
						return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					const datasetId = this.getNodeParameter('datasetId', '') as string;
					if (!datasetId) {
						return [{ name: '-- Selecione um dataset primeiro --', value: '' }];
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getTables.call(this, groupId, datasetId, authHeader);
				} catch (error) {
					return [{ name: 'Erro ao carregar tabelas. Verifique o token.', value: '' }];
				}
			},			async getReports(this: ILoadOptionsFunctions) {
				try {
					let authToken = this.getNodeParameter('authToken', '') as string;
					if (!authToken) {
						// Retornar mensagem indicando que o token é necessário
						return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
					}
					
					const groupId = this.getNodeParameter('groupId', '') as string;
					if (!groupId) {
						return [{ name: '-- Selecione um workspace primeiro --', value: '' }];
					}
					
					// Remover o prefixo "Bearer" se já estiver presente no token
					if (authToken.trim().toLowerCase().startsWith('bearer ')) {
						authToken = authToken.trim().substring(7);
					}
					
					const authHeader = { 
						Authorization: `Bearer ${authToken}`
					};
					
					return await getReports.call(this, groupId, authHeader);
				} catch (error) {
					return [{ name: 'Erro ao carregar relatórios. Verifique o token.', value: '' }];
				}
			},
		},
	};	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		// Verificar se é uma das operações que não precisam de autenticação
		const isGenerateAuthUrlOperation = (resource === 'admin' && operation === 'generateAuthUrl');
		const isGetTokenOperation = (resource === 'admin' && operation === 'getToken');
		const isRefreshTokenOperation = (resource === 'admin' && operation === 'refreshToken');
		const isAuthExemptOperation = isGenerateAuthUrlOperation || isGetTokenOperation || isRefreshTokenOperation;
		
		// Obter o token do parâmetro de entrada (ou do valor padrão no nó) apenas se não for uma operação isenta de autenticação
		let authToken = '';
		if (!isAuthExemptOperation) {			try {
				// Primeiro tenta pegar do parâmetro de entrada
				if (items[0]?.json?.access_token) {
					authToken = items[0].json.access_token as string;
				} else {
					// Se não encontrar na entrada, pega do parâmetro do nó
					authToken = this.getNodeParameter('authToken', 0) as string;
				}
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Falha ao obter token de autenticação');
			}
			
			if (!authToken) {
				throw new NodeOperationError(
					this.getNode(),
					'Token de autenticação é obrigatório. Forneça um token na entrada ou no parâmetro do nó.'
				);
			}
		}
				// Prepare the authorization header		// Configurar cabeçalhos de autorização apenas se não for uma operação isenta de autenticação
		const headers: IDataObject = {};
		
		if (!isAuthExemptOperation) {
			// Remover o prefixo "Bearer" se já estiver presente no token
			if (authToken.trim().toLowerCase().startsWith('bearer ')) {
				authToken = authToken.trim().substring(7);
			}
			
			headers.Authorization = `Bearer ${authToken}`;
		}
		
		// Process operations similar to the original PowerBI node
		// but use powerBiApiRequestWithHeaders instead
		
		for (let i = 0; i < items.length; i++) {
			try {                // Implementação de casos para cada recurso
                if (resource === 'dashboard') {
                    // Dashboard operations - usando os recursos modularizados
                    if (operation in resources.dashboard) {
                        // Execute a operação correspondente
                        const results = await resources.dashboard[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Importante: marcar responseData como null para evitar processamento adicional
                        responseData = null;
                    }
                } else if (resource === 'dataset') {
                    // Dataset operations - usando os recursos modularizados
                    if (operation in resources.dataset) {
                        // Execute a operação correspondente
                        const results = await resources.dataset[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Importante: marcar responseData como null para evitar processamento adicional
                        responseData = null;
                    }
                } else if (resource === 'group') {
                    // Group operations - usando recursos modularizados
                    if (operation in resources.group) {
                        // Execute a operação correspondente
                        const results = await resources.group[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Importante: marcar responseData como null para evitar processamento adicional
                        responseData = null;
                    }
                } else if (resource === 'report') {
                    // Report operations - usando recursos modularizados
                    if (operation in resources.report) {
                        // Execute a operação correspondente
                        const results = await resources.report[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Importante: marcar responseData como null para evitar processamento adicional
                        responseData = null;
                    }
                } else if (resource === 'admin') {
                    // Admin operations - usando os recursos modularizados
                    if (operation in resources.admin) {
                        // Execute a operação correspondente
                        const results = await resources.admin[operation].call(this, i);
                        returnData.push(...results);
                        
                        // Importante: marcar responseData como null para evitar processamento adicional
                        responseData = null;
                    }
                }				// Se responseData for null aqui, significa que já foi processado (especialmente para grupos)
				// Isso acontece porque adicionamos os itens diretamente a returnData acima
				if (responseData === null) {
					continue;
				}
				
				// Se responseData for undefined, crie um objeto vazio para evitar erros
				if (responseData === undefined) {
					responseData = {};
				}
						try {
					// Processar no padrão normal para outras operações
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} catch (processingError) {
					// Fallback para garantir que algo seja retornado
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: 'Erro ao processar resultados', details: String(processingError) }),
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