import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
} from 'n8n-workflow';

/**
 * Gets an access token using Service Principal credentials
 */
export async function getServicePrincipalToken(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Retrieve parameters provided by user
	const tenantId = this.getNodeParameter('tenantId', i) as string;
	const clientId = this.getNodeParameter('clientId', i) as string;
	const clientSecret = this.getNodeParameter('clientSecret', i) as string;	const resource = this.getNodeParameter('apiResource', i, 'https://analysis.windows.net/powerbi/api') as string;
	const grantType = this.getNodeParameter('grantType', i, 'client_credentials') as string;
	
	try {
		// Build token URL
		const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
		
		// Request configuration
		const options = {
			method: 'POST' as IHttpRequestMethods,
			url: tokenUrl,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			form: {
				grant_type: grantType,
				client_id: clientId,
				client_secret: clientSecret,
				resource: resource,
			},
			json: true,
		};
		
		// Make HTTP request
		const response = await this.helpers.httpRequest(options) as JsonObject;
		
		// Check if the response contains an access token
		if (!response.access_token) {
			throw new Error('Response does not contain a valid access token');
		}
		
		// Build return object with token data
		const responseData: IDataObject = {
			access_token: response.access_token,
			token_type: response.token_type || 'Bearer',
			expires_in: response.expires_in,
			expires_on: response.expires_on,
			resource: response.resource,
			ext_expires_in: response.ext_expires_in,
		};
		
		// Return token data
		returnData.push({
			json: responseData,
		});
		
		return returnData;
	} catch (error) {
		// Handle errors more informatively
		if (error.response) {
			const errorMessage = error.response.data?.error_description || 
								 error.response.data?.error || 
								 'Token acquisition error';
			throw new Error(`Token request error: ${errorMessage}`);
		}
		throw new Error(`Failed to get Service Principal token: ${error.message}`);
	}
}
