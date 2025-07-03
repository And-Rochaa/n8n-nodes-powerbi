import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function list(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;

	if (!groupId) {
		throw new NodeOperationError(this.getNode(), 'Group ID is required!');
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

	try {
		const endpoint = `/groups/${groupId}/dataflows`;
		
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			{}, // body
			{}, // qs
			headers, // headers
		);

		if (responseData.value && Array.isArray(responseData.value)) {
			return responseData.value.map((dataflow: IDataObject) => ({
				json: dataflow,
			}));
		}

		return [{ json: responseData }];
	} catch (error) {
		if (error.statusCode === 403) {
			throw new NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to access this workspace and that the workspace supports dataflows.');
		}
		throw new NodeOperationError(this.getNode(), `Error getting dataflows: ${error.message}`);
	}
}
