import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	NodeApiError,
	NodeOperationError,
	IHttpRequestOptions,
	JsonObject,
	IHttpRequestMethods,
	INodePropertyOptions,
} from 'n8n-workflow';

/**
 * Make an API request to Power BI API using header authentication
 */
export async function powerBiApiRequestWithHeaders(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	headers: IDataObject = {},
	requestOptions: IDataObject = {},
): Promise<JsonObject | Buffer | string> {
	// Construa os headers básicos
	const httpRequestOptions: IHttpRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
		},
		method: method as IHttpRequestMethods,
		body,
		qs,
		url: `https://api.powerbi.com/v1.0/myorg${endpoint}`,
		json: true,
	};
		// Adiciona os headers adicionais, garantindo que a autorização esteja presente
	if (headers && Object.keys(headers).length > 0) {
		Object.assign(httpRequestOptions.headers!, headers);
	}
	
	// Adiciona opções adicionais, como encoding para arquivos binários
	if (requestOptions && Object.keys(requestOptions).length > 0) {
		Object.assign(httpRequestOptions, requestOptions);
	}
	
	try {
		if (Object.keys(body).length === 0) {
			delete httpRequestOptions.body;
		}
		
		// Verifica se o header de autorização foi fornecido
		if (!headers.Authorization && !httpRequestOptions.headers?.Authorization) {
			throw new NodeOperationError(
				this.getNode(), 
				'Token de autenticação obrigatório',
				{ description: 'Forneça um token de autenticação válido para acessar a API do Power BI' }
			);
		}
				// Se o token não começar com "Bearer ", adicione-o
		if (httpRequestOptions.headers?.Authorization && typeof httpRequestOptions.headers.Authorization === 'string') {
			const authHeader = httpRequestOptions.headers.Authorization as string;
			if (!authHeader.trim().toLowerCase().startsWith('bearer ')) {
				httpRequestOptions.headers.Authorization = `Bearer ${authHeader}`;
			}
		}
				// Faz a requisição HTTP direta sem usar OAuth
		
		// Se for uma solicitação que espera um arquivo binário (json: false)
		if (httpRequestOptions.json === false) {
			const response = await this.helpers.request!({
				...httpRequestOptions,
				resolveWithFullResponse: true,
				encoding: null
			});

			// Para downloads de arquivos, returnFullResponse permite acesso aos headers e ao corpo
			if (httpRequestOptions.returnFullResponse) {
				return response;
			}
			// Caso contrário, retornar apenas o conteúdo do arquivo
			return response.body;
		} else {
			// Para solicitações JSON regulares
			const response = await this.helpers.request(httpRequestOptions);

			return response;
		}
		} catch (requestError: any) {		if (requestError.response) {
					// Não é mais necessário converter erros 403 para 401
			// O n8n agora captura os erros de autenticação antes que esta conversão seja efetiva
			
			if (requestError.response.statusCode === 401) {
				throw new NodeOperationError(
					this.getNode(), 
					'Falha na autenticação. Verifique se o token é válido.',
					{ description: 'O token fornecido não foi aceito pela API do Power BI. Verifique se está no formato correto e não expirou.' }
				);
			}
			
			if (requestError.response.statusCode === 403) {
				throw new NodeOperationError(
					this.getNode(), 
					'Acesso negado. Verifique as permissões do token.',
					{ description: 'O token não tem permissão para acessar este recurso da API do Power BI.' }
				);
			}
		}
		throw requestError;
	}
}

/**
 * Obter todos os grupos (workspaces)
 */
