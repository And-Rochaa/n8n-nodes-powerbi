import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

/**
 * Gets detailed workspace information
 */
export async function getInfo(
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
	
	// Get selected workspaces
	const workspaces = this.getNodeParameter('workspaces', i) as string[];
	
	// Check if workspaces were selected
	if (!workspaces || workspaces.length === 0) {
		throw new Error('It is necessary to select at least one workspace');
	}
	
	// Get options
	const datasetSchema = this.getNodeParameter('datasetSchema', i, false) as boolean;
	const datasetExpressions = this.getNodeParameter('datasetExpressions', i, false) as boolean;
	const lineage = this.getNodeParameter('lineage', i, false) as boolean;
	const datasourceDetails = this.getNodeParameter('datasourceDetails', i, false) as boolean;
			
	// Build query parameters
	const queryParameters: IDataObject = {
		datasetSchema: datasetSchema ? 'True' : 'False',
		datasetExpressions: datasetExpressions ? 'True' : 'False',
		lineage: lineage ? 'True' : 'False',
		datasourceDetails: datasourceDetails ? 'True' : 'False',
	};
	
	// Make the request to the administration endpoint with POST method
	const options: IHttpRequestOptions = {
		method: 'POST',
		body: { workspaces },
		qs: queryParameters,
		url: 'https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo',
		json: true,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	};
	
	// Use direct HTTP request
	const responseData = await this.helpers.httpRequest(options);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
