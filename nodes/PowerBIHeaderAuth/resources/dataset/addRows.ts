import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

/**
 * Adds rows to a table in a dataset
 */
export async function addRows(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get authentication token
	let authToken = this.getNodeParameter('authToken', i) as string;
	
	// Remove the "Bearer" prefix if already present in the token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}
	
	// Prepare the authorization header
	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};
	
	// Get parameters
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const tableName = this.getNodeParameter('tableName', i) as string;
	const data = this.getNodeParameter('data', i) as string;
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	let rows;
	try {
		rows = JSON.parse(data);
	} catch (error) {
		throw new Error(`Unable to parse JSON rows: ${error}`);
	}
	
	// Build endpoint based on selected group
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows` : `/datasets/${datasetId}/tables/${tableName}/rows`;
	
	// Make request to the API
	await powerBiApiRequestWithHeaders.call(
		this,
		'POST',
		endpoint,
		{
			rows,
		},
		{},
		headers,
	);
	
	returnData.push({
		json: { success: true, message: 'Rows added successfully' },
	});
	
	return returnData;
}
