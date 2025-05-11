import {
	IExecuteFunctions,
	INodeExecutionData,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Obtém um dataset específico pelo ID
 */
export async function get(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}` : `/datasets/${datasetId}`;
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
