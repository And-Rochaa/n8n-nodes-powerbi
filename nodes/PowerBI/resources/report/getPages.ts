import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Gets the pages of a specific report
 */
export async function getPages(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const reportId = this.getNodeParameter('reportId', i) as string;
	
	// Build endpoint based on the selected group
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports/${reportId}/pages` : `/reports/${reportId}/pages`;
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	) as JsonObject;
	
	// Process the response data
	const pageItems = (responseData.value as IDataObject[] || []);
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(pageItems),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
