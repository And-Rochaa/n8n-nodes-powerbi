import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function getDatasourceUsers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const gatewayId = this.getNodeParameter('gatewayId', index) as string;
	const datasourceId = this.getNodeParameter('datasourceId', index) as string;

	if (!gatewayId) {
		throw new Error('Gateway ID is required');
	}

	if (!datasourceId) {
		throw new Error('Datasource ID is required');
	}

	// Get authentication token
	let authToken = '';
	try {
		// First try to get from input parameter
		const inputData = this.getInputData();
		if (inputData[index]?.json?.access_token) {
			authToken = inputData[index].json.access_token as string;
		} else {
			// If not found in input, get from node parameter
			authToken = this.getNodeParameter('authToken', index) as string;
		}
	} catch (error) {
		throw new Error('Failed to get authentication token');
	}

	if (!authToken) {
		throw new Error('Authentication token is required');
	}

	// Remove the "Bearer" prefix if already present in the token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}

	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};

	const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/users`;

	try {
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			undefined,
			undefined,
			headers,
		);

		// If the response contains a 'value' property, return individual items
		if (responseData.value && Array.isArray(responseData.value)) {
			return responseData.value.map((user: any) => ({
				json: user,
				pairedItem: { item: index },
			}));
		}

		// If there's no 'value' property, return the complete response
		return [{
			json: responseData,
			pairedItem: { item: index },
		}];

	} catch (error) {
		// Better error handling with more details
		const errorMessage = error.message || error.toString();
		throw new Error(`Error getting data source users (Gateway: ${gatewayId}, Datasource: ${datasourceId}): ${errorMessage}. Please verify that you have administrator permissions on the gateway and that the IDs are correct.`);
	}
}
