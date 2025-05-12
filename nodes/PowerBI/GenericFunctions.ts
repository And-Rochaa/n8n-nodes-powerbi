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
} from 'n8n-workflow';

/**
 * Make an API request to Power BI API
 */
/**
 * Obter token de acesso usando autenticação ROPC (Resource Owner Password Credentials)
 */
export async function getRopcAccessToken(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('powerBI') as IDataObject;

	if (credentials.authType !== 'ropc') {
		throw new NodeOperationError(this.getNode(), 'O método de autenticação não está configurado como ROPC');
	}

	const options: IHttpRequestOptions = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		method: 'POST',
		body: {
			grant_type: 'password',
			resource: 'https://analysis.windows.net/powerbi/api',
			client_id: credentials.ropcClientId as string,
			username: credentials.username as string,
			password: credentials.password as string,
		},
		url: 'https://login.microsoftonline.com/common/oauth2/token',
		json: true,
	};
	// Adicionar client_secret apenas se fornecido (opcional para aplicativos públicos)
	if (credentials.ropcClientSecret) {
		(options.body as IDataObject).client_secret = credentials.ropcClientSecret as string;
	}

	try {
		const response = await this.helpers.request(options) as IDataObject;

		if (response.access_token) {
			return response.access_token as string;
		} else {
			throw new NodeOperationError(this.getNode(), 'Não foi possível obter o token de acesso', {
				description: JSON.stringify(response),
			});
		}
	} catch (error) {
		if (error.message && error.message.includes('AADSTS')) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Erro na autenticação do Azure AD: ' + error.error_description || error.message,
				description: 'Verifique suas credenciais e permissões.',
			});
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function powerBiApiRequest(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	requestOptions: IDataObject = {},
): Promise<JsonObject | Buffer | string> {
	const options: IHttpRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
		},
		method: method as IHttpRequestMethods,
		body,
		qs,
		url: `https://api.powerbi.com/v1.0/myorg${endpoint}`,
		json: true,
	};
	
	// Adiciona opções adicionais, como encoding para arquivos binários
	if (requestOptions && Object.keys(requestOptions).length > 0) {
		Object.assign(options, requestOptions);
	}
	
	try {
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		
		
		// Se for uma solicitação que espera um arquivo binário (json: false)
		if (options.json === false) {
			const oauth2Options = {
				...options,
				resolveWithFullResponse: true,
				encoding: null,
			};
					// Utilizando o método requestOAuth2 com opções específicas para binário
			const response = await this.helpers.requestOAuth2.call(
				this,
				'powerBI',
				oauth2Options,
				{ tokenType: 'Bearer', includeCredentialsOnRefreshOnBody: true }
			);
			

			
			// Para downloads de arquivos, returnFullResponse permite acesso aos headers
			if (requestOptions.returnFullResponse) {
				return response;
			}
			
			// Caso contrário, retornar apenas o conteúdo do arquivo
			return response.body || response;		} else {			// Para solicitações JSON regulares
			const response = await this.helpers.requestOAuth2.call(
				this,
				'powerBI',
				options,
				{ tokenType: 'Bearer', includeCredentialsOnRefreshOnBody: true }
			);
			return response as JsonObject;
		}
	} catch (error) {
		// Não é mais necessário converter erros 403 para 401
		// O n8n agora captura os erros de autenticação antes que esta conversão seja efetiva
		
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to paginated Power BI API endpoints
 */
export async function powerBiApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.top = 100;

	do {
		responseData = await powerBiApiRequest.call(this, method, endpoint, body, query);
		returnData.push.apply(returnData, responseData[propertyName] as IDataObject[]);
		if (responseData.nextLink) {
			// Extract the skiptoken from the nextLink URL
			const skipTokenMatch = (responseData.nextLink as string).match(/\$skiptoken=([^&]+)/);
			if (skipTokenMatch && skipTokenMatch[1]) {
				query.skiptoken = skipTokenMatch[1];
			}
		}
	} while (responseData.nextLink);

	return returnData;
}

/**
 * Load all groups (workspaces) from Power BI
 */
export async function getGroups(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	const groups = await powerBiApiRequestAllItems.call(
		this,
		'value',
		'GET',
		'/groups',
		{},
	);
	
	// Add "My Workspace" as an option
	returnData.push({
		name: 'Meu Workspace',
		value: 'me',
	});
	
	// Add all other workspaces
	for (const group of groups) {
		if (group.name && group.id) {
			returnData.push({
				name: group.name as string,
				value: group.id as string,
			});
		}
	}
	
	return returnData;
}

