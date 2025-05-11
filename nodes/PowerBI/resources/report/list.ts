import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Lista todos os relatórios
 */
export async function list(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Obter ID do grupo (workspace) se fornecido
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	
	// Construir o endpoint com base no ID do grupo fornecido
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports` : '/reports';
	
	// Fazer chamada à API
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	) as JsonObject;
	
	// Processar os dados de resposta
	const reportItems = (responseData.value as IDataObject[] || []);
	for (const item of reportItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
