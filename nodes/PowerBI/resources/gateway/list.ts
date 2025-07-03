import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Lists all gateways for which the user is an administrator
 */
export async function list(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		// Make request to list gateways
		const response = await powerBiApiRequest.call(
			this,
			'GET',
			'/gateways',
		);

		// Check if there are gateways in the response
		if (response.value && Array.isArray(response.value)) {
			// Return each gateway as a separate item
			response.value.forEach((gateway: any) => {
				returnData.push({
					json: gateway,
				});
			});
		} else {
			// If there are no gateways, return empty object
			returnData.push({
				json: {
					message: 'No gateways found',
					value: [],
				},
			});
		}

		return returnData;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new NodeApiError(this.getNode(), error.response.data, { 
				message: `Status: ${error.response.status || 'Error'}`,
				description: `Failed to list gateways: ${JSON.stringify(error.response.data)}`,
				httpCode: error.response.status ? error.response.status.toString() : '500',
			});
		}
		throw error;
	}
}
