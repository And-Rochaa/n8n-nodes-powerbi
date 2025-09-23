import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function getDatasourceStatus(
	this: IExecuteFunctions,
	index: number
): Promise<INodeExecutionData[]> {
	const gatewayId = this.getNodeParameter('gatewayId', index) as string;
	const datasourceId = this.getNodeParameter('datasourceId', index) as string;

	if (!gatewayId) {
		throw new NodeOperationError(this.getNode(), 'Gateway ID is required');
	}

	if (!datasourceId) {
		throw new NodeOperationError(this.getNode(), 'Datasource ID is required');
	}

	const endpoint = `/gateways/${gatewayId}/datasources/${datasourceId}/status`;

	try {
		const responseData = await powerBiApiRequest.call(this, 'GET', endpoint);

		const executionData = this.helpers.constructExecutionMetaData(
			[{ json: responseData as IDataObject }],
			{ itemData: { item: index } },
		);

		return executionData;
	} catch (error) {
		if (error.httpCode === '403') {
			throw new NodeOperationError(this.getNode(),
				`Error 403: You don't have permission to check the status of this data source (Gateway: ${gatewayId}, Datasource: ${datasourceId}). Please verify that you have administrator access to the gateway and data source.`
			);
		}
		
		if (error.httpCode === '404') {
			throw new NodeOperationError(this.getNode(),
				`Error 404: Gateway (${gatewayId}) or data source (${datasourceId}) not found. Please verify that the IDs are correct and that you have access to them.`
			);
		}

		throw new NodeOperationError(this.getNode(),
			`Error checking data source status: ${error.message || error}`
		);
	}
}