export async function getGroups(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	headers: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	try {
		// Verifica e formata o token de autorização
		if (headers.Authorization && typeof headers.Authorization === 'string') {
			const authHeader = headers.Authorization as string;
			// Se o token não começar com "Bearer ", adicione-o
			if (!authHeader.trim().toLowerCase().startsWith('bearer ')) {
				headers.Authorization = `Bearer ${authHeader}`;
			}
		}
		
		const groups = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			'/groups',
			{},
			{},
			headers,
		);



		if (groups.value && Array.isArray(groups.value)) {
			for (const group of groups.value as IDataObject[]) {
				returnData.push({
					name: group.name as string,
					value: group.id as string,
				});
			}
		}	} catch (error) {
		return [{ name: '-- Erro ao carregar workspaces --', value: '' }];
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

/**
 * Obter grupos formatados para multiselect
 */
export async function getGroupsMultiSelect(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	headers: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [
		{
			name: 'Meu Workspace',
			value: 'me',
		},
	];

	const groups = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		'/groups',
		{},
		{},
		headers,
	);

	if (groups.value) {
		for (const group of groups.value as IDataObject[]) {
			returnData.push({
				name: group.name as string,
				value: group.id as string,
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

/**
 * Obter dashboards de um grupo
 */
export async function getDashboards(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	groupId: string,
	headers: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	
	let endpoint = '';
	if (groupId === 'me') {
		endpoint = '/dashboards';
	} else {
		endpoint = `/groups/${groupId}/dashboards`;
	}

	const dashboards = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		endpoint,
		{},
		{},
		headers,
	);

	if (dashboards.value) {
		for (const dashboard of dashboards.value as IDataObject[]) {
			returnData.push({
				name: dashboard.displayName as string,
				value: dashboard.id as string,
			});
		}
	}

	return returnData;
}

/**
 * Obter datasets de um grupo
 */
export async function getDatasets(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	groupId: string,
	headers: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let endpoint = '';
	if (groupId === 'me') {
		endpoint = '/datasets';
	} else {
		endpoint = `/groups/${groupId}/datasets`;
	}

	const datasets = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		endpoint,
		{},
		{},
		headers,
	);

	if (datasets.value) {
		for (const dataset of datasets.value as IDataObject[]) {
			returnData.push({
				name: dataset.name as string,
				value: dataset.id as string,
			});
		}
	}

	return returnData;
}

/**
 * Obter tabelas de um dataset
 */
export async function getTables(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	groupId: string,
	datasetId: string,
	headers: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let endpoint = '';
	if (groupId === 'me') {
		endpoint = `/datasets/${datasetId}/tables`;
	} else {
		endpoint = `/groups/${groupId}/datasets/${datasetId}/tables`;
	}

	const tables = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		endpoint,
		{},
		{},
		headers,
	);

	if (tables.value) {
		for (const table of tables.value as IDataObject[]) {
			returnData.push({
				name: table.name as string,
				value: table.name as string,
			});
		}
	}

	return returnData;
}

/**
 * Obter relatórios de um grupo
 */
export async function getReports(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	groupId: string,
	headers: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let endpoint = '';
	if (groupId === 'me') {
		endpoint = '/reports';
	} else {
		endpoint = `/groups/${groupId}/reports`;
	}

	const reports = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		endpoint,
		{},
		{},
		headers,
	);

	if (reports.value) {
		for (const report of reports.value as IDataObject[]) {
			returnData.push({
				name: report.name as string,
				value: report.id as string,
			});
		}
	}

	return returnData;
}

/**
 * Get all gateways accessible to the user
 */
export async function getGateways(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	try {
		// Obter token de autenticação
		let authToken = this.getNodeParameter('authToken', 0) as string;
		
		// Remover o prefixo "Bearer" se já estiver presente no token
		if (authToken.trim().toLowerCase().startsWith('bearer ')) {
			authToken = authToken.trim().substring(7);
		}
		
		// Preparar o header de autorização
		const headers: IDataObject = {
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
	} catch (error) {
		// Se não conseguir listar gateways, retorna array vazio
		// Isso pode acontecer se o usuário não tiver permissão de administrador de gateway
	}
	
	return returnData;
}

/**
 * Get all datasources for a specific gateway
 */
export async function getDatasources(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	try {
		const gatewayId = this.getNodeParameter('gatewayId', '') as string;
		
		if (!gatewayId) {
			return [{ name: '-- Selecione um gateway primeiro --', value: '' }];
		}
		
		// Obter token de autenticação
		let authToken = this.getNodeParameter('authToken', '') as string;
		
		if (!authToken) {
			return [{ name: '-- Token de autenticação obrigatório --', value: '' }];
		}
		
		// Remover o prefixo "Bearer" se já estiver presente no token
		if (authToken.trim().toLowerCase().startsWith('bearer ')) {
			authToken = authToken.trim().substring(7);
		}
		
		// Preparar o header de autorização
		const headers: IDataObject = {
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
	} catch (error) {
		// Se não conseguir listar datasources, retorna array vazio
		// Isso pode acontecer se o usuário não tiver permissão de administrador de gateway
		return [{ name: 'Erro ao carregar fontes de dados. Verifique as permissões.', value: '' }];
	}
	
	return returnData;
}

/**
 * Get all dataflows for a specific group
 */
export async function getDataflows(this: ILoadOptionsFunctions, groupId: string, authHeader: IDataObject): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];

	if (!groupId) {
		return [{ name: 'Selecione um workspace primeiro', value: '' }];
	}

	try {
		const responseData = await powerBiApiRequestWithHeaders.call(this, 'GET', `/groups/${groupId}/dataflows`, {}, {}, authHeader);
		
		if (responseData && responseData.value) {
			if (responseData.value.length === 0) {
				return [{ name: 'Nenhum dataflow encontrado neste workspace', value: '' }];
			}
			
			for (const dataflow of responseData.value) {
				// A API do Power BI usa 'objectId' em vez de 'id' para dataflows
				if (dataflow.name && dataflow.objectId) {
					returnData.push({
						name: dataflow.name,
						value: dataflow.objectId,
					});
				}
			}
		} else {
			return [{ name: 'Resposta da API não contém dataflows', value: '' }];
		}
		
		if (returnData.length === 0) {
			return [{ name: 'Nenhum dataflow válido encontrado', value: '' }];
		}
	} catch (error) {
		// Se não conseguir listar dataflows, retorna array vazio
		return [{ name: `Erro ao carregar fluxos de dados: ${error.message}`, value: '' }];
	}
	
	return returnData;
}