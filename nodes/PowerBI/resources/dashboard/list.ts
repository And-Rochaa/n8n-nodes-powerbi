import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Lists all available dashboards
 */
export async function list(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get grupo (workspace) ID if provided
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/dashboards` : '/dashboards';
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	) as JsonObject;
	
	// Process the response data
	const dashboardItems = (responseData.value as IDataObject[] || []);
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(dashboardItems),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
