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
	// Build basic headers
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
		// Add additional headers, ensuring authorization is present
	if (headers && Object.keys(headers).length > 0) {
		Object.assign(httpRequestOptions.headers!, headers);
	}
	
	// Add additional options, such as encoding for binary files
	if (requestOptions && Object.keys(requestOptions).length > 0) {
		Object.assign(httpRequestOptions, requestOptions);
	}
	
	try {
		if (Object.keys(body).length === 0) {
			delete httpRequestOptions.body;
		}
		
		// Check if authorization header was provided
		if (!headers.Authorization && !httpRequestOptions.headers?.Authorization) {
			throw new NodeOperationError(
				this.getNode(), 
				'Authentication token required',
				{ description: 'Provide a valid authentication token to access the Power BI API' }
			);
		}
				// If token doesn't start with "Bearer ", add it
		if (httpRequestOptions.headers?.Authorization && typeof httpRequestOptions.headers.Authorization === 'string') {
			const authHeader = httpRequestOptions.headers.Authorization as string;
			if (!authHeader.trim().toLowerCase().startsWith('bearer ')) {
				httpRequestOptions.headers.Authorization = `Bearer ${authHeader}`;
			}
		}
				// Make direct HTTP request without using OAuth
		
		// If it's a request expecting a binary file (json: false)
		if (httpRequestOptions.json === false) {
			const response = await this.helpers.httpRequest({
				...httpRequestOptions,
				encoding: null
			});

			// For file downloads, returnFullResponse allows access to headers and body
			if (httpRequestOptions.returnFullResponse) {
				return response;
			}
			// Otherwise, return only the file content
			return response;
		} else {
			// For regular JSON requests
			const response = await this.helpers.httpRequest(httpRequestOptions);

			return response;
		}
		} catch (requestError: any) {		if (requestError.response) {
					// No need to convert 403 errors to 401 anymore
			// n8n now captures authentication errors before this conversion takes effect
			
			if (requestError.response.statusCode === 401) {
				throw new NodeOperationError(
					this.getNode(), 
					'Authentication failed. Check if the token is valid.',
					{ description: 'The provided token was not accepted by the Power BI API. Check if it is in the correct format and has not expired.' }
				);
			}
			
			if (requestError.response.statusCode === 403) {
				throw new NodeOperationError(
					this.getNode(), 
					'Access denied. Check token permissions.',
					{ description: 'The token does not have permission to access this Power BI API resource.' }
				);
			}
		}
		throw requestError;
	}
}

/**
 * Get all groups (workspaces)
 */
export async function getGroups(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	headers: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	try {
		// Verify and format authorization token
		if (headers.Authorization && typeof headers.Authorization === 'string') {
			const authHeader = headers.Authorization as string;
			// If token doesn't start with "Bearer ", add it
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
		return [{ name: '-- Error loading workspaces --', value: '' }];
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
 * Get groups formatted for multiselect
 */
export async function getGroupsMultiSelect(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	headers: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [
		{
			name: 'My Workspace',
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
 * Get dashboards from a group
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
 * Get datasets from a group
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
 * Get tables from a dataset
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
 * Get reports from a group
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
		// Get authentication token
		let authToken = this.getNodeParameter('authToken', 0) as string;
		
		// Remove "Bearer" prefix if already present in token
		if (authToken.trim().toLowerCase().startsWith('bearer ')) {
			authToken = authToken.trim().substring(7);
		}
		
		// Prepare authorization header
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
		// If unable to list gateways, return empty array
		// This can happen if the user doesn't have gateway administrator permission
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
			return [{ name: '-- Select a gateway first --', value: '' }];
		}
		
		// Get authentication token
		let authToken = this.getNodeParameter('authToken', '') as string;
		
		if (!authToken) {
			return [{ name: '-- Authentication token required --', value: '' }];
		}
		
		// Remove "Bearer" prefix if already present in token
		if (authToken.trim().toLowerCase().startsWith('bearer ')) {
			authToken = authToken.trim().substring(7);
		}
		
		// Prepare authorization header
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
		// If unable to list datasources, return empty array
		// This can happen if the user doesn't have gateway administrator permission
		return [{ name: 'Error loading data sources. Check permissions.', value: '' }];
	}
	
	return returnData;
}

/**
 * Get all dataflows for a specific group
 */
export async function getDataflows(this: ILoadOptionsFunctions, groupId: string, authHeader: IDataObject): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];

	if (!groupId) {
		return [{ name: 'Select a workspace first', value: '' }];
	}

	try {
		const responseData = await powerBiApiRequestWithHeaders.call(this, 'GET', `/groups/${groupId}/dataflows`, {}, {}, authHeader);
		
		if (responseData && responseData.value) {
			if (responseData.value.length === 0) {
				return [{ name: 'No dataflow found in this workspace', value: '' }];
			}
			
			for (const dataflow of responseData.value) {
				// Power BI API uses 'objectId' instead of 'id' for dataflows
				if (dataflow.name && dataflow.objectId) {
					returnData.push({
						name: dataflow.name,
						value: dataflow.objectId,
					});
				}
			}
		} else {
			return [{ name: 'API response does not contain dataflows', value: '' }];
		}
		
		if (returnData.length === 0) {
			return [{ name: 'No valid dataflow found', value: '' }];
		}
	} catch (error) {
		// If unable to list dataflows, return empty array
		return [{ name: `Error loading dataflows: ${error.message}`, value: '' }];
	}
	
	return returnData;
}