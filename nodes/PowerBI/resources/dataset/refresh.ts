import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Refreshes a specific dataset
 */
export async function refresh(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
	
	// Make API call
	await powerBiApiRequest.call(
		this,
		'POST',
		endpoint,
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray({ success: true, message: 'Refresh started successfully' }),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
