import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets datasets from a specific group
 */
export async function getDatasets(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get group ID parameter
	const groupId = this.getNodeParameter('groupId', i) as string;
	
	// Make request to the API
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		`/groups/${groupId}/datasets`,
	) as JsonObject;
	
	// Process the response data
	const datasetItems = (responseData.value as IDataObject[] || []);
	for (const item of datasetItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
