import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

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

	const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/users`;

	try {
		const responseData = await powerBiApiRequest.call(
			this,
			'GET',
			endpoint,
		);

		// If the response contains a 'value' property, return individual users
		if (responseData.value && Array.isArray(responseData.value)) {
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData.value),
				{ itemData: { item: index } }
			);
			return executionData;
		}

		// If there's no 'value' property, return the complete response
		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData),
			{ itemData: { item: index } }
		);
		return executionData;

	} catch (error) {
		// Better error handling with more details
		const errorMessage = error.message || error.toString();
		throw new Error(`Error getting data source users (Gateway: ${gatewayId}, Datasource: ${datasourceId}): ${errorMessage}. Please verify that you have administrator permissions on the gateway and that the IDs are correct.`);
	}
}
