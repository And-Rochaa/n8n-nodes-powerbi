import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Lists all datasets
 */
export async function list(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get grupo (workspace) ID if provided
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets` : '/datasets';
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	) as JsonObject;
	
	// Process the response data
	const datasetItems = (responseData.value as IDataObject[] || []);
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(datasetItems),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
