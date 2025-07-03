import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function getDatasourceStatus(
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
	let authToken = this.getNodeParameter('authToken', index) as string;
	
	// Remove the "Bearer" prefix if already present in the token
	if (authToken.trim().toLowerCase().startsWith('bearer ')) {
		authToken = authToken.trim().substring(7);
	}
	
	// Prepare the authorization header
	const headers: IDataObject = {
		Authorization: `Bearer ${authToken}`,
	};

	const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/status`;

	try {
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			{},
			{},
			headers,
		);

		const executionData = this.helpers.constructExecutionMetaData(
			[{ json: responseData as IDataObject }],
			{ itemData: { item: index } },
		);

		return executionData;
	} catch (error) {
		if (error.httpCode === '403') {
			throw new Error(
				`Error 403: You don't have permission to check the status of this data source (Gateway: ${gatewayId}, Datasource: ${datasourceId}). Please verify that you have administrator access to the gateway and data source.`
			);
		}
		
		if (error.httpCode === '404') {
			throw new Error(
				`Error 404: Gateway (${gatewayId}) or data source (${datasourceId}) not found. Please verify that the IDs are correct and that you have access to them.`
			);
		}

		throw new Error(
			`Error checking data source status: ${error.message || error}`
		);
	}
}
