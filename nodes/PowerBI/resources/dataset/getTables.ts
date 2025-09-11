import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets the tables of a specific dataset
 */
export async function getTables(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/tables` : `/datasets/${datasetId}/tables`;
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	) as JsonObject;
	
	// Process the response data
	const tableItems = (responseData.value as IDataObject[] || []);
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(tableItems),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
