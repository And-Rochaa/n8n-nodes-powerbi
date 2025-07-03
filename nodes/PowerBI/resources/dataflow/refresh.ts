import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function refresh(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;
	const dataflowId = this.getNodeParameter('dataflowId', index) as string;
	const notifyOption = this.getNodeParameter('notifyOption', index, 'NoNotification') as string;
	const processType = this.getNodeParameter('processType', index) as string;

	if (!groupId) {
		throw new NodeOperationError(this.getNode(), 'Group ID is required!');
	}

	if (!dataflowId) {
		throw new NodeOperationError(this.getNode(), 'Dataflow ID is required!');
	}

	try {
		// Prepare the request body
		const body: IDataObject = {
			notifyOption,
		};

		// Prepare query parameters
		const qs: IDataObject = {};
		if (processType) {
			qs.processType = processType;
		}

		const endpoint = `/groups/${groupId}/dataflows/${dataflowId}/refreshes`;
		
		await powerBiApiRequest.call(
			this,
			'POST',
			endpoint,
			body,
			qs,
		);

		// The API returns 200 OK with no content on success
		return [{ json: { success: true, message: 'Dataflow refresh triggered successfully' } }];
	} catch (error) {
		if (error.statusCode === 403) {
			throw new NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to refresh this dataflow.');
		}
		if (error.statusCode === 404) {
			throw new NodeOperationError(this.getNode(), 'Dataflow not found. Please verify that the ID is correct.');
		}
		throw new NodeOperationError(this.getNode(), `Error refreshing dataflow: ${error.message}`);
	}
}
