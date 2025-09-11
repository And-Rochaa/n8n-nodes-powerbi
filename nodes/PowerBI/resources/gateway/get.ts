import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { powerBiApiRequest } from '../../GenericFunctions';

export async function getGateway(
	this: IExecuteFunctions,
	index: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const gatewayId = this.getNodeParameter('gatewayId', index) as string;
	const endpoint = `/gateways/${gatewayId}`;
	
	// Make API call
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	);
	
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } }
	);
	returnData.push(...executionData);
	
	return returnData;
}
