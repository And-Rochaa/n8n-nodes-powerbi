import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;
	const dataflowId = this.getNodeParameter('dataflowId', index) as string;

	if (!groupId) {
		throw new NodeOperationError(this.getNode(), 'Group ID is required!');
	}

	if (!dataflowId) {
		throw new NodeOperationError(this.getNode(), 'Dataflow ID is required!');
	}

	try {
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

		const endpoint = `/groups/${groupId}/dataflows/${dataflowId}`;
		
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			{},
			{},
			headers,
		);

		// The API returns the dataflow definition as JSON
		return [{ json: responseData }];
	} catch (error) {
		if (error.statusCode === 403) {
			throw new NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to access this dataflow.');
		}
		if (error.statusCode === 404) {
			throw new NodeOperationError(this.getNode(), 'Dataflow not found. Please verify that the ID is correct.');
		}
		throw new NodeOperationError(this.getNode(), `Error getting dataflow: ${error.message}`);
	}
}
