import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function getDatasources(
	this: IExecuteFunctions,
	index: number
): Promise<INodeExecutionData[]> {
	const gatewayId = this.getNodeParameter('gatewayId', index) as string;
	const qs = {};
	
	const responseData = await powerBiApiRequest.call(this, 'GET', `/gateways/${gatewayId}/datasources`, {}, qs);
	
	return this.helpers.returnJsonArray(responseData.value);
}
