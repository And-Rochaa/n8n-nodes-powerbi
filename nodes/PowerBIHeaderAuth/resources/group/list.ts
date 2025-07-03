import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Lists all available groups/workspaces
 */
export async function list(
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
	
	// Make request to the API
	const responseData = await powerBiApiRequestWithHeaders.call(
		this,
		'GET',
		'/groups',
		{},
		{},
		headers,
	) as JsonObject;
	
	// Process response data
	const groupItems = (responseData.value as IDataObject[] || []);
	for (const item of groupItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
