import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets dashboards from a specific group
 */
export async function getDashboards(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get group ID parameter
	const groupId = this.getNodeParameter('groupId', i) as string;
	
	// Make API request
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		`/groups/${groupId}/dashboards`,
	) as JsonObject;
	
	// Process the response data
	const dashboardItems = (responseData.value as IDataObject[] || []);
	for (const item of dashboardItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
