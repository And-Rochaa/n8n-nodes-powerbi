import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets a specific report by ID
 */
export async function get(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const reportId = this.getNodeParameter('reportId', i) as string;
	
	// Build endpoint based on selected group
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports/${reportId}` : `/reports/${reportId}`;
	
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
