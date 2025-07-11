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
 * Make an API request to Power BI API
 */
/**
 * Get access token using ROPC authentication (Resource Owner Password Credentials)
 */
export async function getRopcAccessToken(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('powerBiApiOAuth2Api') as IDataObject;

	if (credentials.authType !== 'ropc') {
		throw new NodeOperationError(this.getNode(), 'Authentication method is not configured as ROPC');
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
	// Add client_secret only if provided (optional for public clients)
	if (credentials.ropcClientSecret) {
		(options.body as IDataObject).client_secret = credentials.ropcClientSecret as string;
	}

	try {
		const response = await this.helpers.request(options) as IDataObject;

		if (response.access_token) {
			return response.access_token as string;
		} else {
			throw new NodeOperationError(this.getNode(), 'Could not obtain access token', {
				description: JSON.stringify(response),
			});
		}
	} catch (error) {
		if (error.message && error.message.includes('AADSTS')) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Azure AD authentication error: ' + error.error_description || error.message,
				description: 'Check your credentials and permissions.',
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
	
	// Add additional options, such as encoding for binary files
	if (requestOptions && Object.keys(requestOptions).length > 0) {
		Object.assign(options, requestOptions);
	}
	
	try {
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		
		
		// If it is a request expecting a binary file (json: false)
		if (options.json === false) {
			const oauth2Options = {
				...options,
				resolveWithFullResponse: true,
				encoding: null,
			};
					// Using the requestOAuth2 method with specific options for binary data
			const response = await this.helpers.requestOAuth2.call(
				this,
				'powerBiApiOAuth2Api',
				oauth2Options,
				{ tokenType: 'Bearer', includeCredentialsOnRefreshOnBody: true }
			);
			

			
			// For file downloads, returnFullResponse allows access to headers
			if (requestOptions.returnFullResponse) {
				return response;
			}
			
			// Otherwise, return only the file content
			return response.body || response;		} else {			// For regular JSON requests
			const response = await this.helpers.requestOAuth2.call(
				this,
				'powerBiApiOAuth2Api',
				options,
				{ tokenType: 'Bearer', includeCredentialsOnRefreshOnBody: true }
			);
			return response as JsonObject;
		}
	} catch (error) {
		// No need to convert 403 errors to 401 anymore
		// n8n now captures authentication errors before this conversion takes effect
		
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
		name: 'My Workspace',
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
		return [{ name: 'Select a group first', value: '' }];
	}
	
	if (!groupId) {
		return [{ name: 'Select a group first', value: '' }];
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
		return [{ name: 'Select a group and dataset first', value: '' }];
	}
	
	if (!groupId || !datasetId) {
		return [{ name: 'Select a group and dataset first', value: '' }];
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
		return [{ name: 'Select a group first', value: '' }];
	}
	
	if (!groupId) {
		return [{ name: 'Select a group first', value: '' }];
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
		return [{ name: 'Select a group first', value: '' }];
	}
	
	if (!groupId) {
		return [{ name: 'Select a group first', value: '' }];
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

/**
 * Get all gateways accessible to the user
 */
export async function getGateways(this: ILoadOptionsFunctions) {
	const returnData: IDataObject[] = [];
	
	try {
		const responseData = await powerBiApiRequest.call(this, 'GET', '/gateways', {}, {});
		
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
		
		const responseData = await powerBiApiRequest.call(this, 'GET', `/gateways/${gatewayId}/datasources`, {}, {});
		
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
export async function getDataflows(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const groupId = this.getCurrentNodeParameter('groupId') as string;
	const returnData: INodePropertyOptions[] = [];

	if (!groupId) {
		return [{ name: 'Select a workspace first', value: '' }];
	}

	try {
		const responseData = await powerBiApiRequest.call(this, 'GET', `/groups/${groupId}/dataflows`);
		
		if (responseData && responseData.value) {
			if (responseData.value.length === 0) {
				return [{ name: 'No dataflow found in this workspace', value: '' }];
			}
			
			for (const dataflow of responseData.value) {
				// The Power BI API uses 'objectId' instead of 'id' for dataflows
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