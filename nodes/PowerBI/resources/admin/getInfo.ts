import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
	NodeOperationError,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Executes the getInfo operation to retrieve detailed information about workspaces
 */
export async function getInfo(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Get selected workspaces
	const workspaces = this.getNodeParameter('workspaces', i) as string[];
	
	// Check if workspaces were selected
	if (!workspaces || workspaces.length === 0) {
		throw new NodeOperationError(this.getNode(), 'You must select at least one workspace');
	}
	
	// Get options
	const datasetSchema = this.getNodeParameter('datasetSchema', i) as boolean;
	const datasetExpressions = this.getNodeParameter('datasetExpressions', i) as boolean;
	const lineage = this.getNodeParameter('lineage', i) as boolean;
	const datasourceDetails = this.getNodeParameter('datasourceDetails', i) as boolean;
	const getArtifactUsers = false; // Optional, not implemented in the interface yet
	
	// Build URL with query parameters as specified in the documentation
	const queryString = [
		`datasetSchema=${datasetSchema ? 'True' : 'False'}`,
		`datasetExpressions=${datasetExpressions ? 'True' : 'False'}`,
		`lineage=${lineage ? 'True' : 'False'}`,
		`datasourceDetails=${datasourceDetails ? 'True' : 'False'}`,
	].join('&');
	
	// Set up request body with the list of workspace IDs
	const requestBody = { workspaces };
	
	// Make the request to the admin endpoint using powerBiApiRequest
	// This respects the user's authentication choice (OAuth2 or Bearer Token)
	const responseData = await powerBiApiRequest.call(
		this,
		'POST',
		`/admin/workspaces/getInfo?${queryString}`,
		requestBody
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
