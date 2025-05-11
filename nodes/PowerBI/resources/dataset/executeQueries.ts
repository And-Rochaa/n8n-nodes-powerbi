import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Execute consultas DAX em um dataset
 */
export async function executeQueries(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const daxQuery = this.getNodeParameter('daxQuery', i) as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/executeQueries` : `/datasets/${datasetId}/executeQueries`;
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'POST',
		endpoint,
		{
			queries: [
				{
					query: daxQuery,
				},
			],
		},
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
