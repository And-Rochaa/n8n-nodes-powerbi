import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { powerBiApiRequestWithHeaders } from '../../GenericFunctions';

export async function getDatasources(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;
	const dataflowId = this.getNodeParameter('dataflowId', index) as string;

	if (!groupId) {
		throw new NodeOperationError(this.getNode(), 'Group ID is required!');
	}

	if (!dataflowId) {
		throw new NodeOperationError(this.getNode(), 'Dataflow ID is required!');
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
		const endpoint = `/groups/${groupId}/dataflows/${dataflowId}/datasources`;
		
		const responseData = await powerBiApiRequestWithHeaders.call(
			this,
			'GET',
			endpoint,
			{}, // body
			{}, // qs
			headers, // headers
		);

		// If the response contains a 'value' property, return individual datasources
		if (responseData.value && Array.isArray(responseData.value)) {
			return responseData.value.map((datasource: IDataObject) => ({
				json: datasource,
			}));
		}

		// If there's no 'value' property, return the complete response
		return [{ json: responseData }];

	} catch (error) {
		if (error.statusCode === 403) {
			throw new NodeOperationError(this.getNode(), 'Access denied. Please verify that you have permissions to access this dataflow.');
		}
		if (error.statusCode === 404) {
			throw new NodeOperationError(this.getNode(), 'Dataflow not found. Please verify that the group and dataflow IDs are correct.');
		}
		throw new NodeOperationError(this.getNode(), `Error getting dataflow datasources: ${error.message}`);
	}
}
