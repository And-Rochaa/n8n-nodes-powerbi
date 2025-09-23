import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function listDataflows(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;

	if (!groupId) {
		throw new NodeOperationError(this.getNode(), 'Workspace ID is required');
	}

	const endpoint = `/groups/${groupId}/dataflows`;

	try {
		const responseData = await powerBiApiRequest.call(
			this,
			'GET',
			endpoint,
		);

		const returnData: INodeExecutionData[] = [];
		
		// If the response contains a 'value' property, return individual items
		if (responseData.value && Array.isArray(responseData.value)) {
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData.value),
				{ itemData: { item: index } }
			);
			returnData.push(...executionData);
		} else {
			// If there's no 'value' property, return the complete response
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData),
				{ itemData: { item: index } }
			);
			returnData.push(...executionData);
		}

		return returnData;

	} catch (error) {
		// Better error handling with more details
		const errorMessage = error.message || error.toString();
		throw new NodeOperationError(this.getNode(), `Error getting dataflows (Workspace: ${groupId}): ${errorMessage}. Please verify that you have adequate permissions in the workspace.`);
	}
}
