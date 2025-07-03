import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

/**
 * Get an access token using the authorization code
 */
export async function getToken(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Retrieve parameters provided by the user
	const tokenUrl = this.getNodeParameter('tokenUrl', i) as string;
	const clientId = this.getNodeParameter('clientId', i) as string;
	const clientSecret = this.getNodeParameter('clientSecret', i) as string;
	const code = this.getNodeParameter('code', i) as string;
	const redirectUri = this.getNodeParameter('redirectUri', i) as string;
	const grantType = this.getNodeParameter('grantType', i) as string;
	const scope = this.getNodeParameter('scope', i) as string;
		try {
		// Request configuration
		const options = {
			method: 'POST',
			url: tokenUrl,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			form: {
				client_id: clientId,
				client_secret: clientSecret,
				code,
				redirect_uri: redirectUri,
				grant_type: grantType,
				scope,
			},
			json: true,
		};
		
		// Make HTTP request
		const response = await this.helpers.request(options) as JsonObject;
		
		// Check if response contains an access token
		if (!response.access_token) {
			throw new Error('Response does not contain a valid access token');
		}
		
		// Build return object with token data
		const responseData: IDataObject = {
			access_token: response.access_token,
			token_type: response.token_type || 'Bearer',
			expires_in: response.expires_in,
			refresh_token: response.refresh_token,
			scope: response.scope,
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
		throw new Error(`Failed to get token: ${error.message}`);
	}
}
