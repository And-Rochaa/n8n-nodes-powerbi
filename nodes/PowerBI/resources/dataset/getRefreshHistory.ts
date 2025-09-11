import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets the refresh history of a dataset
 */
export async function getRefreshHistory(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const top = this.getNodeParameter('top', i, undefined) as number | undefined;
	
	// Construct the query parameters if top is specified
	const queryParams: IDataObject = {};
	if (top !== undefined) {
		queryParams.$top = top;
	}
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
		{},
		queryParams,
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);

	return returnData;
}
