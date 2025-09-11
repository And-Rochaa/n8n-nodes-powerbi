import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function getDatasources(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;
	const dataflowId = this.getNodeParameter('dataflowId', index) as string;

	if (!groupId) {
		throw new NodeOperationError(this.getNode(), 'Workspace ID is required!');
	}

	if (!dataflowId) {
		throw new NodeOperationError(this.getNode(), 'Dataflow ID is required!');
	}

	try {
		const endpoint = `/groups/${groupId}/dataflows/${dataflowId}/datasources`;
		
		const responseData = await powerBiApiRequest.call(
			this,
			'GET',
			endpoint,
		);

		// If the response contains a 'value' property, return individual datasources
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
		if (error.statusCode === 403) {
			throw new NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to access this dataflow.');
		}
		if (error.statusCode === 404) {
			throw new NodeOperationError(this.getNode(), 'Dataflow not found. Please verify that the workspace and dataflow IDs are correct.');
		}
		throw new NodeOperationError(this.getNode(), `Error getting dataflow datasources: ${error.message}`);
	}
}
