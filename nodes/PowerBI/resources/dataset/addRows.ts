import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Adds rows to a table in a dataset
 */
export async function addRows(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const tableName = this.getNodeParameter('tableName', i) as string;
	const data = this.getNodeParameter('data', i) as string;
	
	let rows;
	try {
		rows = JSON.parse(data);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), `Could not parse rows JSON: ${error}`);
	}
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows` : `/datasets/${datasetId}/tables/${tableName}/rows`;
	
	// Make API call
	await powerBiApiRequest.call(
		this,
		'POST',
		endpoint,
		{
			rows,
		},
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray({ success: true, message: 'Rows added successfully' }),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);

	return returnData;
}
