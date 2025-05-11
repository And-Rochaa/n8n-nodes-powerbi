import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Obtém um relatório específico pelo ID
 */
export async function get(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Obter parâmetros
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const reportId = this.getNodeParameter('reportId', i) as string;
	
	// Construir endpoint baseado no grupo selecionado
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports/${reportId}` : `/reports/${reportId}`;
	
	// Fazer chamada à API
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	);
	
	returnData.push({
		json: responseData,
	});
	
	return returnData;
}
