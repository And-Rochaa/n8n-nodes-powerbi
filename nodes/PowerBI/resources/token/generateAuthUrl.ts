import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

/**
 * Generates an OAuth2 authentication URL for Microsoft Entra ID
 */
export async function generateAuthUrl(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Retrieve parameters provided by user
	const baseUrl = this.getNodeParameter('url', i) as string;
	const clientId = this.getNodeParameter('clientId', i) as string;
	const responseType = this.getNodeParameter('responseType', i) as string;
	const redirectUri = this.getNodeParameter('redirectUri', i) as string;
	const responseMode = this.getNodeParameter('responseMode', i) as string;
	const scope = this.getNodeParameter('scope', i) as string;
	const state = this.getNodeParameter('state', i, '') as string;
	
	// Build authentication URL
	let authUrl = `${baseUrl}?client_id=${encodeURIComponent(clientId)}&response_type=${encodeURIComponent(responseType)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=${encodeURIComponent(responseMode)}&scope=${encodeURIComponent(scope)}`;
	
	// Add state if provided
	if (state) {
		authUrl += `&state=${encodeURIComponent(state)}`;
	}
	
	// Return generated URL
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray({
			authUrl,
			baseUrl,
			clientId,
			responseType,
			redirectUri,
			responseMode,
			scope,
			state,
		}),
		{ itemData: { item: i } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
