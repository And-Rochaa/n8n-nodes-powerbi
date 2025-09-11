import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets a specific dashboard by ID
 */
export async function get(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const dashboardId = this.getNodeParameter('dashboardId', i) as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/dashboards/${dashboardId}` : `/dashboards/${dashboardId}`;
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
