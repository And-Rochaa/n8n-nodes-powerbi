import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { powerBiApiRequest } from '../../GenericFunctions';

/**
 * Obtém as páginas de um relatório específico
 */
export async function getPages(
	this: IExecuteFunctions,
	i: number
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	// Obter parâmetros
	const groupId = this.getNodeParameter('groupId', i, '') as string;
	const reportId = this.getNodeParameter('reportId', i) as string;
	
	// Construir endpoint baseado no grupo selecionado
	const endpoint = groupId && groupId !== 'me' ? 
		`/groups/${groupId}/reports/${reportId}/pages` : `/reports/${reportId}/pages`;
	
	// Fazer chamada à API
	const responseData = await powerBiApiRequest.call(
		this,
		'GET',
		endpoint,
	) as JsonObject;
	
	// Processar os dados de resposta
	const pageItems = (responseData.value as IDataObject[] || []);
	for (const item of pageItems) {
		returnData.push({
			json: item,
		});
	}
	
	return returnData;
}
