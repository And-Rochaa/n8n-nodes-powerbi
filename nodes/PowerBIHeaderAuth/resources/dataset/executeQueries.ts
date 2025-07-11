import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Executes DAX queries on a dataset
 */
export async function executeQueries(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get authentication token
	let authToken = this.getNodeParameter('authToken', i) as string;
	
	// Remove the "Bearer" prefix if already present in the token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}
	
	// Prepare the authorization header
	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};
	
	// Get parameters
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const daxQuery = this.getNodeParameter('daxQuery', i) as string;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const includeNulls = this.getNodeParameter('includeNulls', i, false) as boolean;
	const impersonatedUserName = this.getNodeParameter('impersonatedUserName', i, '') as string;
	
	// Build endpoint based on selected group
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/executeQueries` : `/datasets/${datasetId}/executeQueries`;
	
	// Build the request body
	const requestBody: any = {
		queries: [
			{
				query: daxQuery,
			},
		],
	};
	
	// Add optional serializer settings if includeNulls is specified
	if (includeNulls !== false) {
		requestBody.serializerSettings = {
			includeNulls: includeNulls,
		};
	}
	
	// Add optional impersonated user name if specified
	if (impersonatedUserName && impersonatedUserName.trim() !== '') {
		requestBody.impersonatedUserName = impersonatedUserName.trim();
	}
	
	// Make request to the API
	const responseData = await powerBiApiRequestWithHeaders.call(
		this,
		'POST',
		endpoint,
		requestBody,
		{},
		headers,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
