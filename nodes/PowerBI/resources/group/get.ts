import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets a specific group by ID
 */
export async function get(
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
		`/groups/${groupId}`,
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
