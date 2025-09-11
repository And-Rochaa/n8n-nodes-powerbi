import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Lists all reports
 */
export async function list(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get group (workspace) ID if provided
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Build the endpoint based on the provided group ID
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports` : '/reports';
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
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
