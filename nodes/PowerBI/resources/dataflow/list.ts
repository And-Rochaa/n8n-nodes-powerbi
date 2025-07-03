import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function listDataflows(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;

	if (!groupId) {
		throw new Error('Workspace ID is required');
	}

	const endpoint = `/groups/${groupId}/dataflows`;

	try {
		const responseData = await powerBiApiRequest.call(
			this,
			'GET',
			endpoint,
		);

		// If the response contains a 'value' property, return individual items
		if (responseData.value && Array.isArray(responseData.value)) {
			return responseData.value.map((dataflow: any) => ({
				json: dataflow,
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
		throw new Error(`Error getting dataflows (Workspace: ${groupId}): ${errorMessage}. Please verify that you have adequate permissions in the workspace.`);
	}
}
