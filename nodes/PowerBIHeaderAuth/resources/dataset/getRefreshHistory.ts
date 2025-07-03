import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Gets the refresh history of a dataset
 */
export async function getRefreshHistory(
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
	const top = this.getNodeParameter('top', i, undefined) as number | undefined;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Build query parameters if top is specified
	const queryParams: IDataObject = {};
	if (top !== undefined) {
		queryParams.$top = top;
	}
	
	// Build endpoint based on selected group
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
	
	// Make request to the API
	const responseData = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		endpoint,
		{},
		queryParams,
		headers,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
