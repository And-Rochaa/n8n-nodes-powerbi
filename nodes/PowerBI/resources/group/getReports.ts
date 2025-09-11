import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Retrieves reports from a specific group
 */
export async function getReports(
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
		`/groups/${groupId}/reports`,
	) as JsonObject;
	
	// Process the response data
	const reportItems = (responseData.value as IDataObject[] || []);
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(reportItems),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
