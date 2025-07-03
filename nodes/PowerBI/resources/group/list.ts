import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Lists all groups (workspaces)
 */
export async function list(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Make request to the API
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		'/groups',
	) as JsonObject;
	
	// Process the response data
	const groupItems = (responseData.value as IDataObject[] || []);
	for (const item of groupItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
