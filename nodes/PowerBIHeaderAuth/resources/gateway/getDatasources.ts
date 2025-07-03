import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function getDatasources(
	this: IExecuteFunctions,
	index: number
): Promise<INodeExecutionData[]> {
	const gatewayId = this.getNodeParameter('gatewayId', index) as string;
	
	// Get authentication token
	let authToken = this.getNodeParameter('authToken', index) as string;
	
	// Remove the "Bearer" prefix if already present in the token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}
	
	// Prepare the authorization header
	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};
	
	const qs = {};
	
	const responseData = await powerBiApiRequestWithHeaders.call(this, 'GET', `/gateways/${gatewayId}/datasources`, {}, qs, headers);
	
	return this.helpers.returnJsonArray(responseData.value);
}
