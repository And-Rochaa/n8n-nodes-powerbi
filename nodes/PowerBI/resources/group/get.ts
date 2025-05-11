import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Obtém um grupo específico pelo ID
 */
export async function get(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Obter parâmetro de ID do grupo
	const groupId = this.getNodeParameter('groupId', i) as string;
	
	// Fazer requisição à API
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		`/groups/${groupId}`,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