/**
 * Load all groups (workspaces) for multi-selection in Admin operations
 */
export async function getGroupsMultiSelect(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	const groups = await powerBiApiRequestAllItems.call(
		this,
		'value',
		'GET',
		'/groups',
		{},
	);
	
	// Add all workspaces
	for (const group of groups) {
		if (group.name && group.id) {
			returnData.push({
				name: group.name as string,
				value: group.id as string,
			});
		}
	}
	
	return returnData;
}

/**
 * Load all datasets based on the selected group
 */
export async function getDatasets(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	let groupId;
	try {
		groupId = this.getNodeParameter('groupId', 0) as string;
	} catch (error) {
		return [{ name: 'Selecione um grupo primeiro', value: '' }];
	}
	
	if (!groupId) {
		return [{ name: 'Selecione um grupo primeiro', value: '' }];
	}
	
	let endpoint = '/datasets';
	if (groupId && groupId !== 'me') {
		endpoint = `/groups/${groupId}/datasets`;
	}
	
	const datasets = await powerBiApiRequestAllItems.call(
		this,
		'value',
		'GET',
		endpoint,
		{},
	);
	
	for (const dataset of datasets) {
		if (dataset.name && dataset.id) {
			returnData.push({
				name: dataset.name as string,
				value: dataset.id as string,
			});
		}
	}
	
	return returnData;
}

/**
 * Load all tables based on the selected dataset
 */
export async function getTables(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	let groupId, datasetId;
	try {
		groupId = this.getNodeParameter('groupId', 0) as string;
		datasetId = this.getNodeParameter('datasetId', 0) as string;
	} catch (error) {
		return [{ name: 'Selecione um grupo e dataset primeiro', value: '' }];
	}
	
	if (!groupId || !datasetId) {
		return [{ name: 'Selecione um grupo e dataset primeiro', value: '' }];
	}
	
	let endpoint = `/datasets/${datasetId}/tables`;
	if (groupId && groupId !== 'me') {
		endpoint = `/groups/${groupId}/datasets/${datasetId}/tables`;
	}
	
	const tables = await powerBiApiRequestAllItems.call(
		this,
		'value',
		'GET',
		endpoint,
		{},
	);
	
	for (const table of tables) {
		if (table.name) {
			returnData.push({
				name: table.name as string,
				value: table.name as string,
			});
		}
	}
	
	return returnData;
}

/**
 * Load all reports based on the selected group
 */
export async function getReports(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	let groupId;
	try {
		groupId = this.getNodeParameter('groupId', 0) as string;
	} catch (error) {
		return [{ name: 'Selecione um grupo primeiro', value: '' }];
	}
	
	if (!groupId) {
		return [{ name: 'Selecione um grupo primeiro', value: '' }];
	}
	
	let endpoint = '/reports';
	if (groupId && groupId !== 'me') {
		endpoint = `/groups/${groupId}/reports`;
	}
	
	const reports = await powerBiApiRequestAllItems.call(
		this,
		'value',
		'GET',
		endpoint,
		{},
	);
	
	for (const report of reports) {
		if (report.name && report.id) {
			returnData.push({
				name: report.name as string,
				value: report.id as string,
			});
		}
	}
	
	return returnData;
}

/**
 * Load all dashboards based on the selected group
 */
export async function getDashboards(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	let groupId;
	try {
		groupId = this.getNodeParameter('groupId', 0) as string;
	} catch (error) {
		return [{ name: 'Selecione um grupo primeiro', value: '' }];
	}
	
	if (!groupId) {
		return [{ name: 'Selecione um grupo primeiro', value: '' }];
	}
	
	let endpoint = '/dashboards';
	if (groupId && groupId !== 'me') {
		endpoint = `/groups/${groupId}/dashboards`;
	}
	
	const dashboards = await powerBiApiRequestAllItems.call(
		this,
		'value',
		'GET',
		endpoint,
		{},
	);
	
	for (const dashboard of dashboards) {
		if (dashboard.displayName && dashboard.id) {
			returnData.push({
				name: dashboard.displayName as string,
				value: dashboard.id as string,
			});
		}
	}
	
	return returnData;
}