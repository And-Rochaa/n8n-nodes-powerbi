import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

/**
 * Refresh an access token using a refresh token
 */
export async function refreshToken(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	try {
		// Retrieve parameters provided by the user
		const tokenUrl = this.getNodeParameter('tokenUrl', i) as string;
		const clientId = this.getNodeParameter('clientId', i) as string;
		const clientSecret = this.getNodeParameter('clientSecret', i) as string;
		const refreshToken = this.getNodeParameter('refreshToken', i) as string;
		const redirectUri = this.getNodeParameter('redirectUri', i) as string;
		const grantType = this.getNodeParameter('grantType', i, 'refresh_token') as string;
		const scope = this.getNodeParameter('scope', i, 'https://analysis.windows.net/powerbi/api/.default offline_access') as string;
		
		// Prepare form data for POST request
		const formData = new URLSearchParams();
		formData.append('client_id', clientId);
		formData.append('client_secret', clientSecret);
		formData.append('refresh_token', refreshToken);
		formData.append('redirect_uri', redirectUri);
		formData.append('grant_type', grantType);
		formData.append('scope', scope);
		
		// Make request to get token
		const response = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		});
		
		// Check if response was successful
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Failed to refresh token: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
		}
		
		// Process and return token data
		const tokenData = await response.json();
		
		returnData.push({
			json: tokenData,
		});
		
		return returnData;
	} catch (error) {
		// Handle errors
		if (error.response) {
			const errorMessage = `Request error: ${error.response.statusCode} - ${error.response.statusMessage}`;
			throw new Error(errorMessage);
		}
		throw error;
	}
}
