import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets the tiles of a specific dashboard
 */
export async function getTiles(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const dashboardId = this.getNodeParameter('dashboardId', i) as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/dashboards/${dashboardId}/tiles` : `/dashboards/${dashboardId}/tiles`;
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	) as JsonObject;
	
	// Process the response data
	const tileItems = (responseData.value as IDataObject[] || []);
	for (const item of tileItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
