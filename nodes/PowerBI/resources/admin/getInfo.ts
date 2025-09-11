import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

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
		throw new Error('You must select at least one workspace');
	}
	
	// Get options
	const datasetSchema = this.getNodeParameter('datasetSchema', i) as boolean;
	const datasetExpressions = this.getNodeParameter('datasetExpressions', i) as boolean;
	const lineage = this.getNodeParameter('lineage', i) as boolean;
	const datasourceDetails = this.getNodeParameter('datasourceDetails', i) as boolean;
	const getArtifactUsers = false; // Optional, not implemented in the interface yet
	
	// Build URL with query parameters as specified in the documentation
	const url = 'https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo';
	const queryString = [
		`datasetSchema=${datasetSchema ? 'True' : 'False'}`,
		`datasetExpressions=${datasetExpressions ? 'True' : 'False'}`,
		`lineage=${lineage ? 'True' : 'False'}`,
		`datasourceDetails=${datasourceDetails ? 'True' : 'False'}`,
	].join('&');
	
	const fullUrl = `${url}?${queryString}`;
	
	// Set up request body with the list of workspace IDs
	const requestBody = { workspaces };
	
	// Make the request to the admin endpoint using the POST method
	const options = {
		method: 'POST',
		body: requestBody,
		uri: fullUrl,
		json: true,
		headers: {
			'Content-Type': 'application/json',
		},
	};
		// Use direct authentication to ensure the POST method is used correctly
	const responseData = await this.helpers.requestWithAuthentication.call(
		this,
		'powerBiApiOAuth2Api',
		options
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
