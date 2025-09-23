import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Execute DAX queries on a dataset
 */
export async function executeQueries(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get parameters
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const datasetId = this.getNodeParameter('datasetId', i) as string;
	const daxQuery = this.getNodeParameter('daxQuery', i) as string;
	const includeNulls = this.getNodeParameter('includeNulls', i, false) as boolean;
	const impersonatedUserName = this.getNodeParameter('impersonatedUserName', i, '') as string;
	
	// Construct the endpoint based on whether a group ID is provided
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/datasets/${datasetId}/executeQueries` : `/datasets/${datasetId}/executeQueries`;
	
	// Build the request body
	const requestBody: any = {
		queries: [
			{
				query: daxQuery,
			},
		],
	};
	
	// Add optional serializer settings if includeNulls is specified
	if (includeNulls !== false) {
		requestBody.serializerSettings = {
			includeNulls: includeNulls,
		};
	}
	
	// Add optional impersonated user name if specified
	if (impersonatedUserName && impersonatedUserName.trim() !== '') {
		requestBody.impersonatedUserName = impersonatedUserName.trim();
	}
	
	// Make API call with specific error handling for DAX queries
	try {
		const responseData = await powerBiApiRequest.call(
			this,
			'POST',
			endpoint,
			requestBody,
		);
		
		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData),
			{ itemData: { item: i } }
		);
		returnData.push(...executionData);

		return returnData;
	} catch (error) {
		// Check for DAX-specific error messages in the exception
		if (error.message && error.message.includes('DAX')) {
			throw new NodeOperationError(
				this.getNode(), 
				`DAX query execution failed: ${error.message}`
			);
		}
		// Re-throw other errors
		throw error;
	}
}
